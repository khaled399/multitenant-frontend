// src/context/AuthContext.tsx
import { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import api from "../services/api"; // Import our API instance
import type {
  LoginAuthDto,
  RegisterAuthDto,
} from "../../shared/types/auth.dto"; // We'll create this shared types file next
// We'll create this shared types file next
import type { User } from "../../shared/types/user.type"; // We'll create this shared types file next
// We'll create this shared types file next

// Define the shape of the authenticated user data we'll store
interface AuthUser extends User {
  shopId: string; // Ensure shopId is available from the user
}

// Define the shape of our authentication context
interface AuthContextType {
  user: AuthUser | null;
  accessToken: string | null;
  login: (credentials: LoginAuthDto) => Promise<void>;
  register: (userData: RegisterAuthDto) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean; // To indicate ongoing auth operations
}

// Create the context with default (empty) values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the props for the AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start as loading to check local storage

  // Load auth state from local storage on initial mount
  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setAccessToken(storedToken);
      setUser(JSON.parse(storedUser));
      // Set the token for immediate use in API requests
      api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
    setIsLoading(false);
  }, []);

  // Update local storage whenever accessToken or user changes
  useEffect(() => {
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Keep axios header updated
    } else {
      localStorage.removeItem("accessToken");
      delete api.defaults.headers.common["Authorization"]; // Remove header on logout
    }
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [accessToken, user]);

  const login = async (credentials: LoginAuthDto) => {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/login", credentials);
      const { user: userData, accessToken } = response.data;
      // Set token and user immediately so other requests (e.g., product fetch)
      // happening right after navigation have the Authorization header.
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      setAccessToken(accessToken);
      setUser(userData);
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Re-throw to allow component to handle specific errors
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterAuthDto) => {
    setIsLoading(true);
    try {
      await api.post("/auth/register", userData);
      // After registration, you might want to automatically log them in or redirect to login page
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
    // Local storage cleared by useEffect
  };

  const isAuthenticated = !!user && !!accessToken;

  // The value provided to consumers of this context
  const contextValue: AuthContextType = {
    user,
    accessToken,
    login,
    register,
    logout,
    isAuthenticated,
    isLoading,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
