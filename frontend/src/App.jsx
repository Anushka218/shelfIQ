import Browse from "./pages/Browse";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import Dashboard from "./pages/Dashboard";
import GapsAndSellers from "./pages/GapsAndSellers";

function App() {
  const [page, setPage] = useState("shelf");
  const [region, setRegion] = useState("Lucknow");

  return (
    <div className="min-h-screen">
      <Navbar page={page} onNavigate={setPage} />
      {page === "shelf" && <Homepage region={region} setRegion={setRegion} />}
      {page === "dashboard" && <Dashboard region={region} setRegion={setRegion} />}
      {page === "gaps" && <GapsAndSellers region={region} setRegion={setRegion} />}
      {page === "browse" && <Browse />}
    </div>
  );
}

export default App;