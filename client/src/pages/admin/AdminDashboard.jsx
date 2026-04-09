import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// ─── badge styles ─────────────────────────────────────────────────────────────
const BADGE = {
  Hot: "bg-red-50 text-red-600 ring-1 ring-red-200",
  Warm: "bg-amber-50 text-amber-600 ring-1 ring-amber-200",
  Cold: "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
};

// ─── stat card meta ───────────────────────────────────────────────────────────
const STAT_META = [
  {
    key: "total",
    label: "Total",
    sub: "All leads",
    color: "text-blue-600",
    bg: "bg-blue-50",
    ring: "ring-blue-100",
    Icon: PipelineIcon,
  },
  {
    key: "hot",
    label: "Hot",
    sub: "Act immediately",
    color: "text-red-500",
    bg: "bg-red-50",
    ring: "ring-red-100",
    Icon: FireIcon,
  },
  {
    key: "warm",
    label: "Warm",
    sub: "Follow up soon",
    color: "text-amber-500",
    bg: "bg-amber-50",
    ring: "ring-amber-100",
    Icon: WarmIcon,
  },
  {
    key: "cold",
    label: "Cold",
    sub: "Needs nurturing",
    color: "text-slate-500",
    bg: "bg-slate-100",
    ring: "ring-slate-200",
    Icon: ColdIcon,
  },
  {
    key: "scheduled",
    label: "Callbacks",
    sub: "Awaiting your call",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    ring: "ring-emerald-100",
    Icon: PhoneIcon,
  },
];

// ─── inline icons ─────────────────────────────────────────────────────────────
function PipelineIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
      />
    </svg>
  );
}

function FireIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z"
      />
    </svg>
  );
}

function WarmIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
      />
    </svg>
  );
}

function ColdIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v18M3 12h18M5.636 5.636l12.728 12.728M18.364 5.636L5.636 18.364"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
      />
    </svg>
  );
}

function LiveIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

// ─── skeleton ─────────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <div className="animate-pulse flex items-center gap-4 px-5 py-4 border-b border-slate-100 last:border-0">
      <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 w-32 bg-slate-200 rounded" />
        <div className="h-2.5 w-48 bg-slate-100 rounded" />
      </div>
      <div className="h-5 w-14 bg-slate-200 rounded-full" />
      <div className="h-4 w-8 bg-slate-100 rounded hidden sm:block" />
      <div className="h-4 w-4 bg-slate-100 rounded" />
    </div>
  );
}

