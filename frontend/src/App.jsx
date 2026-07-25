import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "./components/AuthContext";
import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import Dashboard from "./pages/Dashboard";
import GapsAndSellers from "./pages/GapsAndSellers";
import Browse from "./pages/Browse";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

function AppContent() {
  const [page, setPage] = useState(() => {
    return localStorage.getItem("currentPage") || "browse";
  });

  const { isAuthenticated, user } = useAuth();

  const [region, setRegion] = useState(() => {
    return localStorage.getItem("region") || "Lucknow";
  });

  useEffect(() => {
    localStorage.setItem("currentPage", page);
  }, [page]);

  useEffect(() => {
    localStorage.setItem("region", region);
  }, [region]);

  return (
    <div className="min-h-screen">
      {/* Hide navbar on Login & Register */}
      {page !== "login" && page !== "register" && (
        <Navbar page={page} onNavigate={setPage} />
      )}

      {page === "login" && (
        <Login onNavigate={setPage} />
      )}

      {page === "register" && (
        <Register onNavigate={setPage} />
      )}

      {page === "browse" && (
        <Browse onNavigate={setPage} />
      )}

      {page === "shelf" &&
        isAuthenticated &&
        user?.role !== "admin" && (
          <Homepage
            region={region}
            setRegion={setRegion}
            onNavigate={setPage}
          />
        )}

      {page === "dashboard" &&
        isAuthenticated &&
        user?.role === "admin" && (
          <Dashboard
            region={region}
            setRegion={setRegion}
          />
        )}

      {page === "gaps" &&
        isAuthenticated &&
        user?.role === "admin" && (
          <GapsAndSellers
            region={region}
            setRegion={setRegion}
          />
        )}

      {page === "profile" &&
        isAuthenticated && (
          <Profile />
        )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;