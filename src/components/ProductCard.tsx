// src/components/ProductCard.tsx
import React from "react";
import type { Product } from "../../shared/types/product.type";

interface ProductCardProps {
  product: Product;
  onDelete?: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onDelete }) => {
  return (
    <div className="border rounded-lg shadow p-4 flex flex-col">
      {product.image && (
        <img
          src={product.image}
          alt={product.name}
          className="h-40 w-full object-cover rounded mb-4"
        />
      )}
      <h2 className="text-lg font-semibold mb-1">{product.name}</h2>
      <p className="text-gray-600 mb-2">{product.description}</p>
      <div className="flex items-center justify-between mt-auto">
        <p className="text-gray-800 font-bold">${product.price.toFixed(2)}</p>
        {onDelete && (
          <button
            onClick={() => onDelete(product.id)}
            className="ml-4 bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
