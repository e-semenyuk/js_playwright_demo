import { APIRequestContext } from '@playwright/test';
import { BaseApiClient } from './base-api';

export interface User {
  id: number;
  username: string;
  email: string;
  createdAt: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
}

export class UsersApiClient extends BaseApiClient {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    return this.post<User>('/users', userData);
  }

  async getUser(userId: number): Promise<User> {
    return this.get<User>(`/users/${userId}`);
  }

  async updateUser(userId: number, userData: Partial<CreateUserRequest>): Promise<User> {
    return this.put<User>(`/users/${userId}`, userData);
  }

  async deleteUser(userId: number): Promise<void> {
    return this.delete<void>(`/users/${userId}`);
  }
}