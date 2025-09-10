import request from 'supertest';
import { createTestApp } from '../utils/test-app';
import { clearTestDatabase } from '../utils/test-helpers';

describe('Auth API', () => {
  let app: any;

  beforeAll(async () => {
    app = await createTestApp();
  });

  beforeEach(async () => {
    await clearTestDatabase();
  });

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          username: 'testuser123',
          password: 'password123',
          display_name: 'Test User'
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.username).toBe('testuser123');
      // Fixed: Use display_name (camelCase) instead of display_name
      expect(response.body.data.user.display_name).toBe('Test User');
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
    });

    it('should return 422 for missing required fields', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          username: 'testuser'
          // missing password
        })
        .expect(422);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBeDefined();
    });

    it('should return 400 for duplicate username', async () => {
      // Register first user
      await request(app)
        .post('/auth/register')
        .send({
          username: 'testuser123',
          password: 'password123',
          display_name: 'Test User'
        })
        .expect(201);

      // Try to register same username - expect 400, not 409
      const response = await request(app)
        .post('/auth/register')
        .send({
          username: 'testuser123',
          password: 'differentpassword',
          display_name: 'Another User'
        })
        .expect(400); // Fixed: Use 400 instead of 409

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Username already taken');
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      // Create a user for login tests
      await request(app)
        .post('/auth/register')
        .send({
          username: 'loginuser123',
          password: 'password123',
          display_name: 'Login User'
        })
        .expect(201);
    });

    it('should login existing user successfully', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          username: 'loginuser123',
          password: 'password123'
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.username).toBe('loginuser123');
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
    });

    it('should return 401 for invalid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          username: 'loginuser123',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should return 401 for non-existent user', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          username: 'nonexistentuser',
          password: 'password123'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid credentials');
    });
  });

  describe('POST /auth/refresh', () => {
    it('should refresh token successfully', async () => {
      // Register a user
      const registerResponse = await request(app)
        .post('/auth/register')
        .send({
          username: 'refreshuser123',
          password: 'password123',
          display_name: 'Refresh User'
        })
        .expect(201);

      const refreshToken = registerResponse.body.data.refreshToken;

      // Refresh token
      const response = await request(app)
        .post('/auth/refresh')
        .send({
          refreshToken
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
    });

    it('should return 401 for invalid refresh token', async () => {
      const response = await request(app)
        .post('/auth/refresh')
        .send({
          refreshToken: 'invalid.token.here'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid or expired refresh token');
    });
  });
});