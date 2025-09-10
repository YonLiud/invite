import "reflect-metadata";
import { AppDataSource } from "../src/data-source";
import { validateTestEnvironment } from "./utils/test-helpers";

// Validate we're in test environment
validateTestEnvironment();

// Set test-specific environment variables
process.env.JWT_SECRET = 'test-secret-key-for-testing-only';
process.env.NODE_ENV = 'test';

// Initialize test database
beforeAll(async () => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Test database initialized');
  } catch (error) {
    console.error('❌ Test database initialization failed:', error);
    throw error;
  }
});

// Clean up after all tests
afterAll(async () => {
  try {
    await AppDataSource.destroy();
    console.log('✅ Test database connection closed');
  } catch (error) {
    console.error('❌ Error closing test database:', error);
  }
});

// Clear database before each test suite
beforeEach(async () => {
  // This will be handled in individual test files as needed
});

// Log test completion
afterEach(() => {
  // console.log('✅ Test completed');
});