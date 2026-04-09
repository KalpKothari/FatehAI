import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

// ── Icons ──────────────────────────────────────────────────────────────────────
const MessageSquareIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
);
const FileTextIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
  </svg>
);
const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="3" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);
const CalendarSmIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="3" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);
const LogOutIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
  </svg>
);
const ArrowRightIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);
const ClockIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" />
  </svg>
);
const GlobeIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
  </svg>
);
const BookOpenIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
  </svg>
);
const VideoIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <rect x="2" y="6" width="14" height="12" rx="2" />
    <path d="M16 10l6-3v10l-6-3V10z" />
  </svg>
);
const LinkIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
  </svg>
);
const SpinnerIcon = () => (
  <svg className="w-5 h-5 animate-spin text-blue-400" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);
const EmptyIcon = () => (
  <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
);

// ── Stat Card ──────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, accent, sub }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent.bg}`}>
        <span className={accent.icon}>{icon}</span>
      </div>
      <div>
        <p className="text-[13px] font-medium text-slate-500 tracking-wide uppercase">{label}</p>
        <p className={`text-4xl font-extrabold mt-1 ${accent.value}`}>{value}</p>
        <p className="text-[12.5px] text-slate-400 mt-1">{sub}</p>
      </div>
    </div>
  );
}

// ── Pill ───────────────────────────────────────────────────────────────────────
function Pill({ icon, children, color }) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    blue:   "bg-blue-50 text-blue-600 border-blue-100",
    violet: "bg-violet-50 text-violet-600 border-violet-100",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 border text-[11.5px] font-semibold px-2.5 py-1 rounded-full ${colors[color]}`}>
      {icon}
      {children}
    </span>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function StudentHome() {
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("/chat/history");
        setHistory(res.data);
      } catch (error) {
        console.error("History fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const firstName = user?.name?.split(" ")[0] || "Student";
  const meetingsCount = history.filter((item) => item.meeting?.scheduled).length;

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      {/* ── Top Nav ── */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-100 px-6 md:px-10 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-sm font-bold text-slate-800 tracking-tight">CounselAI</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-[10px] font-bold">
              {firstName[0]}
            </div>
            <span className="text-sm font-medium text-slate-700">{user?.name || "Student"}</span>
          </div>
          <button
            onClick={() => { logoutUser(); navigate("/login"); }}
            className="flex items-center gap-1.5 text-[13px] font-medium text-slate-500 hover:text-red-500 transition-colors px-3 py-2 rounded-xl hover:bg-red-50"
          >
            <LogOutIcon />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">

        {/* ── Hero greeting ── */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
          <div>
            <p className="text-[13px] font-semibold text-blue-500 uppercase tracking-widest mb-1">Your Dashboard</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Good to see you, {firstName}.
            </h1>
            <p className="text-slate-500 text-sm mt-2">Track your counselling journey, reports, and meetings in one place.</p>
          </div>
          <button
            onClick={() => navigate("/student/chat")}
            className="self-start sm:self-auto flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-md shadow-blue-200 transition-all duration-150"
          >
            <MessageSquareIcon />
            New Conversation
          </button>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <StatCard
            icon={<MessageSquareIcon />}
            label="Sessions"
            value={loading ? "—" : history.length}
            sub="Total counselling sessions"
            accent={{ bg: "bg-blue-50", icon: "text-blue-500", value: "text-blue-600" }}
          />
          <StatCard
            icon={<FileTextIcon />}
            label="Reports"
            value={loading ? "—" : history.length}
            sub="Counselling summaries"
            accent={{ bg: "bg-indigo-50", icon: "text-indigo-500", value: "text-indigo-600" }}
          />
          <StatCard
            icon={<CalendarIcon />}
            label="Meetings"
            value={loading ? "—" : meetingsCount}
            sub="Scheduled counselling calls"
            accent={{ bg: "bg-emerald-50", icon: "text-emerald-500", value: "text-emerald-600" }}
          />
        </div>

        {/* ── History ── */}
        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">

          {/* Section header */}
          <div className="px-7 py-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Counselling History</h2>
              <p className="text-[12.5px] text-slate-400 mt-0.5">All your past sessions and meeting details</p>
            </div>
            {!loading && history.length > 0 && (
              <span className="text-[11.5px] font-semibold bg-slate-100 text-slate-500 px-3 py-1 rounded-full">
                {history.length} {history.length === 1 ? "record" : "records"}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
                <SpinnerIcon />
                <p className="text-sm">Loading your history…</p>
              </div>
            ) : history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                  <EmptyIcon />
                </div>
                <div>
                  <p className="text-slate-700 font-semibold">No sessions yet</p>
                  <p className="text-slate-400 text-sm mt-1">Start your first counselling conversation to get going.</p>
                </div>
                <button
                  onClick={() => navigate("/student/chat")}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm shadow-blue-100 mt-1"
                >
                  <MessageSquareIcon />
                  Start First Conversation
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {history.map((item) => (
                  <div
                    key={item._id}
                    className="group bg-slate-50 hover:bg-white border border-slate-100 hover:border-slate-200 hover:shadow-md rounded-2xl p-5 transition-all duration-200"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">

                      {/* Left */}
                      <div className="flex-1 min-w-0">

                        {/* Pills */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Pill icon={<BookOpenIcon />} color="indigo">
                            {item.course_interest || "Course not set"}
                          </Pill>
                          <Pill icon={<GlobeIcon />} color="blue">
                            {item.target_countries?.join(", ") || "Country not set"}
                          </Pill>
                          <Pill icon={<ClockIcon />} color="violet">
                            {item.intake_timing || "Intake not set"}
                          </Pill>
                        </div>

                        {/* Summary */}
                        <p className="text-[13.5px] text-slate-600 leading-relaxed line-clamp-2 mb-3">
                          {item.summary || "No summary available for this session."}
                        </p>

                        {/* Date */}
                        <div className="flex items-center gap-1.5 text-[12px] text-slate-400">
                          <CalendarSmIcon />
                          <span>Session on {new Date(item.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                        </div>

                        {/* Meeting badge */}
                        {item.meeting?.scheduled ? (
                          <div className="mt-4 inline-flex flex-col gap-1.5 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 w-full sm:w-auto">
                            <div className="flex items-center gap-1.5 text-[12px] font-bold text-emerald-700">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg>
                              Meeting Scheduled
                            </div>
                            <div className="flex flex-wrap gap-3 text-[12px] text-slate-600">
                              <span className="flex items-center gap-1"><CalendarSmIcon /> {item.meeting.date} at {item.meeting.time}</span>
                              <span className="flex items-center gap-1"><VideoIcon /> {item.meeting.mode}</span>
                              {item.meeting.meetingLink && (
                                <a
                                  href={item.meeting.meetingLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center gap-1 text-blue-500 hover:underline"
                                >
                                  <LinkIcon /> Join
                                </a>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="mt-4 inline-flex items-center gap-1.5 bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5">
                            <svg className="w-3.5 h-3.5 text-amber-500" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                              <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
                            </svg>
                            <span className="text-[12px] font-semibold text-amber-700">No meeting scheduled yet</span>
                          </div>
                        )}
                      </div>

                      {/* Action */}
                      <div className="shrink-0 flex items-start">
                        <button
                          onClick={() => navigate(`/student/report/${item._id}`)}
                          className="flex items-center gap-2 bg-slate-900 group-hover:bg-blue-600 text-white text-[13px] font-semibold px-4 py-2.5 rounded-xl transition-colors duration-200 shadow-sm whitespace-nowrap"
                        >
                          <FileTextIcon />
                          View Report
                          <ArrowRightIcon />
                        </button>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}