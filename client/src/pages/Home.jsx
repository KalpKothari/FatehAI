import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

/* ─── tiny hook: IntersectionObserver for reveal-on-scroll ─── */
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ─── animated counter ─── */
function Counter({ end, suffix = "" }) {
  const [count, setCount] = useState(0);
  const [ref, visible] = useReveal(0.4);
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = Math.ceil(end / 60);
    const id = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(id); }
      else setCount(start);
    }, 20);
    return () => clearInterval(id);
  }, [visible, end]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ─── feature icons as inline SVGs (no external dep) ─── */
const IconMic = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/>
  </svg>
);
const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M12 2L3 7v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V7z"/>
  </svg>
);
const IconMap = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>
  </svg>
);
const IconStar = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const IconArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

/* ─── step data ─── */
const steps = [
  { num: "01", emoji: "🎙️", title: "Start a Voice Conversation", desc: "Tell our AI about your study goals, preferred country, and course — in your own words." },
  { num: "02", emoji: "🧭", title: "Get a Personalised Roadmap", desc: "FatehAI analyses your profile and suggests the best-fit universities and programmes." },
  { num: "03", emoji: "📋", title: "Expert Counsellor Review", desc: "A Fateh counsellor reviews your AI roadmap and connects for a deeper consultation." },
  { num: "04", emoji: "✈️", title: "Apply & Fly", desc: "We handle applications, visa prep, and everything until you land at your dream campus." },
];

const features = [
  {
    icon: <IconMic />,
    color: "from-blue-500 to-cyan-400",
    bg: "bg-blue-50",
    text: "text-blue-600",
    title: "AI Voice Guidance",
    desc: "Skip the forms. Start with a natural voice conversation and let our AI understand exactly what you need.",
  },
  {
    icon: <IconShield />,
    color: "from-violet-500 to-purple-400",
    bg: "bg-violet-50",
    text: "text-violet-600",
    title: "Trusted Fateh Support",
    desc: "Every AI recommendation is backed by Fateh's 10+ years of counselling expertise and 99% visa success.",
  },
  {
    icon: <IconMap />,
    color: "from-pink-500 to-rose-400",
    bg: "bg-pink-50",
    text: "text-pink-600",
    title: "Smoother Journey",
    desc: "From the first question to your flight booking — every touchpoint is clear, comfortable, and connected.",
  },
];

const cities = ["Ahmedabad", "Bangalore", "Chandigarh", "Chennai", "Delhi", "Hyderabad", "Mumbai", "Pune"];