// ─── lead row — collapsed by default, expands to show details ─────────────────
function LeadRow({ lead, navigate }) {
  const [open, setOpen] = useState(false);
  const initials = (lead.name || "?").slice(0, 2).toUpperCase();
  const scoreColor =
    lead.leadScore >= 75
      ? "text-emerald-600"
      : lead.leadScore >= 45
      ? "text-amber-500"
      : "text-slate-400";

  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center gap-3.5 px-5 py-3.5 text-left hover:bg-slate-50 transition-colors duration-100 focus:outline-none"
      >
        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center flex-shrink-0 select-none">
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800 capitalize truncate">
            {lead.name || "Unnamed Student"}
          </p>
          <p className="text-xs text-slate-400 truncate">{lead.email || "—"}</p>
        </div>

        <span
          className={`flex-shrink-0 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
            BADGE[lead.leadCategory] || BADGE.Cold
          }`}
        >
          {lead.leadCategory}
        </span>

        <span
          className={`flex-shrink-0 text-xs font-bold w-8 text-right hidden sm:block ${scoreColor}`}
        >
          {lead.leadScore ?? "—"}
        </span>

        <svg
          className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>

      {open && (
        <div
          className="px-5 pb-5 pt-3 bg-slate-50/60 border-t border-slate-100"
          style={{ animation: "fadeIn .15s ease both" }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4 mb-4">
            {[
              ["Phone", lead.phone],
              ["Location", lead.location],
              ["Country", lead.target_countries?.join(", ")],
              ["Course", lead.course_interest],
              ["Intake", lead.intake_timing],
              ["Callback", lead.callbackRequested ? "Requested" : "Not requested"],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-0.5 font-medium">
                  {label}
                </p>
                <p className="text-sm text-slate-700 font-semibold">{value || "—"}</p>
              </div>
            ))}
          </div>

          {lead.recommendedAction && (
            <div className="mb-4 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
              <p className="text-[10px] uppercase tracking-wider text-blue-400 mb-0.5 font-medium">
                Recommended action
              </p>
              <p className="text-sm text-blue-800 font-medium">
                {lead.recommendedAction}
              </p>
            </div>
          )}

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => navigate(`/admin/leads/${lead._id}`)}
              className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors duration-150"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              View Details
            </button>

            <button
              onClick={() => navigate(`/admin/schedule/${lead._id}`)}
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors duration-150"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                />
              </svg>
              Schedule Meeting
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── dashboard ────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [leads, setLeads] = useState([]);
  const [liveCalls, setLiveCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/admin/leads");
        setLeads(res.data);
      } catch (err) {
        console.error("Fetch leads error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/admin/live-calls/ongoing");
        setLiveCalls(res.data.ongoingCalls || []);
      } catch (err) {
        console.error("Live calls error:", err);
      }
    })();
  }, []);

  const stats = useMemo(() => {
    const hot = leads.filter((l) => l.leadCategory === "Hot").length;
    const warm = leads.filter((l) => l.leadCategory === "Warm").length;
    const cold = leads.filter((l) => l.leadCategory === "Cold").length;
    const scheduled = leads.filter((l) => l.callbackRequested).length;
    return { total: leads.length, hot, warm, cold, scheduled };
  }, [leads]);

  const filteredLeads = useMemo(() => {
    const q = search.toLowerCase();
    return leads.filter((l) => {
      const matchSearch =
        l.name?.toLowerCase().includes(q) ||
        l.email?.toLowerCase().includes(q) ||
        l.course_interest?.toLowerCase().includes(q) ||
        l.target_countries?.join(", ").toLowerCase().includes(q);

      return matchSearch && (filter === "All" || l.leadCategory === filter);
    });
  }, [leads, search, filter]);

  const h = new Date().getHours();
  const greeting =
    h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";

  return (
    <div
      className="min-h-screen bg-[#f4f6fb]"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        .fade-in { animation: fadeIn .3s ease both; }
      `}</style>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-5 fade-in">
        {/* ── HEADER ──────────────────────────────────────────────────────────── */}
        <header className="bg-white border border-slate-200 rounded-2xl px-6 py-4 flex items-center justify-between gap-4 shadow-sm">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-0.5">
              Fateh Education · Admin Panel
            </p>
            <h1 className="text-lg font-bold text-slate-900 leading-tight">
              {greeting}, {user?.name || "Admin"} 👋
            </h1>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
            <button
              onClick={() => navigate("/admin/live-calls")}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-all duration-150"
            >
              <LiveIcon />
              Live Calls {liveCalls.length > 0 ? `(${liveCalls.length})` : ""}
            </button>

            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all duration-150"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
              Refresh
            </button>

            <button
              onClick={() => {
                logoutUser();
                navigate("/login");
              }}
              className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-all duration-150"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                />
              </svg>
              Logout
            </button>
          </div>
        </header>

        {/* ── STATS ───────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
          {STAT_META.map(({ key, label, sub, color, bg, ring, Icon }) => (
            <div
              key={key}
              className="bg-white border border-slate-200 rounded-2xl px-5 py-4 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-default"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-slate-500 font-semibold">{label}</p>
                <span
                  className={`w-7 h-7 rounded-lg ${bg} ring-1 ${ring} flex items-center justify-center ${color}`}
                >
                  <Icon />
                </span>
              </div>
              <p className={`text-3xl font-extrabold ${color} leading-none`}>
                {stats[key]}
              </p>
              <p className="text-[11px] text-slate-400 mt-1.5 leading-tight">
                {sub}
              </p>
            </div>
          ))}
        </div>

        {/* ── LIVE CALLS PREVIEW ─────────────────────────────────────────────── */}
        {liveCalls.length > 0 && (
          <div className="bg-white border border-emerald-200 rounded-2xl shadow-sm p-4">
            <div className="flex justify-between items-center mb-3 gap-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Live Calls Ongoing
                </h2>
                <p className="text-[11px] text-slate-400">
                  Real-time monitoring active
                </p>
              </div>

              <button
                onClick={() => navigate("/admin/live-calls")}
                className="text-xs text-emerald-600 font-semibold hover:underline"
              >
                View All →
              </button>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-1">
              {liveCalls.map((call) => (
                <div
                  key={call.callId}
                  onClick={() => navigate("/admin/live-calls")}
                  className="min-w-[220px] border border-emerald-100 bg-emerald-50 rounded-xl p-3 cursor-pointer hover:shadow-sm transition"
                >
                  <p className="text-sm font-semibold text-slate-800">
                    {call.studentName || "Unknown"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {call.phone || "No number"}
                  </p>

                  <div className="flex items-center gap-1 mt-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span className="text-xs text-emerald-600 font-medium">
                      Live
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SEARCH + FILTER ─────────────────────────────────────────────────── */}
        <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3.5 shadow-sm flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, course, country…"
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 placeholder:text-slate-400 text-slate-700 transition-all duration-150"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {["All", "Hot", "Warm", "Cold"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition-all duration-150 ${
                  filter === f
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* ── LEADS ───────────────────────────────────────────────────────────── */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Student Leads</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {filteredLeads.length} lead
                {filteredLeads.length !== 1 ? "s" : ""} · click any row to
                expand
              </p>
            </div>

            <div className="hidden sm:flex gap-8 text-[10px] uppercase tracking-widest text-slate-400 pr-7">
              <span>Status</span>
              <span>Score</span>
            </div>
          </div>

          {loading ? (
            [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
          ) : filteredLeads.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-3xl mb-2">🔍</p>
              <p className="text-sm font-semibold text-slate-600">
                No leads found
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Try a different search or filter
              </p>
            </div>
          ) : (
            filteredLeads.map((lead) => (
              <LeadRow key={lead._id} lead={lead} navigate={navigate} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}