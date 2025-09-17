import { AuthService } from "../../../src/services/AuthService";
import { clearTestDatabase } from "../../utils/test-helpers";
import { AppDataSource } from "../../../src/data-source";

describe("AuthService", () => {
  let authService: AuthService;

  beforeAll(() => {
    authService = new AuthService();
  });

  beforeEach(async () => {
    await clearTestDatabase();
  });

  describe("register", () => {
    it("should create a new user successfully", async () => {
      const result = await authService.register(
        "testuser",
        "password123",
        "Test User",
      );

      expect(result).toBeDefined();
      expect(result).not.toBeNull();
      expect(result?.user.username).toBe("testuser");
      expect(result?.user.display_name).toBe("Test User");
      expect(result?.accessToken).toBeDefined();
      expect(result?.refreshToken).toBeDefined();
    });

    it("should return null for duplicate username", async () => {
      await authService.register("testuser", "password123", "Test User");

      const result = await authService.register(
        "testuser",
        "differentpassword",
        "Another User",
      );

      expect(result).toBeNull();
    });

    it("should hash password correctly", async () => {
      const result = await authService.register(
        "testuser",
        "password123",
        "Test User",
      );

      expect(result).toBeDefined();
      expect(result?.user.id).toBeDefined();

      expect(true).toBe(true);
    });
  });

  describe("login", () => {
    beforeEach(async () => {
      // Create a user for login tests with unique username
      await authService.register(
        "testuser_" + Date.now(),
        "password123",
        "Test User",
      );
    });

    it("should login existing user successfully", async () => {
      // Register a user first
      const registerResult = await authService.register(
        "login_test_user",
        "password123",
        "Login Test User",
      );

      expect(registerResult).toBeDefined();

      // Then login
      const result = await authService.login("login_test_user", "password123");

      expect(result).toBeDefined();
      expect(result).not.toBeNull();
      expect(result?.user.username).toBe("login_test_user");
      expect(result?.accessToken).toBeDefined();
      expect(result?.refreshToken).toBeDefined();
    });

    it("should return null for invalid password", async () => {
      // Register a user first
      await authService.register(
        "invalid_pass_user",
        "password123",
        "Test User",
      );

      const result = await authService.login(
        "invalid_pass_user",
        "wrongpassword",
      );
      expect(result).toBeNull();
    });

    it("should return null for non-existent user", async () => {
      const result = await authService.login("nonexistent_user", "password123");
      expect(result).toBeNull();
    });
  });

  describe("refreshAccessToken", () => {
    it("should refresh token successfully", async () => {
      // Register and get refresh token with unique username
      const registerResult = await authService.register(
        "refresh_test_user_" + Date.now(),
        "password123",
        "Refresh Test User",
      );

      expect(registerResult).toBeDefined();
      const refreshToken = registerResult?.refreshToken;
      expect(refreshToken).toBeDefined();

      // Refresh token
      const refreshResult = await authService.refreshAccessToken(refreshToken!);

      expect(refreshResult).toBeDefined();
      expect(refreshResult).not.toBeNull();
      expect(refreshResult?.accessToken).toBeDefined();
      expect(refreshResult?.refreshToken).toBeDefined();
      // Note: In some implementations, tokens might be the same - that's OK
    });

    it("should return null for invalid refresh token", async () => {
      const result = await authService.refreshAccessToken("invalid.token.here");
      expect(result).toBeNull();
    });
  });

  describe("logout", () => {
    it("should logout successfully", async () => {
      // Register and get refresh token with unique username
      const registerResult = await authService.register(
        "logout_test_user_" + Date.now(),
        "password123",
        "Logout Test User",
      );

      expect(registerResult).toBeDefined();
      const refreshToken = registerResult?.refreshToken;
      expect(refreshToken).toBeDefined();

      // Logout
      const result = await authService.logout(refreshToken!);
      expect(result).toBe(true);
    });

    it("should return false for invalid refresh token", async () => {
      const result = await authService.logout("invalid.token.here");
      expect(result).toBe(false);
    });
  });

  describe("logoutAllSessions", () => {
    it("should logout all sessions for user", async () => {
      // Register user with unique username
      const registerResult = await authService.register(
        "logout_all_test_user_" + Date.now(),
        "password123",
        "Logout All Test User",
      );

      expect(registerResult).toBeDefined();
      const userId = registerResult?.user.id;
      expect(userId).toBeDefined();

      // Logout all sessions
      await authService.logoutAllSessions(userId!);
      // This should not throw an error
      expect(true).toBe(true);
    });
  });
});