/* ═══════════════════════════════════════════════════════════════ */
function Home() {
  /* hero text animation trigger */
  const [heroReady, setHeroReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setHeroReady(true), 80); return () => clearTimeout(t); }, []);

  const [featRef, featVis] = useReveal();
  const [stepsRef, stepsVis] = useReveal();
  const [trustRef, trustVis] = useReveal();
  const [ctaRef, ctaVis] = useReveal(0.3);

  return (
    <div className="min-h-screen bg-[#f8faff] text-slate-800 overflow-x-hidden font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

        * { box-sizing: border-box; }
        body { font-family: 'DM Sans', sans-serif; }
        .display { font-family: 'Bricolage Grotesque', sans-serif; }

        @keyframes floatCard {
          0%,100% { transform: translateY(0px) rotate(-1deg); }
          50%      { transform: translateY(-10px) rotate(-1deg); }
        }
        @keyframes floatBadge {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-6px); }
        }
        @keyframes gradShift {
          0%,100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }
        @keyframes pulseRing {
          0% { transform: scale(1); opacity:.6; }
          100% { transform: scale(1.6); opacity:0; }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(28px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity:0; }
          to   { opacity:1; }
        }
        @keyframes slideRight {
          from { opacity:0; transform:translateX(-24px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes blobMove {
          0%,100% { border-radius:60% 40% 30% 70%/60% 30% 70% 40%; }
          50%      { border-radius:30% 60% 70% 40%/50% 60% 30% 60%; }
        }

        .float-card { animation: floatCard 6s ease-in-out infinite; }
        .float-badge { animation: floatBadge 4s ease-in-out infinite; }
        .grad-shift {
          background-size: 200% 200%;
          animation: gradShift 6s ease infinite;
        }
        .pulse-ring::after {
          content:'';
          position:absolute; inset:-4px;
          border-radius:inherit;
          border:2px solid currentColor;
          animation: pulseRing 2s ease-out infinite;
        }
        .blob { animation: blobMove 8s ease-in-out infinite; }

        .reveal { opacity:0; }
        .reveal.up   { transform:translateY(32px); }
        .reveal.right{ transform:translateX(-24px); }
        .reveal.vis  { animation: fadeUp .65s ease forwards; }
        .reveal.right.vis { animation: slideRight .65s ease forwards; }

        .card-hover {
          transition: transform .25s ease, box-shadow .25s ease;
        }
        .card-hover:hover {
          transform: translateY(-6px);
          box-shadow: 0 24px 48px rgba(99,102,241,.12);
        }

        .btn-primary {
          position: relative;
          overflow: hidden;
          transition: transform .2s ease, box-shadow .2s ease;
        }
        .btn-primary::before {
          content:'';
          position:absolute;
          inset:0;
          background:rgba(255,255,255,.15);
          transform:translateX(-100%);
          transition:transform .3s ease;
        }
        .btn-primary:hover { transform:translateY(-2px); box-shadow:0 12px 32px rgba(79,70,229,.35); }
        .btn-primary:hover::before { transform:translateX(0); }

        .btn-outline {
          transition: background .2s ease, transform .2s ease, box-shadow .2s ease;
        }
        .btn-outline:hover {
          background: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,.07);
        }

        .step-line {
          position: absolute;
          top: 28px;
          left: calc(50% + 28px);
          width: calc(100% - 56px);
          height: 2px;
          background: linear-gradient(90deg, #818cf8 0%, #c4b5fd 100%);
        }
        @media (max-width:767px) { .step-line { display:none; } }

        .noise-overlay::before {
          content: '';
          position:absolute; inset:0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events:none;
          border-radius:inherit;
        }
      `}</style>

      {/* ── Ambient BG blobs ── */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="blob absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 opacity-60 blur-3xl" />
        <div className="blob absolute top-1/3 right-0 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-violet-100 to-pink-100 opacity-50 blur-3xl" style={{animationDelay:"3s"}} />
        <div className="blob absolute bottom-0 left-1/4 h-[450px] w-[450px] rounded-full bg-gradient-to-br from-sky-100 to-cyan-100 opacity-50 blur-3xl" style={{animationDelay:"5s"}} />
      </div>

      {/* ════════════ NAVBAR ════════════ */}
      <nav className="sticky top-0 z-50 backdrop-blur-2xl bg-white/75 border-b border-slate-100/80 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-black text-sm shadow-lg shadow-blue-200">F</div>
            <div>
              <h1 className="display text-xl font-bold text-slate-900 leading-none">
                Fateh<span className="text-blue-600">AI</span>
              </h1>
              <p className="text-[10px] text-slate-400 tracking-wide leading-none mt-0.5">Study Abroad, Reimagined</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm text-slate-600 font-medium">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How it works</a>
            <a href="#trust" className="hover:text-blue-600 transition-colors">About</a>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-outline hidden sm:block rounded-full border border-slate-200 bg-white/60 px-4 py-2 text-sm font-medium text-slate-700">
              Login
            </Link>
            <Link to="/register" className="btn-primary rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-200">
              Get Started →
            </Link>
          </div>
        </div>
      </nav>

      {/* ════════════ HERO ════════════ */}
      <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:px-10 lg:grid-cols-2 lg:py-28">

        {/* Left */}
        <div>
          {/* pill badge */}
          <div
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm"
            style={{ animation: heroReady ? "fadeIn .5s ease forwards" : "none", opacity: heroReady ? 1 : 0 }}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="pulse-ring relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 text-emerald-500"></span>
            </span>
            Now with AI Voice - powered by Fateh
          </div>

          <h1
            className="display text-5xl font-extrabold leading-[1.1] text-slate-900 md:text-6xl lg:text-[4.2rem]"
            style={{ animation: heroReady ? "fadeUp .7s .1s ease both" : "none" }}
          >
            Your dream university is one
            <span className="block mt-1">
               {" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent grad-shift">conversation</span>
                <span className="absolute inset-x-0 bottom-1 h-3 bg-blue-100 rounded-sm -z-0 opacity-60" />
              </span>{" "}
              away.
            </span>
          </h1>

          <p
            className="mt-6 max-w-xl text-lg leading-8 text-slate-500"
            style={{ animation: heroReady ? "fadeUp .7s .25s ease both" : "none" }}
          >
            FatehAI combines the power of voice AI with Fateh's trusted counselling to guide Indian students through every step of their UK & Ireland study abroad journey.
          </p>

          {/* tags */}
          <div
            className="mt-7 flex flex-wrap gap-2"
            style={{ animation: heroReady ? "fadeUp .7s .35s ease both" : "none" }}
          >
            {["🎙 AI Voice Agent", "🎓 120+ Universities", "🛂 99% Visa Success", "🇬🇧 UK & Ireland"].map(tag => (
              <span key={tag} className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-600 shadow-sm">
                {tag}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div
            className="mt-9 flex flex-wrap gap-4"
            style={{ animation: heroReady ? "fadeUp .7s .45s ease both" : "none" }}
          >
            <Link to="/register" className="btn-primary flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-blue-200">
              Begin Your Journey <IconArrow />
            </Link>
            <Link to="/login" className="btn-outline flex items-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-3.5 font-semibold text-slate-700">
              🎙 Try AI Voice Call
            </Link>
          </div>

          {/* social proof row */}
          <div
            className="mt-9 flex items-center gap-4"
            style={{ animation: heroReady ? "fadeIn .7s .6s ease both" : "none", opacity: 0 }}
          >
            <div className="flex -space-x-2">
              {["🧑‍🎓","👩‍🎓","🧑🏽‍🎓","👩🏾‍🎓","🧑🏻‍🎓"].map((e,i) => (
                <span key={i} className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-blue-50 to-indigo-100 text-base shadow-sm">{e}</span>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_,i) => <IconStar key={i} />)}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Trusted by <strong className="text-slate-700">40,000+</strong> students across India</p>
            </div>
          </div>
        </div>

        {/* Right — floating hero card */}
        <div className="relative flex items-center justify-center">
          {/* glow */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-72 w-72 rounded-full bg-gradient-to-br from-blue-200 to-indigo-200 opacity-40 blur-3xl" />
          </div>

          <div className="float-card relative w-full max-w-sm">
            {/* main card */}
            <div className="noise-overlay relative rounded-[32px] bg-white/90 backdrop-blur-xl border border-white shadow-[0_32px_80px_rgba(99,102,241,.15)] p-6">
              {/* header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Your Journey</p>
                  <h3 className="display text-xl font-bold text-slate-900 mt-0.5">FatehAI Dashboard</h3>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-2xl shadow-lg shadow-blue-200">🎓</div>
              </div>

              {/* AI message bubble */}
              <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 p-4 mb-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-sm shadow-md shadow-blue-200">🤖</div>
                  <div>
                    <p className="text-xs font-semibold text-blue-700 mb-1">FatehAI</p>
                    <p className="text-sm text-slate-600 leading-relaxed">Hi Priya! Based on your profile, I found <strong className="text-slate-900">3 universities</strong> in Ireland that match your goals. Shall I walk you through them?</p>
                  </div>
                </div>
              </div>

              {/* stats grid */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  {label:"Match Score", val:"94%", color:"text-emerald-600", bg:"bg-emerald-50"},
                  {label:"Scholarships", val:"5", color:"text-blue-600", bg:"bg-blue-50"},
                  {label:"Visa Odds", val:"99%", color:"text-violet-600", bg:"bg-violet-50"},
                ].map(s => (
                  <div key={s.label} className={`rounded-2xl ${s.bg} p-3 text-center`}>
                    <p className={`text-xl font-black ${s.color}`}>{s.val}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* progress */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-500 font-medium">Application Progress</span>
                  <span className="font-semibold text-blue-600">Step 2 of 5</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full w-[38%] rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />
                </div>
                <p className="text-[11px] text-slate-400 mt-2">Documents collection in progress…</p>
              </div>
            </div>

            {/* floating badges */}
            <div className="float-badge absolute -top-4 -right-4 flex items-center gap-2 rounded-2xl bg-white border border-slate-100 px-3 py-2 shadow-lg" style={{animationDelay:"1s"}}>
              <span className="text-lg">🏆</span>
              <div>
                <p className="text-xs font-bold text-slate-800">Offer Received!</p>
                <p className="text-[10px] text-slate-400">Trinity College Dublin</p>
              </div>
            </div>

            <div className="float-badge absolute -bottom-4 -left-4 flex items-center gap-2 rounded-2xl bg-white border border-slate-100 px-3 py-2 shadow-lg" style={{animationDelay:"2.5s"}}>
              <span className="text-lg">✅</span>
              <div>
                <p className="text-xs font-bold text-slate-800">Visa Approved</p>
                <p className="text-[10px] text-slate-400">Ireland Student Visa</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ STATS STRIP ════════════ */}
      <section className="border-y border-slate-100 bg-white/60 backdrop-blur-sm">
        <div ref={trustRef} className="mx-auto max-w-7xl px-6 py-8 md:px-10">
          <div className="grid grid-cols-3 divide-x divide-slate-100 gap-0">
            {[
              { end: 120, suffix: "+", label: "University Partnerships" },
              { end: 40000, suffix: "+", label: "Dreams Guided" },
              { end: 99, suffix: "%", label: "Ireland Visa Success" },
            ].map((s,i) => (
              <div key={i} className={`px-6 text-center ${trustVis ? "reveal vis up" : "reveal up"}`} style={{animationDelay:`${i*.12}s`}}>
                <p className="display text-4xl font-black text-slate-900 md:text-5xl">
                  <Counter end={s.end} suffix={s.suffix} />
                </p>
                <p className="mt-1 text-sm text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ FEATURES ════════════ */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-24 md:px-10">
        <div ref={featRef} className="mb-14 text-center">
          <p className={`text-sm font-semibold uppercase tracking-[.2em] text-indigo-500 ${featVis ? "reveal vis up" : "reveal up"}`}>
            Why FatehAI
          </p>
          <h2 className={`display mt-3 text-4xl font-extrabold text-slate-900 md:text-5xl ${featVis ? "reveal vis up" : "reveal up"}`} style={{animationDelay:".1s"}}>
            Everything you need,<br className="hidden md:block" />{" "}
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">nothing you don't</span>
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={i}
              className={`card-hover group rounded-[28px] border border-white bg-white p-7 shadow-[0_4px_24px_rgba(0,0,0,0.06)] ${featVis ? "reveal vis up" : "reveal up"}`}
              style={{ animationDelay: `${.15 + i*.12}s` }}
            >
              <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${f.bg} ${f.text} transition-transform duration-300 group-hover:scale-110`}>
                {f.icon}
              </div>
              <h3 className="display text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
              <p className="leading-7 text-slate-500 text-sm">{f.desc}</p>
              <div className={`mt-5 inline-flex items-center gap-1 text-sm font-semibold ${f.text} opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0`}>
                Learn more <IconArrow />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════ HOW IT WORKS ════════════ */}
      <section id="how-it-works" className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 py-28">
        {/* bg texture */}
        <div className="absolute inset-0 opacity-20" style={{backgroundImage:"radial-gradient(circle at 20% 50%, #6366f1 0%, transparent 50%), radial-gradient(circle at 80% 20%, #3b82f6 0%, transparent 50%)"}} />

        <div ref={stepsRef} className="relative mx-auto max-w-7xl px-6 md:px-10">
          <div className="mb-16 text-center">
            <p className={`text-sm font-semibold uppercase tracking-[.2em] text-blue-300 ${stepsVis ? "reveal vis up" : "reveal up"}`}>
              How It Works
            </p>
            <h2 className={`display mt-3 text-4xl font-extrabold text-white md:text-5xl ${stepsVis ? "reveal vis up" : "reveal up"}`} style={{animationDelay:".1s"}}>
              Four steps to your{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">dream campus</span>
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            {steps.map((step, i) => (
              <div
                key={i}
                className={`relative text-center ${stepsVis ? "reveal vis up" : "reveal up"}`}
                style={{ animationDelay: `${.15 + i*.15}s` }}
              >
                {/* connector line */}
                {i < steps.length - 1 && <div className="step-line opacity-30" />}

                {/* icon circle */}
                <div className="relative mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-2xl">
                  {step.emoji}
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 text-[10px] font-bold text-white">
                    {i+1}
                  </span>
                </div>

                <h3 className="display font-bold text-white text-base mb-2">{step.title}</h3>
                <p className="text-sm leading-7 text-blue-200/80">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ TRUST / BRAND ════════════ */}
      <section id="trust" className="mx-auto max-w-7xl px-6 py-24 md:px-10">
        <div className="grid gap-6 lg:grid-cols-5">
          {/* left wide card */}
          <div className="lg:col-span-3 rounded-[32px] border border-slate-100 bg-white p-8 shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[.2em] text-indigo-500 mb-3">Fateh Education — Since 2012</p>
            <h2 className="display text-3xl font-extrabold text-slate-900 md:text-4xl leading-tight">
              A brand students and parents{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">genuinely trust</span>
            </h2>
            <p className="mt-4 leading-8 text-slate-500">
              Fateh is known for reliable counselling, deep university partnerships, and consistent support at every stage. FatehAI adds speed and intelligence without losing the human warmth.
            </p>

            {/* checklist */}
            <ul className="mt-6 space-y-3">
              {["Dedicated visa & SOP support", "Scholarship shortlisting included", "Post-arrival check-ins by counsellors", "IELTS & English test preparation"].map(item => (
                <li key={item} className="flex items-center gap-3 text-sm text-slate-600">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"><IconCheck /></span>
                  {item}
                </li>
              ))}
            </ul>

            {/* cities */}
            <div className="mt-7 flex flex-wrap gap-2">
              {cities.map(c => (
                <span key={c} className="rounded-full bg-indigo-50 px-3.5 py-1.5 text-xs font-medium text-indigo-700 border border-indigo-100">
                  📍 {c}
                </span>
              ))}
            </div>
          </div>

          {/* right CTA card */}
          <div className="noise-overlay lg:col-span-2 relative rounded-[32px] bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 p-8 text-white shadow-[0_24px_64px_rgba(99,102,241,.3)] overflow-hidden">
            {/* decorative circles */}
            <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-white/10" />
            <div className="absolute -bottom-16 -left-8 h-48 w-48 rounded-full bg-white/10" />

            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[.2em] text-blue-200 mb-3">Start for free</p>
              <h2 className="display text-3xl font-extrabold leading-tight md:text-4xl">
                Take the first step towards your{" "}
                <span className="text-cyan-300">dream campus</span>
              </h2>
              <p className="mt-4 text-blue-100 leading-7 text-sm">
                Begin with a voice conversation — no forms, no confusion. Everything feels clearer, faster, and more personal.
              </p>

              <div className="mt-8 flex flex-col gap-3">
                <Link to="/register" className="btn-primary flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 font-bold text-indigo-700 shadow-lg">
                  Create Free Account <IconArrow />
                </Link>
                <Link to="/login" className="btn-outline flex items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-6 py-3.5 font-semibold text-white">
                  Login to my account
                </Link>
              </div>

              <p className="mt-5 text-center text-xs text-blue-200">No credit card required · 100% free to start</p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ FINAL CTA BANNER ════════════ */}
      <section ref={ctaRef} className="mx-auto max-w-7xl px-6 pb-24 md:px-10">
        <div
          className={`relative overflow-hidden rounded-[40px] bg-gradient-to-r from-slate-900 to-blue-950 px-8 py-16 text-center shadow-[0_32px_80px_rgba(15,23,42,.2)] ${ctaVis ? "reveal vis up" : "reveal up"}`}
        >
          {/* bg circles */}
          <div className="absolute inset-0 pointer-events-none" style={{background:"radial-gradient(ellipse at 30% 50%, rgba(99,102,241,.25) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(59,130,246,.2) 0%, transparent 60%)"}} />

          <div className="relative max-w-2xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-[.2em] text-blue-300 mb-4">Your future starts now</p>
            <h2 className="display text-4xl font-extrabold text-white leading-tight md:text-5xl">
              Ready to talk to{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">FatehAI?</span>
            </h2>
            <p className="mt-5 text-slate-300 leading-8">
              Join 40,000+ students who trusted Fateh with their UK & Ireland journey. Start with a free voice conversation today.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/register" className="btn-primary flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-4 font-bold text-white shadow-xl shadow-blue-900/40">
                Begin My Journey <IconArrow />
              </Link>
              <Link to="/login" className="btn-outline flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-8 py-4 font-semibold text-white">
                🎙 Try AI Voice Call
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ FOOTER ════════════ */}
      <footer className="border-t border-slate-100 bg-white/60 py-8">
        <div className="mx-auto max-w-7xl px-6 md:px-10 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-black text-xs">F</div>
            <span className="display font-bold text-slate-800">Fateh<span className="text-blue-600">AI</span></span>
          </div>
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} Fateh Education. All rights reserved.</p>
          <div className="flex gap-5 text-xs text-slate-500">
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;