import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

// ── Icons ──────────────────────────────────────────────────────────────────────
const ArrowLeftIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M19 12H5M12 5l-7 7 7 7" />
  </svg>
);
const FileTextIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
  </svg>
);
const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const CheckListIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
  </svg>
);
const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="3" /><path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);
const SpinnerIcon = () => (
  <svg className="w-8 h-8 animate-spin text-blue-400" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);
const AlertIcon = () => (
  <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
  </svg>
);
const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);
const VideoIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <rect x="2" y="6" width="14" height="12" rx="2" /><path d="M16 10l6-3v10l-6-3V10z" />
  </svg>
);
const LinkIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
  </svg>
);
const ClockIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" />
  </svg>
);
const GraduationIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M22 10L12 5 2 10l10 5 10-5z" />
    <path d="M6 12v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" />
  </svg>
);

// ── Section wrapper ────────────────────────────────────────────────────────────
function Section({ icon, title, accent = "blue", children }) {
  const accents = {
    blue: { bg: "bg-blue-50", icon: "text-blue-500", border: "border-blue-100" },
    indigo: { bg: "bg-indigo-50", icon: "text-indigo-500", border: "border-indigo-100" },
    violet: { bg: "bg-violet-50", icon: "text-violet-500", border: "border-violet-100" },
    emerald: { bg: "bg-emerald-50", icon: "text-emerald-500", border: "border-emerald-100" },
  };
  const a = accents[accent];
  return (
    <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
      <div className={`flex items-center gap-3 px-7 py-5 border-b ${a.border} ${a.bg}`}>
        <div className={`shrink-0 ${a.icon}`}>{icon}</div>
        <h2 className="text-[15px] font-bold text-slate-800 tracking-tight">{title}</h2>
      </div>
      <div className="px-7 py-6">{children}</div>
    </div>
  );
}

// ── Detail row ─────────────────────────────────────────────────────────────────
function DetailRow({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">{label}</span>
      <span className="text-[13.5px] font-medium text-slate-700">{value || <span className="text-slate-300 italic">Not provided</span>}</span>
    </div>
  );
}

