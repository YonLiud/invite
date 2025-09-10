import "reflect-metadata";
import { AppDataSource } from "../src/data-source";

// Set test-specific environment variables
process.env.JWT_SECRET = "test-secret-key-for-testing-only";
process.env.NODE_ENV = "test";

// Initialize test database
beforeAll(async () => {
  try {
    await AppDataSource.initialize();
    console.log("✅ Test database initialized");
  } catch (error: any) {
    console.error("❌ Test database initialization failed:", error.message);
  }
});

// Clean up after all tests
afterAll(async () => {
  try {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log("✅ Test database connection closed");
    }
  } catch (error: any) {
    console.error("❌ Error closing test database:", error.message);
  }
});
