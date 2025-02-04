export interface UserResponse {
    id: string;
    username: string;
    email: string;
    role: string;
    createdAt: Date;
    updatedAt?: Date;
}

export type UsersResponse = UserResponse[];
  