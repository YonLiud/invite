export interface SuccessResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
}

export interface ErrorResponse {
  success: boolean;
  message: string;
}