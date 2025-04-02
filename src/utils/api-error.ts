export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string,
    public body?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static async fromResponse(response: Response): Promise<ApiError> {
    let body: unknown;
    try {
      body = await response.json();
    } catch {
      // If JSON parsing fails, use text content
      body = await response.text();
    }

    return new ApiError(
      `API Error: ${response.status} ${response.statusText}`,
      response.status,
      response.statusText,
      body
    );
  }
}