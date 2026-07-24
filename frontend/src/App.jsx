import Browse from "./pages/Browse";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import Dashboard from "./pages/Dashboard";
import GapsAndSellers from "./pages/GapsAndSellers";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider, useAuth } from "./components/AuthContext";
import { RegionProvider } from "./context/RegionContext";

function AppContent() {
  const [page, setPage] = useState("browse");

  const { user, isAuthenticated } = useAuth();

  function handleNavigation(nextPage) {
    if (nextPage === "dashboard" || nextPage === "gaps") {
      if (!isAuthenticated || user?.role !== "admin") {
        setPage("browse");
        return;
      }
    }

    if (nextPage === "shelf") {
      if (!isAuthenticated) {
        setPage("login");
        return;
      }
    }

    setPage(nextPage);
  }

  return (
    <div className="min-h-screen">
      <Navbar page={page} onNavigate={handleNavigation} />

      {page === "shelf" && <Homepage />}

      {page === "dashboard" && user?.role === "admin" && (
        <Dashboard />
      )}

      {page === "gaps" && user?.role === "admin" && (
        <GapsAndSellers />
      )}

      {page === "browse" && <Browse />}

      {page === "login" && (
        <Login onNavigate={handleNavigation} />
      )}

      {page === "register" && (
        <Register onNavigate={handleNavigation} />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <RegionProvider>
        <AppContent />
      </RegionProvider>
    </AuthProvider>
  );
}

export default App;