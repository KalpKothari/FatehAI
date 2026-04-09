import { useState, useEffect, useRef } from "react";
import api from "../../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [showPwd, setShowPwd] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const [filledFields, setFilledFields] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const nameRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => { setMounted(true); nameRef.current?.focus(); }, 120);
    return () => clearTimeout(t);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleBlur = (name) => {
    setFocusedField("");
    if (form[name]) setFilledFields(prev => new Set([...prev, name]));
    else setFilledFields(prev => { const n = new Set(prev); n.delete(name); return n; });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { setError("Please fill in all fields"); return; }
    try {
      setLoading(true);
      await api.post("/auth/register", form);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const pwdStrength = form.password.length === 0 ? null
    : form.password.length < 6 ? { w: "25%", color: "#f43f5e", label: "Weak" }
    : form.password.length < 10 ? { w: "60%", color: "#f59e0b", label: "Good" }
    : { w: "100%", color: "#10b981", label: "Strong" };

  const progressCount = [form.name, form.email, form.password].filter(Boolean).length;
  const progressPct = Math.round((progressCount / 3) * 100);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#eef2ff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1.5rem",
      fontFamily: "'DM Sans', sans-serif",
      overflow: "hidden",
      position: "relative",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes rise     { from { opacity:0; transform:translateY(28px) scale(.98); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes fadeUp   { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
        @keyframes popIn    { from { opacity:0; transform:scale(.6); } to { opacity:1; transform:scale(1); } }
        @keyframes spin     { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        @keyframes shimmer  { from { background-position:-200% center; } to { background-position:200% center; } }
        @keyframes checkPop { 0% { stroke-dashoffset:32; } 100% { stroke-dashoffset:0; } }
        @keyframes shake    { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-5px)} 40%,80%{transform:translateX(5px)} }
        @keyframes floatA   { 0%,100%{transform:translateY(0) rotate(0deg);} 50%{transform:translateY(-12px) rotate(2deg);} }
        @keyframes floatB   { 0%,100%{transform:translateY(0) rotate(0deg);} 50%{transform:translateY(-8px) rotate(-1.5deg);} }
        @keyframes waveBlob { 0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%;} 50%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%;} }
        @keyframes dotBlink { 0%,80%,100%{opacity:.2;transform:scale(.8);} 40%{opacity:1;transform:scale(1);} }
        @keyframes progressFill { from { width: 0%; } to { width: var(--pw); } }

        .card-enter   { animation: rise .6s cubic-bezier(.22,1,.36,1) both; }
        .fade-up      { animation: fadeUp .5s ease both; }
        .shake-err    { animation: shake .35s ease; }
        .check-path   { stroke-dasharray:32; stroke-dashoffset:32; animation: checkPop .45s .1s ease forwards; }
        .float-a      { animation: floatA 6s ease-in-out infinite; }
        .float-b      { animation: floatB 8s ease-in-out infinite; }
        .blob         { animation: waveBlob 10s ease-in-out infinite; }

        .fat-input {
          width:100%; border:none; outline:none; background:transparent;
          font-family:'DM Sans',sans-serif; font-size:16px; font-weight:500;
          color:#0f172a; caret-color:#6366f1; line-height:1;
        }
        .fat-input::placeholder { color:#c7d2fe; font-weight:400; }

        .fat-select {
          width:100%; border:none; outline:none; background:transparent;
          font-family:'DM Sans',sans-serif; font-size:16px; font-weight:500;
          color:#0f172a; cursor:pointer; appearance:none; -webkit-appearance:none;
        }
        .fat-select option { background:#fff; color:#0f172a; font-weight:400; }

        .input-pill {
          display:flex; align-items:center; gap:12px;
          background:#f8f9ff; border:2px solid #e0e7ff;
          border-radius:16px; padding:0 16px;
          height:58px;
          transition: border-color .2s, box-shadow .2s, background .2s, transform .15s;
          position:relative;
        }
        .input-pill.focused {
          border-color:#6366f1; background:#fff;
          box-shadow:0 0 0 5px rgba(99,102,241,.1);
          transform:translateY(-1px);
        }
        .input-pill.filled:not(.focused) { border-color:#a5b4fc; background:#fff; }
        .input-pill.errored { border-color:#fca5a5; background:#fff7f7; }
        .input-pill.errored.focused { border-color:#f43f5e; box-shadow:0 0 0 5px rgba(244,63,94,.08); }

        .field-icon { flex-shrink:0; display:flex; transition:color .2s; }

        .pw-toggle {
          flex-shrink:0; background:none; border:none; cursor:pointer;
          color:#a5b4fc; padding:4px; border-radius:8px; display:flex;
          transition:color .2s, background .2s;
        }
        .pw-toggle:hover { color:#6366f1; background:#ede9fe; }

        .role-card {
          flex:1; display:flex; flex-direction:column; align-items:center; gap:6px;
          padding:14px 10px; border-radius:16px; border:2px solid #e0e7ff;
          cursor:pointer; transition: border-color .2s, background .2s, transform .15s, box-shadow .2s;
          background:#f8f9ff; user-select:none;
        }
        .role-card:hover { border-color:#a5b4fc; background:#fff; transform:translateY(-1px); }
        .role-card.selected {
          border-color:#6366f1; background:#f5f3ff;
          box-shadow:0 0 0 4px rgba(99,102,241,.1);
          transform:translateY(-1px);
        }

        .cta-btn {
          width:100%; padding:0 24px; height:58px;
          border:none; border-radius:16px;
          font-family:'DM Sans',sans-serif; font-size:16px; font-weight:700;
          color:white; cursor:pointer; letter-spacing:.01em;
          background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);
          box-shadow:0 12px 32px rgba(99,102,241,.3);
          display:flex; align-items:center; justify-content:center; gap:10px;
          position:relative; overflow:hidden;
          transition:transform .2s, box-shadow .2s;
        }
        .cta-btn::after {
          content:''; position:absolute; inset:0;
          background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.18) 50%,transparent 60%);
          background-size:200% 100%; animation:shimmer 2.4s linear infinite;
        }
        .cta-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 20px 44px rgba(99,102,241,.4); }
        .cta-btn:active:not(:disabled) { transform:translateY(0); }
        .cta-btn:disabled { opacity:.7; cursor:not-allowed; }

        .typing-dot { display:inline-block; width:7px; height:7px; border-radius:50%; background:#a5b4fc; animation:dotBlink 1.2s infinite; }
        .typing-dot:nth-child(2) { animation-delay:.2s; }
        .typing-dot:nth-child(3) { animation-delay:.4s; }

        .progress-fill { transition: width .5s cubic-bezier(.22,1,.36,1), background .4s ease; }
      `}</style>

      {/* ── ambient blobs ── */}
      <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",overflow:"hidden"}}>
        <div className="blob" style={{position:"absolute",top:-80,left:-120,width:420,height:420,background:"rgba(165,180,252,.22)",filter:"blur(2px)"}} />
        <div className="blob" style={{position:"absolute",bottom:-60,right:-80,width:360,height:360,background:"rgba(196,181,253,.18)",filter:"blur(2px)",animationDelay:"-5s"}} />
        <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:.5}} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.2" fill="#818cf8" opacity=".35"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)"/>
        </svg>
      </div>

      {/* ── floating notification cards ── */}
      <div className="float-a" style={{position:"fixed",top:"12%",left:"5%",zIndex:0,pointerEvents:"none",display:"flex",alignItems:"center",gap:10,background:"white",borderRadius:16,padding:"12px 16px",boxShadow:"0 8px 32px rgba(99,102,241,.12)",border:"1.5px solid #e0e7ff",opacity:.85}}>
        <span style={{fontSize:20}}>🌍</span>
        <div>
          <p style={{fontSize:11,fontWeight:600,color:"#6366f1"}}>120+ Universities</p>
          <p style={{fontSize:10,color:"#94a3b8"}}>UK & Ireland</p>
        </div>
      </div>
      <div className="float-b" style={{position:"fixed",bottom:"18%",right:"6%",zIndex:0,pointerEvents:"none",display:"flex",alignItems:"center",gap:10,background:"white",borderRadius:16,padding:"12px 16px",boxShadow:"0 8px 32px rgba(139,92,246,.12)",border:"1.5px solid #ede9fe",opacity:.85}}>
        <span style={{fontSize:20}}>🎓</span>
        <div>
          <p style={{fontSize:11,fontWeight:600,color:"#7c3aed"}}>40,000+ Students</p>
          <p style={{fontSize:10,color:"#94a3b8"}}>Guided so far</p>
        </div>
      </div>
      <div className="float-a" style={{position:"fixed",top:"55%",left:"3%",zIndex:0,pointerEvents:"none",display:"flex",alignItems:"center",gap:8,background:"white",borderRadius:14,padding:"10px 14px",boxShadow:"0 6px 24px rgba(16,185,129,.1)",border:"1.5px solid #d1fae5",opacity:.8,animationDelay:"-2s"}}>
        <span style={{fontSize:18}}>✅</span>
        <p style={{fontSize:11,fontWeight:600,color:"#059669"}}>Free to Start</p>
      </div>

      {/* ── main card ── */}
      <div className="card-enter" style={{position:"relative",zIndex:1,width:"100%",maxWidth:480}}>

        {/* logo */}
        <div style={{textAlign:"center",marginBottom:24,animation:mounted?"fadeIn .4s ease both":"none",opacity:mounted?1:0}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:10,marginBottom:10}}>
            <div style={{width:42,height:42,borderRadius:13,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:19,fontWeight:800,color:"white",boxShadow:"0 8px 20px rgba(99,102,241,.3)"}}>F</div>
            <span style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:22,fontWeight:800,color:"#1e1b4b"}}>Fateh<span style={{color:"#6366f1"}}>AI</span></span>
          </div>
        </div>

        {/* card */}
        <div style={{background:"white",borderRadius:28,overflow:"hidden",boxShadow:"0 4px 6px rgba(0,0,0,.02),0 32px 72px rgba(99,102,241,.12),0 8px 24px rgba(0,0,0,.05)"}}>

          {/* top shimmer bar */}
          <div style={{height:5,background:"linear-gradient(90deg,#6366f1,#8b5cf6,#ec4899)",backgroundSize:"200% 100%",animation:"shimmer 3s linear infinite"}} />

          <div style={{padding:"32px 36px 32px"}}>

            {/* header */}
            <div className="fade-up" style={{marginBottom:24,animationDelay:".05s"}}>
              <h1 style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:28,fontWeight:800,color:"#1e1b4b",letterSpacing:"-.02em",lineHeight:1.2}}>
                {success ? "Account created! 🎉" : "Create account"}
              </h1>
              <p style={{marginTop:6,fontSize:14,color:"#64748b",lineHeight:1.6}}>
                {success ? "Redirecting you to sign in…" : "Start your study abroad journey for free"}
              </p>
            </div>

            {/* progress bar (only while filling form) */}
            {!success && progressCount > 0 && (
              <div className="fade-up" style={{marginBottom:22,animationDelay:".08s"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <span style={{fontSize:11,fontWeight:600,color:"#6366f1",textTransform:"uppercase",letterSpacing:".08em"}}>Profile completion</span>
                  <span style={{fontSize:11,fontWeight:700,color:"#6366f1"}}>{progressPct}%</span>
                </div>
                <div style={{height:4,borderRadius:99,background:"#e0e7ff",overflow:"hidden"}}>
                  <div className="progress-fill" style={{
                    height:"100%", borderRadius:99,
                    width:`${progressPct}%`,
                    background: progressPct < 50 ? "linear-gradient(90deg,#f59e0b,#fbbf24)"
                      : progressPct < 100 ? "linear-gradient(90deg,#6366f1,#8b5cf6)"
                      : "linear-gradient(90deg,#10b981,#34d399)",
                  }}/>
                </div>
              </div>
            )}

            {/* ── SUCCESS STATE ── */}
            {success ? (
              <div style={{textAlign:"center",padding:"12px 0 24px"}}>
                <div style={{width:72,height:72,borderRadius:"50%",background:"linear-gradient(135deg,#10b981,#059669)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",boxShadow:"0 12px 32px rgba(16,185,129,.25)",animation:"popIn .5s cubic-bezier(.34,1.56,.64,1) both"}}>
                  <svg viewBox="0 0 36 36" width="34" height="34" fill="none">
                    <polyline className="check-path" points="8,19 15,26 28,12" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div style={{display:"flex",justifyContent:"center",gap:5}}>
                  <span className="typing-dot"/><span className="typing-dot"/><span className="typing-dot"/>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>

                {/* error */}
                {error && (
                  <div className="shake-err fade-up" style={{display:"flex",alignItems:"flex-start",gap:10,background:"#fff1f2",border:"1.5px solid #fecdd3",borderRadius:14,padding:"13px 16px",marginBottom:20}}>
                    <svg viewBox="0 0 20 20" width="16" height="16" fill="#f43f5e" style={{flexShrink:0,marginTop:1}}>
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-4.75a.75.75 0 001.5 0v-4.5a.75.75 0 00-1.5 0v4.5zm.75-7a1 1 0 110 2 1 1 0 010-2z" clipRule="evenodd"/>
                    </svg>
                    <span style={{fontSize:13,fontWeight:500,color:"#be123c",lineHeight:1.5}}>{error}</span>
                  </div>
                )}

                {/* ── NAME ── */}
                <div className="fade-up" style={{marginBottom:14,animationDelay:".1s"}}>
                  <label style={{display:"block",fontSize:11,fontWeight:700,color:"#6366f1",marginBottom:8,textTransform:"uppercase",letterSpacing:".1em"}}>Full Name</label>
                  <div className={`input-pill ${focusedField==="name"?"focused":""} ${filledFields.has("name")?"filled":""} ${error&&!form.name?"errored":""}`}>
                    <span className="field-icon" style={{color:focusedField==="name"?"#6366f1":"#c7d2fe"}}>
                      <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                      </svg>
                    </span>
                    <input
                      ref={nameRef}
                      className="fat-input"
                      type="text"
                      name="name"
                      placeholder="Priya Sharma"
                      value={form.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => handleBlur("name")}
                      autoComplete="name"
                      disabled={loading}
                    />
                    {filledFields.has("name") && (
                      <span style={{color:"#10b981",display:"flex",animation:"popIn .3s cubic-bezier(.34,1.56,.64,1) both",flexShrink:0}}>
                        <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                      </span>
                    )}
                  </div>
                </div>

                {/* ── EMAIL ── */}
                <div className="fade-up" style={{marginBottom:14,animationDelay:".15s"}}>
                  <label style={{display:"block",fontSize:11,fontWeight:700,color:"#6366f1",marginBottom:8,textTransform:"uppercase",letterSpacing:".1em"}}>Email Address</label>
                  <div className={`input-pill ${focusedField==="email"?"focused":""} ${filledFields.has("email")?"filled":""} ${error&&!form.email?"errored":""}`}>
                    <span className="field-icon" style={{color:focusedField==="email"?"#6366f1":"#c7d2fe"}}>
                      <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                      </svg>
                    </span>
                    <input
                      className="fat-input"
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => handleBlur("email")}
                      autoComplete="email"
                      disabled={loading}
                    />
                    {filledFields.has("email") && (
                      <span style={{color:"#10b981",display:"flex",animation:"popIn .3s cubic-bezier(.34,1.56,.64,1) both",flexShrink:0}}>
                        <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                      </span>
                    )}
                  </div>
                </div>

                {/* ── PASSWORD ── */}
                <div className="fade-up" style={{marginBottom:14,animationDelay:".2s"}}>
                  <label style={{display:"block",fontSize:11,fontWeight:700,color:"#6366f1",marginBottom:8,textTransform:"uppercase",letterSpacing:".1em"}}>Password</label>
                  <div className={`input-pill ${focusedField==="password"?"focused":""} ${form.password?"filled":""} ${error&&!form.password?"errored":""}`}>
                    <span className="field-icon" style={{color:focusedField==="password"?"#6366f1":"#c7d2fe"}}>
                      <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                      </svg>
                    </span>
                    <input
                      className="fat-input"
                      type={showPwd ? "text" : "password"}
                      name="password"
                      placeholder="min. 8 characters"
                      value={form.password}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => handleBlur("password")}
                      autoComplete="new-password"
                      disabled={loading}
                    />
                    <button type="button" className="pw-toggle" onClick={() => setShowPwd(s => !s)} tabIndex={-1} aria-label="Toggle password visibility">
                      {showPwd
                        ? <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor"><path d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"/><path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"/></svg>
                        : <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/></svg>
                      }
                    </button>
                  </div>
                  {pwdStrength && (
                    <div style={{marginTop:8,animation:"fadeIn .3s ease"}}>
                      <div style={{height:3,borderRadius:99,background:"#e0e7ff",overflow:"hidden"}}>
                        <div style={{height:"100%",borderRadius:99,width:pwdStrength.w,background:pwdStrength.color,transition:"width .4s ease, background .4s ease"}}/>
                      </div>
                      <p style={{fontSize:11,color:pwdStrength.color,marginTop:5,fontWeight:600}}>{pwdStrength.label}</p>
                    </div>
                  )}
                </div>

                {/* ── ROLE PICKER ── */}
                <div className="fade-up" style={{marginBottom:6,animationDelay:".25s"}}>
                  <label style={{display:"block",fontSize:11,fontWeight:700,color:"#6366f1",marginBottom:10,textTransform:"uppercase",letterSpacing:".1em"}}>I am a</label>
                  <div style={{display:"flex",gap:12}}>
                    {[
                      { value:"student", emoji:"🎓", title:"Student", sub:"Applying to universities" },
                      { value:"admin",   emoji:"🛡️", title:"Admin",   sub:"Managing applications"  },
                    ].map(opt => (
                      <div
                        key={opt.value}
                        className={`role-card ${form.role === opt.value ? "selected" : ""}`}
                        onClick={() => setForm({ ...form, role: opt.value })}
                        role="button"
                        tabIndex={0}
                        onKeyDown={e => e.key==="Enter"&&setForm({...form,role:opt.value})}
                      >
                        <span style={{fontSize:22,lineHeight:1}}>{opt.emoji}</span>
                        <p style={{fontSize:13,fontWeight:700,color: form.role===opt.value ? "#4338ca" : "#1e1b4b",lineHeight:1.2}}>{opt.title}</p>
                        <p style={{fontSize:11,color: form.role===opt.value ? "#6366f1" : "#94a3b8",lineHeight:1.3,textAlign:"center"}}>{opt.sub}</p>
                        {form.role === opt.value && (
                          <div style={{position:"absolute",top:10,right:10,width:18,height:18,borderRadius:"50%",background:"#6366f1",display:"flex",alignItems:"center",justifyContent:"center",animation:"popIn .25s ease both"}}>
                            <svg viewBox="0 0 12 12" width="10" height="10" fill="none">
                              <polyline points="2,6 5,9 10,3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {/* hidden select keeps original functionality */}
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    style={{display:"none"}}
                    aria-hidden="true"
                  >
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {/* ── CTA ── */}
                <div className="fade-up" style={{marginTop:26,animationDelay:".3s"}}>
                  <button type="submit" disabled={loading} className="cta-btn">
                    <span style={{position:"relative",zIndex:1,display:"flex",alignItems:"center",gap:10}}>
                      {loading ? (
                        <>
                          <svg style={{animation:"spin .7s linear infinite",flexShrink:0}} viewBox="0 0 24 24" width="18" height="18" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,.3)" strokeWidth="3"/>
                            <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                          </svg>
                          Creating your account…
                        </>
                      ) : (
                        <>
                          Create my free account
                          <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor" style={{flexShrink:0}}>
                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                          </svg>
                        </>
                      )}
                    </span>
                  </button>
                </div>

                {/* divider */}
                <div style={{display:"flex",alignItems:"center",gap:12,margin:"20px 0 0"}}>
                  <div style={{flex:1,height:"1px",background:"#e0e7ff"}}/>
                  <span style={{fontSize:12,color:"#a5b4fc",fontWeight:500}}>Already have an account?</span>
                  <div style={{flex:1,height:"1px",background:"#e0e7ff"}}/>
                </div>
                <div style={{marginTop:14,textAlign:"center"}}>
                  <Link to="/login" style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:14,color:"#6366f1",fontWeight:700,textDecoration:"none",padding:"10px 20px",borderRadius:12,border:"2px solid #e0e7ff",background:"#f8f9ff",transition:"border-color .2s,background .2s"}}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor="#a5b4fc";e.currentTarget.style.background="#fff";}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor="#e0e7ff";e.currentTarget.style.background="#f8f9ff";}}>
                    <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
                      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
                    </svg>
                    Sign in instead
                  </Link>
                </div>

              </form>
            )}
          </div>
        </div>

        {/* trust pills */}
        <div style={{display:"flex",justifyContent:"center",flexWrap:"wrap",gap:10,marginTop:22,animation:mounted?"fadeIn .5s .35s ease both":"none",opacity:mounted?1:0}}>
          {[{e:"🏆",t:"99% Visa Success"},{e:"🎓",t:"40,000+ Students"},{e:"🌍",t:"120+ Universities"}].map(({e,t}) => (
            <div key={t} style={{display:"flex",alignItems:"center",gap:6,background:"white",borderRadius:99,padding:"7px 14px",border:"1.5px solid #e0e7ff",fontSize:12,fontWeight:500,color:"#4338ca",boxShadow:"0 2px 8px rgba(99,102,241,.06)"}}>
              <span style={{fontSize:13}}>{e}</span>{t}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}