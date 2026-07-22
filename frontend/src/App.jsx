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
    </div>
  );
}

export default App;