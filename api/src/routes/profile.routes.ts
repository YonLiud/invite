import { Router } from "express";
import { ProfileController } from "../controllers/ProfileController";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
const profileController = new ProfileController();

router.get("/", (req, res) => profileController.listProfiles(req, res));
router.get("/search", (req, res) => profileController.searchProfiles(req, res));
router.get("/:username", (req, res) =>
  profileController.getProfileByUsername(req, res),
);

router.get("/me", authMiddleware, (req, res) =>
  profileController.getMyProfile(req, res),
);
router.put("/:username", authMiddleware, (req, res) =>
  profileController.updateProfile(req, res),
);
router.delete("/:username", authMiddleware, (req, res) =>
  profileController.deleteProfile(req, res),
);

export default router;
