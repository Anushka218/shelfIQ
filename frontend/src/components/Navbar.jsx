import { useAuth } from "./AuthContext";

export default function Navbar({ page, onNavigate }) {
  const { user, logout, isAuthenticated } = useAuth();

  let tabs = [];

  // Not logged in
  if (!isAuthenticated) {
    tabs = [
      { key: "browse", label: "BROWSE" },
    ];
  }

  // Admin
  else if (user?.role === "admin") {
    tabs = [
      { key: "dashboard", label: "DASHBOARD" },
      { key: "gaps", label: "GAPS & SELLERS" },
    ];
  }

  // Normal user
  else {
    tabs = [
      { key: "shelf", label: "SHELF" },
      { key: "browse", label: "BROWSE" },
    ];
  }

  function handleLogout() {
    logout();
    onNavigate("browse");
  }

  return (
    <div className="bg-ink px-6 py-3 flex items-center gap-6">
      {/* Logo */}
      <span className="text-lg font-extrabold text-white tracking-tight">
        Shelf<span className="text-pink">IQ</span>
      </span>

      {/* Navigation tabs */}
      <div className="flex gap-5 flex-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => onNavigate(t.key)}
            className={`text-xs font-bold pb-3 -mb-3 ${
              page === t.key
                ? "text-white border-b-2 border-pink"
                : "text-white/60"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Logged out */}
      {!isAuthenticated ? (
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate("login")}
            className="text-xs font-bold text-white/70 hover:text-white"
          >
            LOGIN
          </button>

          <button
            onClick={() => onNavigate("register")}
            className="text-xs font-bold bg-pink text-white px-3 py-2 rounded"
          >
            SIGN UP
          </button>
        </div>
      ) : (
        /* Logged in */
        <div className="flex items-center gap-3">
          <span className="text-xs text-white font-bold">
            {user?.name || user?.email}
          </span>

          <button
            onClick={handleLogout}
            className="text-xs font-bold text-white/70 hover:text-white"
          >
            LOGOUT
          </button>

          <div className="w-7 h-7 rounded-full bg-pink flex items-center justify-center text-[10px] text-white font-bold">
            {user?.name
              ? user.name.substring(0, 2).toUpperCase()
              : "U"}
          </div>
        </div>
      )}
    </div>
  );
}