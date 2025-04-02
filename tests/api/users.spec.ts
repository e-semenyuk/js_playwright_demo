import { test, expect } from '../../src/fixtures/test-fixtures';
import { generateTestData } from '../../src/fixtures/test-fixtures';
import { logInfo } from '../../src/utils/logger';
import { User, CreateUserRequest } from '../../src/api-clients/users-api';
import { ApiError } from '../../src/utils/api-error';

test.describe('Users API', () => {
  const isApiError = (error: unknown): error is ApiError => {
    return error instanceof ApiError;
  };

  type CreateUserRequest = {
    username: string;
    email: string;
    password: string;
  };

  test('should create a new user', async ({ usersApi }) => {
    logInfo('Starting create user test');

    // Prepare test data
    const newUser: CreateUserRequest = {
      username: generateTestData.uniqueUsername(),
      email: generateTestData.uniqueEmail(),
      password: generateTestData.randomString(10)
    };

    // Create user
    const response = await usersApi.createUser(newUser);

    // Verify response
    expect(response.username).toBe(newUser.username);
    expect(response.email).toBe(newUser.email);
    expect(response.id).toBeTruthy();
    expect(new Date(response.createdAt)).toBeInstanceOf(Date);
  });

  test('should get user details', async ({ usersApi }) => {
    logInfo('Starting get user test');

    // First create a user
    const newUser: CreateUserRequest = {
      username: generateTestData.uniqueUsername(),
      email: generateTestData.uniqueEmail(),
      password: generateTestData.randomString(10)
    };

    const createdUser = await usersApi.createUser(newUser);

    // Get user details
    const response = await usersApi.getUser(createdUser.id);

    // Verify response
    expect(response.id).toBe(createdUser.id);
    expect(response.username).toBe(createdUser.username);
    expect(response.email).toBe(createdUser.email);
  });

  test('should handle non-existent user', async ({ usersApi }) => {
    logInfo('Starting non-existent user test');

    try {
      await usersApi.getUser(999999);
      throw new Error('Should have thrown an error');
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      if (error instanceof ApiError) {
        expect(error.status).toBe(404);
        expect(error.message).toContain('API Error: 404');
      }
    }
  });

  test('should validate user creation payload', async ({ usersApi }) => {
    logInfo('Starting user validation test');

    // Attempt to create user with invalid email
    const invalidUser: CreateUserRequest = {
      username: generateTestData.uniqueUsername(),
      email: 'invalid-email',
      password: generateTestData.randomString(10)
    };

    try {
      await usersApi.createUser(invalidUser);
      throw new Error('Should have thrown an error');
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      if (error instanceof ApiError) {
        expect(error.status).toBe(400);
        expect(error.message).toContain('API Error: 400');
      }
    }
  });
});