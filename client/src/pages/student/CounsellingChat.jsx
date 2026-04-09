import { useEffect, useRef, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

// ── Icons ──────────────────────────────────────────────────────────────────────
const SendIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
  </svg>
);
const SparkleIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
  </svg>
);
const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);
const AlertIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
  </svg>
);
const SpinnerIcon = ({ size = "4" }) => (
  <svg className={`w-${size} h-${size} animate-spin`} fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

// ── Typing indicator ───────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.8s" }}
        />
      ))}
    </div>
  );
}

// ── Chat bubble ────────────────────────────────────────────────────────────────
function Bubble({ msg, isNew }) {
  const isAI = msg.sender === "ai";
  return (
    <div
      className={`flex gap-3 ${isAI ? "justify-start" : "justify-end"} ${isNew ? "animate-slide-up" : ""}`}
    >
      {/* AI avatar */}
      {isAI && (
        <div className="shrink-0 w-8 h-8 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm mt-1">
          <SparkleIcon />
          {/* white icon */}
          <span className="sr-only">AI</span>
        </div>
      )}

      <div className={`flex flex-col gap-1 max-w-[78%] ${isAI ? "items-start" : "items-end"}`}>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-1">
          {isAI ? "AI Counsellor" : "You"}
        </span>
        <div
          className={`px-4 py-3 rounded-2xl text-[14px] leading-relaxed whitespace-pre-wrap break-words shadow-sm ${
            isAI
              ? "bg-white border border-slate-100 text-slate-700 rounded-tl-sm"
              : "bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-sm"
          }`}
        >
          {msg.text}
        </div>
      </div>

      {/* User avatar */}
      {!isAI && (
        <div className="shrink-0 w-8 h-8 rounded-2xl bg-slate-200 flex items-center justify-center text-slate-500 mt-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
          </svg>
        </div>
      )}
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function CounsellingChat() {
  const [conversation, setConversation] = useState(null);
  const [input, setInput] = useState("");
  const [loadingStart, setLoadingStart] = useState(true);
  const [sending, setSending] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [error, setError] = useState("");
  const [msgCount, setMsgCount] = useState(0);

  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const startConversation = async () => {
      try {
        setLoadingStart(true);
        setError("");
        const res = await api.post("/chat/start");
        setConversation(res.data);
        setMsgCount(res.data?.messages?.length ?? 0);
      } catch (err) {
        console.error("Start conversation error:", err);
        setError(err.response?.data?.message || "Could not start conversation.");
      } finally {
        setLoadingStart(false);
      }
    };
    startConversation();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages, sending]);

  const sendMessage = async () => {
    if (!input.trim() || !conversation?._id || sending) return;
    try {
      setSending(true);
      setError("");
      const currentInput = input.trim();
      setInput("");
      const res = await api.post("/chat/message", {
        conversationId: conversation._id,
        message: currentInput,
      });
      setConversation(res.data);
      setMsgCount(res.data?.messages?.length ?? 0);
    } catch (err) {
      console.error("Send message error:", err);
      setError(err.response?.data?.message || "Could not send message.");
    } finally {
      setSending(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const finishConversation = async () => {
    if (!conversation?._id || finishing) return;
    try {
      setFinishing(true);
      setError("");
      const res = await api.post("/chat/finalize", {
        conversationId: conversation._id,
        callbackRequested: true,
      });
      navigate(`/student/report/${res.data._id}`);
    } catch (err) {
      console.error("Finish conversation error:", err);
      setError(err.response?.data?.message || "Could not finish conversation.");
    } finally {
      setFinishing(false);
    }
  };

  // ── Loading screen ─────────────────────────────────────────────────────────
  if (loadingStart) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-200 animate-pulse">
            <SparkleIcon />
          </div>
          <div>
            <p className="text-slate-800 font-bold text-lg">Starting your session…</p>
            <p className="text-slate-400 text-sm mt-1">Your AI counsellor is getting ready</p>
          </div>
          <SpinnerIcon size="5" />
        </div>
      </div>
    );
  }

  const messages = conversation?.messages ?? [];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-100 px-6 md:px-10 py-3.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-sm font-bold text-slate-800 tracking-tight">CounselAI</span>
        </div>

        {/* Finish button in nav on desktop */}
        <button
          onClick={finishConversation}
          disabled={finishing || sending || !conversation?._id}
          className="hidden sm:flex items-center gap-2 text-[13px] font-semibold px-4 py-2 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {finishing ? <><SpinnerIcon size="3.5" /> Generating…</> : <><CheckIcon /> Finish & Get Report</>}
        </button>
      </nav>

      {/* ── Chat area ── */}
      <div className="flex-1 flex flex-col max-w-3xl w-full mx-auto px-4 md:px-6 py-6 gap-4">

        {/* Header card */}
        <div className="bg-white border border-slate-100 rounded-3xl px-6 py-5 shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-100 shrink-0">
            <SparkleIcon />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-blue-500 uppercase tracking-widest mb-0.5">Live Session</p>
            <h1 className="text-base font-extrabold text-slate-900 tracking-tight">AI Counselling Chat</h1>
            <p className="text-[12.5px] text-slate-400 mt-0.5 leading-snug">
              Answer naturally — your counsellor will adapt to your language and pace.
            </p>
          </div>
        </div>

        {/* Error alert */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm">
            <AlertIcon />
            {error}
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden flex flex-col">

          {/* Scroll area */}
          <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-5 min-h-[360px] max-h-[480px] scroll-smooth">
            {messages.length === 0 && !sending && (
              <div className="flex-1 flex items-center justify-center text-slate-300 text-sm select-none">
                Your conversation will appear here…
              </div>
            )}

            {messages.map((msg, idx) => (
              <Bubble key={idx} msg={msg} isNew={idx >= msgCount - 2} />
            ))}

            {/* Typing indicator while sending */}
            {sending && (
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-8 h-8 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm mt-1">
                  <SparkleIcon />
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm shadow-sm">
                  <TypingDots />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Divider */}
          <div className="border-t border-slate-100" />

          {/* Input row */}
          <div className="px-5 py-4 flex flex-col gap-3 bg-white">
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  rows={1}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-slate-800 placeholder-slate-400 text-[14px] rounded-2xl px-4 py-3 resize-none outline-none transition-all duration-150 leading-relaxed"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message… (Enter to send)"
                  disabled={sending || finishing}
                  style={{ minHeight: "48px", maxHeight: "120px" }}
                  onInput={e => {
                    e.target.style.height = "auto";
                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                  }}
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={sending || finishing || !input.trim()}
                className="shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 text-white flex items-center justify-center shadow-md shadow-blue-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
                aria-label="Send"
              >
                {sending ? <SpinnerIcon size="4" /> : <SendIcon />}
              </button>
            </div>

            {/* Mobile finish button */}
            <button
              onClick={finishConversation}
              disabled={finishing || sending || !conversation?._id}
              className="sm:hidden flex items-center justify-center gap-2 text-[13px] font-semibold py-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {finishing ? <><SpinnerIcon size="3.5" /> Generating Report…</> : <><CheckIcon /> Finish & Get Report</>}
            </button>
          </div>
        </div>

      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.25s ease both; }
      `}</style>
    </div>
  );
}