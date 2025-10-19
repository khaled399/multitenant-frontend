// src/pages/ProductsPage.tsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import productService from "../services/productService";
import type { Product } from "../../shared/types/product.type";
import ProductCard from "../components/ProductCard";
import AddProductModal from "../components/AddProductModal";

const ProductsPage: React.FC = () => {
  const { user } = useAuth();
  const { isAuthenticated, isLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch products for the current shop when authentication is ready
  useEffect(() => {
    const run = async () => {
      if (!user?.shopId || !isAuthenticated) return; // only fetch when authenticated and shopId available
      setLoading(true);
      try {
        const data = await productService.getProducts(user.shopId);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isLoading) return;
    if (!isAuthenticated) return;
    void run();
  }, [user?.shopId, isAuthenticated, isLoading]);

  // Handle adding product using backend POST
  const handleAddProduct = async (
    productInput: Omit<Product, "id" | "createdAt" | "updatedAt">
  ) => {
    if (!user?.shopId) return;
    try {
      const newProduct = await productService.createProduct(
        user.shopId,
        productInput
      );
      setProducts((prev) => [newProduct, ...prev]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  // Handle deleting product with optimistic UI update
  const handleDeleteProduct = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product? This action cannot be undone."
    );
    if (!confirmed) return;

    // Optimistically remove product from UI
    const previous = products;
    setProducts((prev) => prev.filter((p) => p.id !== id));

    try {
      await productService.deleteProduct(id);
      // No further action needed — UI already updated
    } catch (error) {
      // Rollback on failure
      console.error("Failed to delete product, rolling back:", error);
      setProducts(previous);
      // Optionally show a user-facing message here
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          onClick={() => setIsModalOpen(true)}
        >
          Add Product
        </button>
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onDelete={handleDeleteProduct}
            />
          ))}
        </div>
      )}

      {isModalOpen && (
        <AddProductModal
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAddProduct} // Pass the backend-ready function
          open={isModalOpen}
        />
      )}
    </div>
  );
};

export default ProductsPage;
