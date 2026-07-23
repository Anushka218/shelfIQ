import Browse from "./pages/Browse";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import Dashboard from "./pages/Dashboard";
import GapsAndSellers from "./pages/GapsAndSellers";

function App() {
  const [page, setPage] = useState("shelf");

  return (
    <div className="min-h-screen">
      <Navbar page={page} onNavigate={setPage} />
      {page === "shelf" && <Homepage />}
      {page === "dashboard" && <Dashboard />}
      {page === "gaps" && <GapsAndSellers />}
      {page === "gaps" && <GapsAndSellers />}
      {page === "browse" && <Browse />}
    </div>
  );
}

export default App;