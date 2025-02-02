export interface LoginSuccessResponse {
    success: true;
    token: string;
    user: {
      id: string;
      username: string;
      email: string;
      role: string;
    };
}

export interface LoginErrorResponse {
success: false;
error: "INVALID_CREDENTIALS" | "USER_NOT_FOUND";
}

export type LoginResponse = LoginSuccessResponse | LoginErrorResponse;
  