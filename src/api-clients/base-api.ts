import { APIRequestContext, APIResponse } from '@playwright/test';
import { logError, logInfo } from '../utils/logger';
import { ApiError } from '../utils/api-error';

export class BaseApiClient {
  constructor(
    private request: APIRequestContext,
    private baseURL: string = process.env.API_URL || 'http://localhost:3000/api'
  ) {}
public async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  try {
    const url = this.buildUrl(endpoint, params);
    logInfo(`GET Request to ${url}`);
    
      
      const response = await this.request.get(url);
      return await this.handleResponse<T>(response);
    } catch (error) {
      logError(error as Error);
      throw error;
    }
  }

  public async post<T>(endpoint: string, data: unknown): Promise<T> {
    try {
      const url = this.buildUrl(endpoint);
      logInfo(`POST Request to ${url}`);
      
      const response = await this.request.post(url, {
        data,
        headers: { 'Content-Type': 'application/json' }
      });
      return await this.handleResponse<T>(response);
    } catch (error) {
      logError(error as Error);
      throw error;
    }
  }

  public async put<T>(endpoint: string, data: unknown): Promise<T> {
    try {
      const url = this.buildUrl(endpoint);
      logInfo(`PUT Request to ${url}`);
      
      const response = await this.request.put(url, {
        data,
        headers: { 'Content-Type': 'application/json' }
      });
      return await this.handleResponse<T>(response);
    } catch (error) {
      logError(error as Error);
      throw error;
    }
  }
public async delete<T>(endpoint: string): Promise<T> {
  try {
    const url = this.buildUrl(endpoint);
    logInfo(`DELETE Request to ${url}`);
    
      
      const response = await this.request.delete(url);
      return await this.handleResponse<T>(response);
    } catch (error) {
      logError(error as Error);
      throw error;
    }
  }

  private async handleResponse<T>(response: APIResponse): Promise<T> {
    if (response.status() < 200 || response.status() >= 300) {
      const error = new ApiError(
        `API Error: ${response.status()} ${response.statusText()}`,
        response.status(),
        response.statusText(),
        await response.json().catch(() => undefined)
      );
      logError(error);
      throw error;
    }

    return await response.json() as T;
  }

  private buildUrl(endpoint: string, params?: Record<string, string>): string {
    const url = new URL(endpoint, this.baseURL);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    return url.toString();
  }
}