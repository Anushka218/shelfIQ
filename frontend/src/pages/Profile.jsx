import { useEffect, useState } from "react";
import { getProfile } from "../api/client";
import { useAuth } from "../components/AuthContext";

export default function Profile() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getProfile().then(setProfile).catch(() => setProfile(user));
  }, []);

  const data = profile || user;
  if (!data) return null;

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="bg-white border border-border rounded-md shadow-sm overflow-hidden">
        <div className="bg-ink p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-pink flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
            {data.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-white font-bold text-base">{data.name}</p>
            <span className="inline-block mt-1 text-[10px] font-bold uppercase bg-pink px-2 py-0.5 rounded text-white">
              {data.role}
            </span>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <div className="text-[11px] font-bold text-muted uppercase tracking-wide mb-1">Email</div>
            <div className="text-sm text-ink">{data.email}</div>
          </div>
          <div>
            <div className="text-[11px] font-bold text-muted uppercase tracking-wide mb-1">Region</div>
            <div className="text-sm text-ink">{data.region}</div>
          </div>
          <div>
            <div className="text-[11px] font-bold text-muted uppercase tracking-wide mb-1">Gender</div>
            <div className="text-sm text-ink">{data.gender}</div>
          </div>

          <button
            onClick={logout}
            className="w-full mt-4 border border-pink text-pink font-bold text-sm py-2.5 rounded hover:bg-pink-tint transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}