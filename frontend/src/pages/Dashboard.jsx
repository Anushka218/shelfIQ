import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { getDemand, getTrends, getPlatformAnalytics } from "../api/client";
import RegionSelector from "../components/RegionSelector";
import { SkeletonStat } from "../components/SkeletonCard";

export default function Dashboard({ region, setRegion }) {
  const [demand, setDemand] = useState([]);
  const [trends, setTrends] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    getDemand(region).then((d) => setDemand(d.demand));
    getTrends(region).then((t) => setTrends(t.top_categories));
    getPlatformAnalytics().then(setAnalytics);
  }, [region]);

  const totalEvents = demand.reduce((sum, c) => sum + c.count, 0);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold text-ink">Regional overview</h1>
          <p className="text-xs text-muted">Live demand and trend data</p>
        </div>
        <RegionSelector region={region} onChange={setRegion} />
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {analytics ? (
          <>
            <div className="bg-white border border-border rounded-md p-4">
              <div className="text-[11px] font-bold text-muted uppercase tracking-wide mb-1">Total products</div>
              <div className="text-2xl font-extrabold text-ink">{analytics.total_products}</div>
            </div>
            <div className="bg-white border border-border rounded-md p-4">
              <div className="text-[11px] font-bold text-muted uppercase tracking-wide mb-1">Total users</div>
              <div className="text-2xl font-extrabold text-ink">{analytics.total_users}</div>
            </div>
            <div className="bg-white border border-border rounded-md p-4">
              <div className="text-[11px] font-bold text-muted uppercase tracking-wide mb-1">Total events</div>
              <div className="text-2xl font-extrabold text-ink">{analytics.total_events}</div>
            </div>
            <div className="bg-white border border-border rounded-md p-4">
              <div className="text-[11px] font-bold text-muted uppercase tracking-wide mb-1">Regions live</div>
              <div className="text-2xl font-extrabold text-ink">{analytics.total_regions}</div>
            </div>
          </>
        ) : (
          <>
            <SkeletonStat />
            <SkeletonStat />
            <SkeletonStat />
            <SkeletonStat />
          </>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-border rounded-md p-4">
          <div className="text-[11px] font-bold text-muted uppercase tracking-wide mb-1">
            Total events (region)
          </div>
          <div className="text-2xl font-extrabold text-ink">{totalEvents}</div>
        </div>
        <div className="bg-white border border-border rounded-md p-4">
          <div className="text-[11px] font-bold text-muted uppercase tracking-wide mb-1">
            Categories tracked
          </div>
          <div className="text-2xl font-extrabold text-ink">{demand.length}</div>
        </div>
        <div className="bg-white border border-border rounded-md p-4">
          <div className="text-[11px] font-bold text-muted uppercase tracking-wide mb-1">
            Region
          </div>
          <div className="text-2xl font-extrabold text-ink">{region}</div>
        </div>
      </div>

      <div className="bg-white border border-border rounded-md p-5 mb-5">
        <h2 className="text-xs font-bold text-muted uppercase tracking-wide mb-4">
          Demand by category
        </h2>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={demand}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E9E9EB" vertical={false} />
            <XAxis dataKey="category" tick={{ fontSize: 12, fill: "#94969F" }} />
            <YAxis tick={{ fontSize: 12, fill: "#94969F" }} />
            <Tooltip />
            <Bar dataKey="count" fill="#FF3F6C" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white border border-border rounded-md p-5">
        <h2 className="text-xs font-bold text-muted uppercase tracking-wide mb-4">
          Trend score
        </h2>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={trends}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E9E9EB" vertical={false} />
            <XAxis dataKey="category" tick={{ fontSize: 12, fill: "#94969F" }} />
            <YAxis tick={{ fontSize: 12, fill: "#94969F" }} />
            <Tooltip />
            <Bar dataKey="score" fill="#282C3F" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}