// multitenant-backend/shared/types/auth.dto.ts
// This is a simplified version for frontend use, without class-validator decorators
export interface RegisterAuthDto {
  email: string;
  password: string;
  shopId: string;
}

export interface LoginAuthDto {
  email: string;
  password: string;
}
