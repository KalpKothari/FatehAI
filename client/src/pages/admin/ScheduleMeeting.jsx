import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

// ── Icon Components ────────────────────────────────────────────────────────────
const CalendarIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="3" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);
const ClockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 3" />
  </svg>
);
const VideoIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <rect x="2" y="6" width="14" height="12" rx="2" />
    <path d="M16 10l6-3v10l-6-3V10z" />
  </svg>
);
const LinkIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
  </svg>
);
const NotesIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
  </svg>
);
const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);
const AlertIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v4M12 16h.01" />
  </svg>
);
const ChevronIcon = () => (
  <svg className="w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M6 9l6 6 6-6" />
  </svg>
);
const Spinner = () => (
  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

// ── Field wrapper ──────────────────────────────────────────────────────────────
function Field({ label, icon, children, helper }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-600 tracking-wide uppercase">
        <span className="text-blue-500">{icon}</span>
        {label}
      </label>
      {children}
      {helper && <p className="text-[11.5px] text-slate-400 pl-0.5">{helper}</p>}
    </div>
  );
}

const inputCls =
  "w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 " +
  "rounded-xl px-4 py-3 text-sm transition-all duration-150 outline-none " +
  "focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 hover:border-slate-300";

// ── Main Component ─────────────────────────────────────────────────────────────
export default function ScheduleMeeting() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    date: "",
    time: "",
    mode: "online",
    meetingLink: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      const res = await api.post("/meetings", {
        leadId: id,
        ...form,
      });

      if (res.data.whatsappStatus === "sent") {
        setSuccessMessage("Meeting scheduled and WhatsApp message sent to student.");
      } else if (res.data.whatsappStatus === "failed") {
        setSuccessMessage(
          "Meeting scheduled, but WhatsApp message could not be sent."
        );
      } else {
        setSuccessMessage("Meeting scheduled successfully.");
      }

      setTimeout(() => {
        navigate(`/admin/leads/${id}`);
      }, 1500);
    } catch (err) {
      console.error("Schedule meeting error:", err);
      setError(err.response?.data?.message || "Failed to schedule meeting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4 sm:p-8">
      {/* Card */}
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">

        {/* Header stripe */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-7">
          <div className="flex items-center gap-3 mb-1">
            <div className="bg-white/20 rounded-xl p-2">
              <CalendarIcon />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">Schedule a Meeting</h1>
          </div>
          <p className="text-blue-100 text-[13px] pl-0.5 leading-snug">
            Schedule a counselling session for this student easily. A WhatsApp confirmation will be sent automatically.
          </p>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="px-8 py-7 flex flex-col gap-5">

          {/* Alerts */}
          {error && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm animate-fade-in">
              <span className="mt-0.5 shrink-0 text-red-400"><AlertIcon /></span>
              <span>{error}</span>
            </div>
          )}
          {successMessage && (
            <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-2xl text-sm animate-fade-in">
              <span className="mt-0.5 shrink-0 text-emerald-500"><CheckIcon /></span>
              <span>{successMessage}</span>
            </div>
          )}

          {/* Date + Time side by side on sm+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Date" icon={<CalendarIcon />} helper="Pick a session date">
              <input
                type="date"
                className={inputCls}
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
            </Field>

            <Field label="Time" icon={<ClockIcon />} helper="Select the start time">
              <input
                type="time"
                className={inputCls}
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                required
              />
            </Field>
          </div>

          {/* Mode */}
          <Field label="Session Mode" icon={<VideoIcon />} helper="Online or in-person?">
            <div className="relative">
              <select
                className={inputCls + " appearance-none pr-10 cursor-pointer"}
                value={form.mode}
                onChange={(e) => setForm({ ...form, mode: e.target.value })}
              >
                <option value="online"> Online</option>
                <option value="offline"> Offline / In-person</option>
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronIcon />
              </span>
            </div>
          </Field>

          {/* Meeting Link */}
          <Field label="Meeting Link" icon={<LinkIcon />} helper="Zoom, Google Meet, Teams, etc.">
            <input
              type="text"
              placeholder="https://meet.google.com/abc-xyz"
              className={inputCls}
              value={form.meetingLink}
              onChange={(e) => setForm({ ...form, meetingLink: e.target.value })}
            />
          </Field>

          {/* Notes */}
          <Field label="Notes" icon={<NotesIcon />} helper="Agenda, topics to cover, or special instructions">
            <textarea
              placeholder="Add any notes or agenda for this session…"
              className={inputCls + " resize-none leading-relaxed"}
              rows={4}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </Field>

          {/* Divider */}
          <div className="border-t border-slate-100" />

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full flex items-center justify-center gap-2.5
              bg-gradient-to-r from-blue-600 to-indigo-600
              hover:from-blue-700 hover:to-indigo-700
              active:scale-[0.985]
              disabled:opacity-60 disabled:cursor-not-allowed
              text-white font-semibold text-sm
              py-3.5 px-6 rounded-2xl
              shadow-md shadow-blue-200
              transition-all duration-150
            "
          >
            {loading ? (
              <>
                <Spinner />
                <span>Scheduling…</span>
              </>
            ) : (
              <>
                <CalendarIcon />
                <span>Schedule &amp; Send WhatsApp</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Fade-in keyframe via inline style tag */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.25s ease both; }
      `}</style>
    </div>
  );
}