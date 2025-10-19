// src/services/productService.ts
import api from "./api";
import type { Product } from "../../shared/types/product.type";

const getProducts = async (shopId: string): Promise<Product[]> => {
  try {
    // No need to add Authorization header manually; api instance handles it
    const response = await api.get(`/products?shopId=${shopId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

const createProduct = async (shopId: string, productData: Partial<Product>) => {
  try {
    const response = await api.post("/products", { ...productData, shopId });
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

const deleteProduct = async (id: string) => {
  try {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

export default {
  getProducts,
  createProduct,
  deleteProduct,
};
