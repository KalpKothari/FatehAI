import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

// ─── badge ────────────────────────────────────────────────────────────────────
const BADGE = {
  Hot: "bg-red-50 text-red-600 ring-1 ring-red-200",
  Warm: "bg-amber-50 text-amber-600 ring-1 ring-amber-200",
  Cold: "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
};

const WHATSAPP_BADGE = {
  sent: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  failed: "bg-red-50 text-red-700 ring-1 ring-red-200",
  not_sent: "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
};

// ─── small section heading ────────────────────────────────────────────────────
function SectionTitle({ children, tag }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
        {children}
      </h2>
      {tag && (
        <span
          className="text-[10px] font-semibold uppercase tracking-wider text-slate-400
          bg-slate-100 px-2.5 py-1 rounded-lg"
        >
          {tag}
        </span>
      )}
    </div>
  );
}

// ─── info field ───────────────────────────────────────────────────────────────
function Field({ label, value }) {
  return (
    <div className="py-3 border-b border-slate-100 last:border-0">
      <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-0.5">
        {label}
      </p>
      <p className="text-sm text-slate-700 font-semibold break-words">
        {value || "—"}
      </p>
    </div>
  );
}

// ─── card wrapper ─────────────────────────────────────────────────────────────
function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white border border-slate-200 rounded-2xl shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

// ─── skeleton ─────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div
      className="min-h-screen bg-[#f4f6fb] flex items-center justify-center"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
    >
      <div
        className="bg-white border border-slate-200 rounded-2xl px-8 py-5 shadow-sm
        flex items-center gap-3 text-sm text-slate-500 animate-pulse"
      >
        <svg className="w-4 h-4 animate-spin text-blue-400" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        Loading lead details…
      </div>
    </div>
  );
}

