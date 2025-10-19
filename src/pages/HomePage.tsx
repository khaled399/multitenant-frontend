// src/pages/HomePage.tsx
// src/pages/HomePage.tsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import type { Shop } from "../../shared/types/shop.type";
import api from "../services/api";

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [shop, setShop] = useState<Shop | null>(null); // ✅ single shop

  useEffect(() => {
    const fetchShop = async () => {
      if (!user?.shopId) return;

      try {
        const response = await api.get(`/shops/${user.shopId}`);
        const data: Shop = response.data;
        setShop(data);
      } catch (error) {
        console.error("Error fetching shop:", error);
      }
    };

    fetchShop();
  }, [user?.shopId]);

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Welcome to the Dashboard!
      </h1>
      {user && (
        <p className="text-xl text-gray-600">
          Logged in as <span className="font-semibold">{user.email}</span>{" "}
          (Shop:{" "}
          <span className="font-semibold">
            {shop ? shop.name : "lodaing..."})
          </span>
        </p>
      )}
      <p className="mt-8 text-lg text-gray-700">
        This is your tenant-specific home page. You can navigate to other
        sections.
      </p>
      {/* Add links to other tenant-aware features here later */}
    </div>
  );
};

export default HomePage;
