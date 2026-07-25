import { useAuth } from "./AuthContext";

export default function Navbar({ page, onNavigate }) {
  const { user, logout, isAuthenticated } = useAuth();

  const guestTabs = [{ key: "browse", label: "BROWSE" }];
  const userTabs = [
    { key: "shelf", label: "SHELF" },
    { key: "browse", label: "BROWSE" },
  ];
  const adminTabs = [
    { key: "dashboard", label: "DASHBOARD" },
    { key: "gaps", label: "GAPS & SELLERS" },
  ];

  let tabs = guestTabs;
  if (isAuthenticated && user?.role === "admin") tabs = adminTabs;
  else if (isAuthenticated && user?.role !== "admin") tabs = userTabs;

  function handleLogout() {
    logout();
    onNavigate("browse");
  }

  return (
    <div className="bg-ink px-6 py-3 flex items-center gap-6">
      <span className="text-lg font-extrabold text-white tracking-tight">
        Shelf<span className="text-pink">IQ</span>
      </span>
      <div className="flex gap-5 flex-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => onNavigate(t.key)}
            className={`text-xs font-bold pb-3 -mb-3 ${
              page === t.key ? "text-white border-b-2 border-pink" : "text-white/60"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isAuthenticated ? (
        <div className="flex items-center gap-3">
          <button
            onClick={handleLogout}
            className="text-xs font-bold text-white bg-white/10 px-3 py-1.5 rounded"
          >
            LOGOUT
          </button>
          <button
            onClick={() => onNavigate("profile")}
            className="w-8 h-8 rounded-full bg-pink flex items-center justify-center text-sm font-bold text-white hover:opacity-90 transition-opacity"
            title="View profile"
          >
            {user?.name?.[0]?.toUpperCase()}
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate("login")}
            className="text-xs font-bold text-white/80 px-3 py-1.5"
          >
            LOGIN
          </button>
          <button
            onClick={() => onNavigate("register")}
            className="text-xs font-bold text-white bg-pink px-3 py-1.5 rounded"
          >
            SIGN UP
          </button>
        </div>
      )}
    </div>
  );
}