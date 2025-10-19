import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NavBar: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();

  // Helper to style the active link
  const isActive = (path: string) =>
    location.pathname === path ? "bg-gray-700" : "";

  return (
    <nav className="bg-gray-800 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-xl font-bold">
          MultiShop Inventory
        </Link>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <span className="text-gray-300">Welcome, {user?.email}</span>
              <Link
                to="/products"
                className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded ${isActive(
                  "/products"
                )}`}
              >
                Products
              </Link>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`text-gray-300 hover:text-white ${isActive(
                  "/login"
                )}`}
              >
                Login
              </Link>
              <Link
                to="/register"
                className={`text-gray-300 hover:text-white ${isActive(
                  "/register"
                )}`}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
