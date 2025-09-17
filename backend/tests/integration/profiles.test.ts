import request from "supertest";
import { createTestApp } from "../utils/test-app";
import { clearTestDatabase } from "../utils/test-helpers";

describe("Profiles API", () => {
  let app: any;
  let authToken: string;

  beforeAll(async () => {
    app = await createTestApp();
  });

  beforeEach(async () => {
    await clearTestDatabase();

    // Register a user for authenticated tests
    const registerResponse = await request(app)
      .post("/auth/register")
      .send({
        username: "testuser123",
        password: "password123",
        display_name: "Test User",
      })
      .expect(201);

    authToken = registerResponse.body.data.accessToken;
  });

  describe("GET /profiles", () => {
    it("should return list of profiles", async () => {
      const response = await request(app).get("/profiles").expect(200);

      expect(response.body.success).toBe(true);
      // Fixed: Check actual response structure
      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe("GET /profiles/:username", () => {
    it("should return profile by username", async () => {
      const response = await request(app)
        .get("/profiles/testuser123")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.username).toBe("testuser123");
      // Fixed: Use display_name (camelCase)
      expect(response.body.data.display_name).toBe("Test User");
    });

    it("should return 404 for non-existent profile", async () => {
      const response = await request(app)
        .get("/profiles/nonexistentuser")
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Profile not found");
    });
  });

  describe("PUT /profiles/:username", () => {
    it("should update own profile successfully", async () => {
      const response = await request(app)
        .put("/profiles/testuser123")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          display_name: "Updated Test User", // Fixed: Use display_name
          current_password: "password123",
          new_password: "newpassword456",
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      // Fixed: Use display_name
      expect(response.body.data.display_name).toBe("Updated Test User");
      expect(response.body.message).toBe("Profile updated successfully");
    });

    it("should return 401 for unauthorized update", async () => {
      const response = await request(app)
        .put("/profiles/testuser123")
        .send({
          display_name: "Hacked Name",
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      // Fixed: Match actual error message
      expect(response.body.message).toBe("Unauthorized: No token provided");
    });
  });
});
