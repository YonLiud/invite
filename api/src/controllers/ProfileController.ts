import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import { ProfileService } from "../services/ProfileService";
import { Profile } from "../entities/Profile";

export class ProfileController extends BaseController {
  private profileService: ProfileService;

  constructor() {
    super();
    this.profileService = new ProfileService();
  }

  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const profileId = parseInt(req.params.id, 10);
      if (isNaN(profileId)) {
        this.sendValidationError(res, ["Invalid profile ID"]);
        return;
      }
      const profile = await this.profileService.findById(profileId);
      if (!profile) {
        this.sendNotFound(res, "Profile not found");
        return;
      }
      const profileResponse = {
        id: profile.id,
        username: profile.username,
        display_name: profile.display_name,
        createdAt: profile.created_at,
      };
      this.sendSuccess(res, profileResponse);
    } catch (error) {
      if (error instanceof Error) {
        this.sendError(res, error.message, 500);
      } else {
        this.sendError(res, "Unknown error occurred", 500);
      }
    }
  }
  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const { username } = req.params; // ✅ Changed from ID to username
      const updates = req.body;

      // Check if user is authorized to update this profile
      if (!req.user || req.user.username !== username) {
        // ✅ Changed to username comparison
        this.sendUnauthorized(res, "You can only update your own profile");
        return;
      }

      // Find profile by username
      const profile = await this.profileService.findByUsername(username);
      if (!profile) {
        this.sendNotFound(res, "Profile not found");
        return;
      }

      const updatedProfile = await this.profileService.updateProfile(
        profile.id,
        updates,
      );
      if (!updatedProfile) {
        this.sendNotFound(res, "Profile not found");
        return;
      }

      const profileResponse = {
        id: updatedProfile.id,
        username: updatedProfile.username,
        display_name: updatedProfile.display_name,
        createdAt: updatedProfile.created_at,
        updatedAt: updatedProfile.updated_at,
      };

      this.sendSuccess(
        res,
        profileResponse,
        "Profile updated successfully",
        200,
      );
    } catch (error) {
      if (error instanceof Error) {
        this.sendError(res, error.message, 500);
      } else {
        this.sendError(res, "Unknown error occurred", 500);
      }
    }
  }

  async deleteProfile(req: Request, res: Response): Promise<void> {
    try {
      const { username } = req.params; // ✅ Changed from ID to username

      // Check if user is authorized to delete this profile
      if (!req.user || req.user.username !== username) {
        // ✅ Changed to username comparison
        this.sendUnauthorized(res, "You can only delete your own profile");
        return;
      }

      // Find profile by username
      const profile = await this.profileService.findByUsername(username);
      if (!profile) {
        this.sendNotFound(res, "Profile not found");
        return;
      }

      const success = await this.profileService.deleteProfile(profile.id);
      if (!success) {
        this.sendError(res, "Failed to delete profile", 500);
        return;
      }

      this.sendSuccess(res, null, "Profile deleted successfully");
    } catch (error) {
      if (error instanceof Error) {
        this.sendError(res, error.message, 500);
      } else {
        this.sendError(res, "Unknown error occurred", 500);
      }
    }
  }
  async listProfiles(req: Request, res: Response): Promise<void> {
    try {
      const { search, limit = "50" } = req.query;
      const limitNum = Math.min(parseInt(limit as string, 10) || 50, 100);
      let profiles: Profile[];
      if (search && typeof search === "string") {
        profiles = await this.profileService.searchProfiles(search, limitNum);
      } else {
        profiles = await this.profileService.findAll();
      }
      const profilesResponse = profiles.map((profile) => ({
        id: profile.id,
        username: profile.username,
        display_name: profile.display_name,
        createdAt: profile.created_at,
      }));
      this.sendSuccess(res, profilesResponse, "", 200);
    } catch (error) {
      if (error instanceof Error) {
        this.sendError(res, error.message, 500);
      } else {
        this.sendError(res, "Unknown error occurred", 500);
      }
    }
  }

  async searchProfiles(req: Request, res: Response): Promise<void> {
    try {
      const { query, limit = "20" } = req.query;
      if (!query || typeof query !== "string") {
        this.sendValidationError(res, ["Search query is required"]);
        return;
      }
      const limitNum = Math.min(parseInt(limit as string, 10) || 20, 100);
      const profiles = await this.profileService.searchProfiles(
        query,
        limitNum,
      );
      const profilesResponse = profiles.map((profile) => ({
        id: profile.id,
        username: profile.username,
        display_name: profile.display_name,
        createdAt: profile.created_at,
      }));
      this.sendSuccess(res, profilesResponse);
    } catch (error) {
      if (error instanceof Error) {
        this.sendError(res, error.message, 500);
      } else {
        this.sendError(res, "Unknown error occurred", 500);
      }
    }
  }

  async getMyProfile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        this.sendUnauthorized(res, "Not authenticated");
        return;
      }
      const profile = await this.profileService.findById(req.user.id);
      if (!profile) {
        this.sendNotFound(res, "Profile not found");
        return;
      }
      const profileResponse = {
        id: profile.id,
        username: profile.username,
        display_name: profile.display_name,
        createdAt: profile.created_at,
      };
      this.sendSuccess(res, profileResponse);
    } catch (error) {
      if (error instanceof Error) {
        this.sendError(res, error.message, 500);
      } else {
        this.sendError(res, "Unknown error occurred", 500);
      }
    }
  }

  async getProfileByUsername(req: Request, res: Response): Promise<void> {
    try {
      const { username } = req.params;

      const profile = await this.profileService.findByUsername(username);
      if (!profile) {
        this.sendNotFound(res, "Profile not found");
        return;
      }

      const profileResponse = {
        id: profile.id,
        username: profile.username,
        display_name: profile.display_name,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at,
      };

      this.sendSuccess(res, profileResponse);
    } catch (error) {
      if (error instanceof Error) {
        this.sendError(res, error.message, 500);
      } else {
        this.sendError(res, "Unknown error occurred", 500);
      }
    }
  }
}
