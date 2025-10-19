// src/components/AddProductModal.tsx
import React, { useState } from "react";
import { Modal, Input, Button } from "antd";
import type { Product } from "../../shared/types/product.type";

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  open,
  onClose,
  onAdd,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.price) {
      alert("Name and Price are required!");
      return;
    }

    onAdd({
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      image: formData.image,
      shopId: "", // this will be set in ProductsPage using user.shopId
    });

    setFormData({ name: "", description: "", price: "", image: "" });
    onClose();
  };

  return (
    <Modal title="Add Product" open={open} onCancel={onClose} footer={null}>
      <Input
        placeholder="Product Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="mb-2"
      />
      <Input
        placeholder="Description"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        className="mb-2"
      />
      <Input
        placeholder="Price"
        type="number"
        value={formData.price}
        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        className="mb-2"
      />
      <Input
        placeholder="Image URL"
        value={formData.image}
        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
        className="mb-4"
      />
      <div className="flex justify-end">
        <Button onClick={onClose} className="mr-2">
          Cancel
        </Button>
        <Button type="primary" onClick={handleSubmit}>
          Add
        </Button>
      </div>
    </Modal>
  );
};

export default AddProductModal;
