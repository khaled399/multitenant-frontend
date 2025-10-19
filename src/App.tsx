// src/App.tsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext"; // Import useAuth
import LoginPage from "./pages/LoginPage"; // We'll create these pages next
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage"; // This will be our dashboard
import ProductsPage from "./pages/ProductsPage"; // Products management page
import NavBar from "./components/NavBar"; // We'll create a NavBar

// A simple PrivateRoute component to protect routes
interface PrivateRouteProps {
  children: React.ReactNode;
}
const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading authentication...
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <NavBar /> {/* Navigation bar at the top */}
      <main className="container mx-auto p-4">
        {" "}
        {/* Tailwind container for content */}
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            }
          />
          {/* Add other protected routes here later */}
          <Route
            path="/products"
            element={
              <PrivateRoute>
                <ProductsPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
