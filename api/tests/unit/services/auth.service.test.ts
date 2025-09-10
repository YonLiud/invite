import { createTestUser, createTestUsers, clearTestDatabase } from "../../utils/test-helpers";

describe('AuthService', () => {
  beforeEach(async () => {
    await clearTestDatabase();
  });

  it('should create a user', async () => {
    const user = await createTestUser({
      username: 'testuser',
      password: 'password123',
      displayName: 'Test User'
    });
    
    expect(user.username).toBe('testuser');
  });
});