// ─── main ─────────────────────────────────────────────────────────────────────
export default function LeadDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/admin/leads/${id}`);
        setData(res.data);
      } catch (err) {
        console.error("Lead details fetch error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <Skeleton />;

  if (!data) {
    return (
      <div
        className="min-h-screen bg-[#f4f6fb] flex items-center justify-center"
        style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
      >
        <Card className="px-8 py-6">
          <p className="text-sm text-slate-500">No data found for this lead.</p>
        </Card>
      </div>
    );
  }

  const { lead, conversation, meeting } = data;
  const initials = (lead?.name || "?").slice(0, 2).toUpperCase();
  const scoreColor =
    lead?.leadScore >= 75
      ? "text-emerald-600"
      : lead?.leadScore >= 45
      ? "text-amber-500"
      : "text-slate-500";

  const whatsappStatus = lead?.whatsappStatus || "not_sent";

  return (
    <div
      className="min-h-screen bg-[#f4f6fb]"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .fade-in { animation: fadeIn .3s ease both; }
        .chat-scroll::-webkit-scrollbar { width: 4px; }
        .chat-scroll::-webkit-scrollbar-track { background: transparent; }
        .chat-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
      `}</style>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-5 fade-in">
        {/* ── HEADER ──────────────────────────────────────────────────────────── */}
        <header className="bg-white border border-slate-200 rounded-2xl px-6 py-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* left — identity */}
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600
                font-extrabold text-base flex items-center justify-center flex-shrink-0 select-none"
              >
                {initials}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                    Lead Details
                  </p>
                </div>
                <div className="flex items-center gap-2.5 mt-0.5 flex-wrap">
                  <h1 className="text-xl font-extrabold text-slate-900 capitalize leading-tight">
                    {lead.name || "Student"}
                  </h1>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      BADGE[lead?.leadCategory] || BADGE.Cold
                    }`}
                  >
                    {lead.leadCategory}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{lead.email || "—"}</p>
              </div>
            </div>

            {/* right — actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="inline-flex items-center gap-1.5 border border-slate-200 text-slate-600
                  hover:bg-slate-50 hover:border-slate-300 text-xs font-semibold px-3.5 py-2.5
                  rounded-xl transition-all duration-150"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Dashboard
              </button>
              <button
                onClick={() => navigate(`/admin/schedule/${lead._id}`)}
                className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700
                  text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl transition-all duration-150"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
        </header>

        {/* ── MAIN GRID ───────────────────────────────────────────────────────── */}
        <div className="grid xl:grid-cols-3 gap-5">
          {/* ── LEFT ── */}
          <div className="xl:col-span-2 space-y-5">
            {/* Student Profile */}
            <Card className="p-6">
              <SectionTitle tag="Candidate Info">Student Profile</SectionTitle>
              <div className="grid sm:grid-cols-2 gap-x-8">
                {[
                  ["Email", lead.email],
                  ["Phone", lead.phone],
                  ["Location", lead.location],
                  ["Education", lead.education_level],
                  ["Field", lead.field],
                  ["Institution", lead.institution],
                  ["GPA / Percentage", lead.gpa_percentage],
                  ["Target Countries", lead.target_countries?.join(", ")],
                  ["Course Interest", lead.course_interest],
                  ["Intake Timing", lead.intake_timing],
                  ["Test Status", lead.test_status],
                  ["Test Score", lead.test_score],
                  ["Budget Range", lead.budget_range],
                  ["Scholarship Interest", lead.scholarship_interest],
                  ["Application Timeline", lead.application_timeline],
                  ["Concerns", lead.concerns],
                ].map(([label, value]) => (
                  <Field key={label} label={label} value={value} />
                ))}
              </div>
            </Card>

            {/* Conversation Summary */}
            <Card className="p-6">
              <SectionTitle tag="AI Generated">Conversation Summary</SectionTitle>
              <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-4">
                <p className="text-sm text-slate-700 leading-relaxed">
                  {lead.summary || "—"}
                </p>
              </div>
            </Card>

            {/* Transcript */}
            <Card className="p-6">
              <SectionTitle tag="Full Conversation">Transcript</SectionTitle>
              <div className="chat-scroll max-h-[500px] overflow-y-auto space-y-3 pr-1">
                {conversation?.messages?.length ? (
                  conversation.messages.map((msg, idx) => {
                    const isAI = msg.sender === "ai";
                    return (
                      <div key={idx} className={`flex ${isAI ? "justify-start" : "justify-end"}`}>
                        <div
                          className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed
                          ${
                            isAI
                              ? "bg-slate-100 text-slate-700 rounded-tl-sm"
                              : "bg-blue-600 text-white rounded-tr-sm"
                          }`}
                        >
                          <p
                            className={`text-[9px] uppercase tracking-widest font-bold mb-1.5
                            ${isAI ? "text-slate-400" : "text-blue-200"}`}
                          >
                            {isAI ? "AI Counsellor" : "Student"}
                          </p>
                          <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-10 text-center">
                    <p className="text-sm text-slate-400">No transcript available.</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="space-y-5">
            {/* Lead Evaluation */}
            <Card className="p-6">
              <SectionTitle>Lead Evaluation</SectionTitle>

              {/* Score hero */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-1">
                    Lead Score
                  </p>
                  <p className={`text-4xl font-extrabold leading-none ${scoreColor}`}>
                    {lead.leadScore ?? "—"}
                  </p>
                </div>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    BADGE[lead?.leadCategory] || BADGE.Cold
                  }`}
                >
                  {lead.leadCategory || "—"}
                </span>
              </div>

              <div className="space-y-0 divide-y divide-slate-100">
                <Field label="Recommended Action" value={lead.recommendedAction} />
                <Field label="Recommended Country" value={lead.recommendedCountry} />
                <Field
                  label="Callback Requested"
                  value={lead.callbackRequested ? "Yes — awaiting call" : "No"}
                />

                {/* Universities */}
                <div className="py-3">
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-2">
                    Top Universities
                  </p>
                  {lead.topUniversities?.length ? (
                    <div className="flex flex-wrap gap-1.5">
                      {lead.topUniversities.map((uni, i) => (
                        <span
                          key={i}
                          className="text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-100
                            px-2.5 py-1 rounded-lg"
                        >
                          {uni}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400">—</p>
                  )}
                </div>
              </div>
            </Card>

            {/* Meeting Status */}
            <Card className="p-6">
              <SectionTitle tag="Counselling">Meeting Status</SectionTitle>

              {meeting ? (
                <div className="space-y-0 divide-y divide-slate-100">
                  {/* status pill */}
                  <div className="pb-3">
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-1.5">
                      Status
                    </p>
                    <span
                      className="inline-flex items-center gap-1.5 text-xs font-bold
                      bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 px-3 py-1 rounded-full"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                      {meeting.status}
                    </span>
                  </div>

                  <Field label="Date" value={meeting.date} />
                  <Field label="Time" value={meeting.time} />
                  <Field label="Mode" value={meeting.mode} />
                  <Field label="Notes" value={meeting.notes} />

                  <div className="py-3 border-b border-slate-100">
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-1">
                      WhatsApp Status
                    </p>
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${
                        WHATSAPP_BADGE[whatsappStatus] || WHATSAPP_BADGE.not_sent
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full inline-block ${
                          whatsappStatus === "sent"
                            ? "bg-emerald-500"
                            : whatsappStatus === "failed"
                            ? "bg-red-500"
                            : "bg-slate-400"
                        }`}
                      />
                      {whatsappStatus}
                    </span>
                  </div>

                  <Field label="WhatsApp Message SID" value={lead.whatsappMessageSid} />

                  <Field
                    label="WhatsApp Sent At"
                    value={
                      lead.whatsappSentAt
                        ? new Date(lead.whatsappSentAt).toLocaleString()
                        : "—"
                    }
                  />

                  <div className="py-3">
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-1">
                      Meeting Link
                    </p>
                    {meeting.meetingLink ? (
                      <a
                        href={meeting.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-blue-600 hover:underline break-all font-medium"
                      >
                        {meeting.meetingLink}
                      </a>
                    ) : (
                      <p className="text-sm text-slate-400">—</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-4">
                    <p className="text-sm font-semibold text-amber-700 mb-1">
                      No meeting scheduled
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Schedule a counselling session for this student.
                    </p>
                  </div>

                  <div className="py-1">
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-2">
                      WhatsApp Status
                    </p>
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${
                        WHATSAPP_BADGE[whatsappStatus] || WHATSAPP_BADGE.not_sent
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full inline-block ${
                          whatsappStatus === "sent"
                            ? "bg-emerald-500"
                            : whatsappStatus === "failed"
                            ? "bg-red-500"
                            : "bg-slate-400"
                        }`}
                      />
                      {whatsappStatus}
                    </span>
                  </div>

                  <Field label="WhatsApp Message SID" value={lead.whatsappMessageSid} />

                  <Field
                    label="WhatsApp Sent At"
                    value={
                      lead.whatsappSentAt
                        ? new Date(lead.whatsappSentAt).toLocaleString()
                        : "—"
                    }
                  />
                </div>
              )}

              <button
                onClick={() => navigate(`/admin/schedule/${lead._id}`)}
                className="mt-4 w-full inline-flex items-center justify-center gap-1.5
                  bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold
                  px-4 py-3 rounded-xl transition-all duration-150"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                  />
                </svg>
                {meeting ? "Update Meeting" : "Schedule Meeting"}
              </button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}