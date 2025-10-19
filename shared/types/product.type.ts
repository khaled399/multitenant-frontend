// multitenant-backend/shared/types/product.type.ts
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  shopId: string;
  createdAt: string;
  updatedAt: string;
}