// ── Meeting info row ───────────────────────────────────────────────────────────
function MeetingRow({ icon, label, value, isLink }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-emerald-500 shrink-0">{icon}</div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">{label}</p>
        {isLink && value ? (
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="text-[13.5px] font-medium text-blue-500 hover:underline break-all"
          >
            {value}
          </a>
        ) : (
          <p className="text-[13.5px] font-medium text-slate-700">{value || <span className="text-slate-300 italic">—</span>}</p>
        )}
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function StudentReport() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/chat/report/${id}`);
        setReport(res.data);
      } catch (err) {
        console.error("Fetch report error:", err);
        setError(err.response?.data?.message || "Failed to load report");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-4 text-slate-400">
        <SpinnerIcon />
        <p className="text-sm font-medium">Loading your report…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-3 text-center px-4">
        <AlertIcon />
        <p className="text-slate-700 font-semibold">{error}</p>
        <button
          onClick={() => navigate("/student/home")}
          className="text-sm text-blue-500 hover:underline mt-1"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  if (!report) return null;

  const { summary, studentDetails, nextSteps, booking } = report;

  const steps = nextSteps
    ? nextSteps.split("\n").map((s) => s.replace(/^[-•*\d.]+\s*/, "").trim()).filter(Boolean)
    : [];

  const universityList =
    studentDetails?.recommendedUniversitiesDetailed?.length
      ? studentDetails.recommendedUniversitiesDetailed
      : (studentDetails?.topUniversities || []).map((name) => ({ name }));

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* ── Nav bar ── */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-100 px-6 md:px-10 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-sm font-bold text-slate-800 tracking-tight">CounselAI</span>
        </div>
        <button
          onClick={() => navigate("/student/home")}
          className="flex items-center gap-2 text-[13px] font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors px-3 py-2 rounded-xl"
        >
          <ArrowLeftIcon />
          Back to Dashboard
        </button>
      </nav>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-10">
        {/* ── Page title ── */}
        <div className="mb-8">
          <p className="text-[13px] font-semibold text-blue-500 uppercase tracking-widest mb-1">Session Report</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Your Counselling Summary
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            A detailed breakdown of your session, profile, and recommended next steps.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          {/* ── 1. Summary ── */}
          <Section icon={<FileTextIcon />} title="Conversation Summary" accent="blue">
            <p className="text-[14px] text-slate-600 leading-relaxed">
              {summary || <span className="text-slate-300 italic">No summary available.</span>}
            </p>
          </Section>

          {/* ── 2. Student Details ── */}
          <Section icon={<UserIcon />} title="Your Profile" accent="indigo">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
              <DetailRow label="Full Name" value={studentDetails?.name} />
              <DetailRow label="Email Address" value={studentDetails?.email} />
              <DetailRow label="Phone Number" value={studentDetails?.phone} />
              <DetailRow label="Location" value={studentDetails?.location} />
              <DetailRow label="Education Level" value={studentDetails?.education_level} />
              <DetailRow label="Field of Study" value={studentDetails?.field} />
              <DetailRow label="Institution" value={studentDetails?.institution} />
              <DetailRow label="GPA / Percentage" value={studentDetails?.gpa_percentage} />
              <DetailRow label="Target Countries" value={studentDetails?.target_countries?.join(", ")} />
              <DetailRow label="Course Interest" value={studentDetails?.course_interest} />
              <DetailRow label="Intake Timing" value={studentDetails?.intake_timing} />
              <DetailRow label="Test Status" value={studentDetails?.test_status} />
              <DetailRow label="Test Score" value={studentDetails?.test_score} />
              <DetailRow label="Budget Range" value={studentDetails?.budget_range} />
              <DetailRow label="Scholarship Interest" value={studentDetails?.scholarship_interest} />
              <DetailRow label="Application Timeline" value={studentDetails?.application_timeline} />
              <div className="sm:col-span-2">
                <DetailRow label="Concerns / Questions" value={studentDetails?.concerns} />
              </div>
            </div>
          </Section>

          {/* ── 3. Universities ── */}
          <Section icon={<GraduationIcon />} title="Top University Recommendations" accent="violet">
            {universityList.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {universityList.map((uni, index) => (
                  <div
                    key={index}
                    className="border border-slate-200 rounded-2xl p-5 bg-slate-50"
                  >
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1">
                          Recommendation {index + 1}
                        </p>
                        <h3 className="text-lg font-bold text-slate-800">
                          {uni.name || "University name not available"}
                        </h3>

                        {(uni.city || uni.country) && (
                          <p className="text-sm text-slate-500 mt-1">
                            {[uni.city, uni.country].filter(Boolean).join(", ")}
                          </p>
                        )}
                      </div>

                      {uni.matchScore !== undefined && (
                        <div className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1.5 rounded-full text-sm font-semibold">
                          Match Score: {uni.matchScore}
                        </div>
                      )}
                    </div>

                    {uni.officialUrl && (
                      <a
                        href={uni.officialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 mt-4 text-[13px] font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        <LinkIcon />
                        Visit Official Website
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[14px] text-slate-600 leading-relaxed">
                <span className="text-slate-300 italic">No university recommendations available yet.</span>
              </p>
            )}
          </Section>

          {/* ── 4. Next Steps ── */}
          <Section icon={<CheckListIcon />} title="Recommended Next Steps" accent="violet">
            {steps.length > 0 ? (
              <ol className="flex flex-col gap-3">
                {steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="shrink-0 mt-0.5 w-6 h-6 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-[11px] font-bold">
                      {i + 1}
                    </div>
                    <p className="text-[13.5px] text-slate-600 leading-relaxed pt-0.5">{step}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-[14px] text-slate-600 leading-relaxed">
                {nextSteps || <span className="text-slate-300 italic">No next steps provided.</span>}
              </p>
            )}
          </Section>

          {/* ── 5. Booking & Meeting ── */}
          <Section icon={<CalendarIcon />} title="Meeting & Booking" accent="emerald">
            {booking?.scheduled ? (
              <div className="flex flex-col gap-5">
                <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[12.5px] font-bold px-3.5 py-2 rounded-full w-fit">
                  <CheckIcon />
                  {booking.status || "Meeting Confirmed"}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
                  <MeetingRow
                    icon={
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="18" rx="3" />
                        <path d="M16 2v4M8 2v4M3 10h18" />
                      </svg>
                    }
                    label="Date"
                    value={booking.date}
                  />
                  <MeetingRow icon={<ClockIcon />} label="Time" value={booking.time} />
                  <MeetingRow icon={<VideoIcon />} label="Mode" value={booking.mode} />
                  <MeetingRow icon={<LinkIcon />} label="Meeting Link" value={booking.meetingLink} isLink />
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-[12.5px] font-bold px-3.5 py-2 rounded-full w-fit">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4M12 16h.01" />
                  </svg>
                  No Meeting Scheduled Yet
                </div>
                <p className="text-[13.5px] text-slate-500 leading-relaxed">
                  Your counsellor will schedule a meeting soon.
                </p>
                {(booking?.bookingLink || "/student/book-demo") && (
                  <a
                    href={booking?.bookingLink || "/student/book-demo"}
                    className="inline-flex items-center gap-2 text-[13px] font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    <LinkIcon />
                    {booking?.bookingLink || "/student/book-demo"}
                  </a>
                )}
              </div>
            )}
          </Section>
        </div>

        {/* ── Footer ── */}
        <div className="mt-10 text-center">
          <button
            onClick={() => navigate("/student/home")}
            className="inline-flex items-center gap-2 text-[13px] font-medium text-slate-400 hover:text-slate-700 transition-colors"
          >
            <ArrowLeftIcon />
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
