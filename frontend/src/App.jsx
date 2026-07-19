import { useState } from "react";
import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import Dashboard from "./pages/Dashboard";

function App() {
  const [page, setPage] = useState("shelf");

  return (
    <div className="min-h-screen">
      <Navbar page={page} onNavigate={setPage} />
      {page === "shelf" && <Homepage />}
      {page === "dashboard" && <Dashboard />}
      {page === "gaps" && (
        <div className="max-w-5xl mx-auto p-6 text-muted text-sm">
          Gaps & Sellers — coming later if time allows (lower priority per roadmap).
        </div>
      )}
    </div>
  );
}

export default App;