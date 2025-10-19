// multitenant-backend/shared/types/user.type.ts
export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
  // shopId will be part of AuthUser, or explicit in the backend user DTO
}
