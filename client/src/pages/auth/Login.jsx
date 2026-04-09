import { useState, useEffect, useRef } from "react";
import api from "../../services/api";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [step, setStep] = useState(0);
  const [emailFocus, setEmailFocus] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);
  const [mounted, setMounted] = useState(false);
  const emailRef = useRef(null);

  const { loginUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => { setMounted(true); emailRef.current?.focus(); }, 120);
    return () => clearTimeout(t);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) { setError("Both fields are required"); return; }
    try {
      setLoading(true);
      setStep(2);
      const res = await api.post("/auth/login", form);
      loginUser(res.data);
      setStep(3);
      setTimeout(() => {
        if (res.data.user.role === "student") navigate("/student/home");
        else navigate("/admin/dashboard");
      }, 800);
    } catch (err) {
      setStep(1);
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const pwdStrength = form.password.length === 0 ? null
    : form.password.length < 6 ? { w: "25%", color: "#f43f5e", label: "Weak" }
    : form.password.length < 10 ? { w: "60%", color: "#f59e0b", label: "Good" }
    : { w: "100%", color: "#10b981", label: "Strong" };

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

        {/* ── HOME BUTTON ── */}
<div
  style={{
    position: "fixed",
    top: "20px",
    right: "20px", // 👈 changed from left → right
    zIndex: 10,
    animation: mounted ? "fadeIn .5s ease" : "none"
  }}
>
  <Link
    to="/"
    style={{
      display: "flex",
      alignItems: "center",
      gap: "8px",
      background: "rgba(255,255,255,0.8)",
      backdropFilter: "blur(12px)",
      padding: "10px 16px",
      borderRadius: "999px",
      border: "1.5px solid #e0e7ff",
      fontSize: "13px",
      fontWeight: "600",
      color: "#4338ca",
      textDecoration: "none",
      boxShadow: "0 8px 24px rgba(99,102,241,0.12)",
      transition: "all .25s ease",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-2px) scale(1.03)";
      e.currentTarget.style.boxShadow = "0 12px 32px rgba(99,102,241,0.2)";
      e.currentTarget.style.background = "white";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0) scale(1)";
      e.currentTarget.style.boxShadow = "0 8px 24px rgba(99,102,241,0.12)";
      e.currentTarget.style.background = "rgba(255,255,255,0.8)";
    }}
  >
    <span style={{ display: "flex" }}>
      <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
        <path d="M10 2l8 7h-2v7h-4v-4H8v4H4V9H2l8-7z" />
      </svg>
    </span>

    Home
  </Link>
</div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes rise     { from { opacity:0; transform:translateY(28px) scale(.98); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes fadeUp   { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
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

        .card-enter    { animation: rise .6s cubic-bezier(.22,1,.36,1) both; }
        .fade-up       { animation: fadeUp .5s ease both; }
        .shake-err     { animation: shake .35s ease; }
        .check-path    { stroke-dasharray:32; stroke-dashoffset:32; animation: checkPop .45s .1s ease forwards; }
        .float-a       { animation: floatA 6s ease-in-out infinite; }
        .float-b       { animation: floatB 8s ease-in-out infinite; }
        .blob          { animation: waveBlob 10s ease-in-out infinite; }

        .fat-input {
          width:100%; border:none; outline:none; background:transparent;
          font-family:'DM Sans',sans-serif; font-size:16px; font-weight:500;
          color:#0f172a; caret-color:#6366f1; line-height:1;
        }
        .fat-input::placeholder { color:#c7d2fe; font-weight:400; }

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
          content:'';position:absolute;inset:0;
          background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.18) 50%,transparent 60%);
          background-size:200% 100%; animation:shimmer 2.4s linear infinite;
        }
        .cta-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 20px 44px rgba(99,102,241,.4); }
        .cta-btn:active:not(:disabled) { transform:translateY(0px); }
        .cta-btn:disabled { opacity:.7; cursor:not-allowed; }

        .typing-dot { display:inline-block; width:7px; height:7px; border-radius:50%; background:#a5b4fc; animation:dotBlink 1.2s infinite; }
        .typing-dot:nth-child(2) { animation-delay:.2s; }
        .typing-dot:nth-child(3) { animation-delay:.4s; }
      `}</style>

      {/* ── ambient blobs ── */}
      <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",overflow:"hidden"}}>
        <div className="blob" style={{position:"absolute",top:-80,left:-120,width:420,height:420,background:"rgba(165,180,252,.22)",filter:"blur(2px)"}} />
        <div className="blob" style={{position:"absolute",bottom:-60,right:-80,width:360,height:360,background:"rgba(196,181,253,.18)",filter:"blur(2px)",animationDelay:"-5s"}} />
        {/* dot-grid */}
        <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:.5}} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.2" fill="#818cf8" opacity=".35"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)"/>
        </svg>
      </div>

      {/* ── floating decorative cards ── */}
      <div className="float-a" style={{position:"fixed",top:"12%",left:"5%",zIndex:0,pointerEvents:"none",display:"flex",alignItems:"center",gap:10,background:"white",borderRadius:16,padding:"12px 16px",boxShadow:"0 8px 32px rgba(99,102,241,.12)",border:"1.5px solid #e0e7ff",opacity:.85}}>
        <span style={{fontSize:20}}>🏆</span>
        <div>
          <p style={{fontSize:11,fontWeight:600,color:"#6366f1"}}>Visa Granted</p>
          <p style={{fontSize:10,color:"#94a3b8"}}>Ireland · 2 days ago</p>
        </div>
      </div>
      <div className="float-b" style={{position:"fixed",bottom:"18%",right:"6%",zIndex:0,pointerEvents:"none",display:"flex",alignItems:"center",gap:10,background:"white",borderRadius:16,padding:"12px 16px",boxShadow:"0 8px 32px rgba(139,92,246,.12)",border:"1.5px solid #ede9fe",opacity:.85}}>
        <span style={{fontSize:20}}>🎓</span>
        <div>
          <p style={{fontSize:11,fontWeight:600,color:"#7c3aed"}}>Offer Received</p>
          <p style={{fontSize:10,color:"#94a3b8"}}>Trinity College Dublin</p>
        </div>
      </div>
      <div className="float-a" style={{position:"fixed",top:"55%",left:"3%",zIndex:0,pointerEvents:"none",display:"flex",alignItems:"center",gap:8,background:"white",borderRadius:14,padding:"10px 14px",boxShadow:"0 6px 24px rgba(16,185,129,.1)",border:"1.5px solid #d1fae5",opacity:.8,animationDelay:"-2s"}}>
        <span style={{fontSize:18}}>✅</span>
        <p style={{fontSize:11,fontWeight:600,color:"#059669"}}>SOP Approved</p>
      </div>

      {/* ── main card ── */}
      <div className="card-enter" style={{position:"relative",zIndex:1,width:"100%",maxWidth:460}}>

        {/* logo */}
        <div style={{textAlign:"center",marginBottom:28,animation:mounted?"fadeIn .4s ease both":"none",opacity:mounted?1:0}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:10,marginBottom:12}}>
            <div style={{width:42,height:42,borderRadius:13,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:19,fontWeight:800,color:"white",boxShadow:"0 8px 20px rgba(99,102,241,.3)"}}>F</div>
            <span style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:22,fontWeight:800,color:"#1e1b4b"}}>
              Fateh<span style={{color:"#6366f1"}}>AI</span>
            </span>
          </div>
        </div>

        {/* card body */}
        <div style={{background:"white",borderRadius:28,overflow:"hidden",boxShadow:"0 4px 6px rgba(0,0,0,.02),0 32px 72px rgba(99,102,241,.12),0 8px 24px rgba(0,0,0,.05)"}}>

          {/* colored top bar */}
          <div style={{height:5,background:"linear-gradient(90deg,#6366f1,#8b5cf6,#ec4899)",backgroundSize:"200% 100%",animation:"shimmer 3s linear infinite"}} />

          <div style={{padding:"36px 36px 32px"}}>

            {/* heading */}
            <div className="fade-up" style={{marginBottom:32,animationDelay:".05s"}}>
              <h1 style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:28,fontWeight:800,color:"#1e1b4b",letterSpacing:"-.02em",lineHeight:1.2}}>
                {step === 3 ? "You're in! 🎉" : "Sign in"}
              </h1>
              <p style={{marginTop:6,fontSize:14,color:"#64748b",lineHeight:1.6}}>
                {step === 3 ? "Taking you to your dashboard…" : "Continue your study abroad journey"}
              </p>
            </div>

            {/* ── SUCCESS STATE ── */}
            {step === 3 ? (
              <div style={{textAlign:"center",padding:"8px 0 24px"}}>
                <div style={{width:72,height:72,borderRadius:"50%",background:"linear-gradient(135deg,#10b981,#059669)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",boxShadow:"0 12px 32px rgba(16,185,129,.25)",animation:"popIn .5s cubic-bezier(.34,1.56,.64,1) both"}}>
                  <svg viewBox="0 0 36 36" width="34" height="34" fill="none">
                    <polyline className="check-path" points="8,19 15,26 28,12" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div style={{display:"flex",justifyContent:"center",gap:5}}>
                  <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
                </div>
              </div>
            ) : (

              <form onSubmit={handleSubmit} noValidate>

                {/* error */}
                {error && (
                  <div className="shake-err fade-up" style={{display:"flex",alignItems:"flex-start",gap:10,background:"#fff1f2",border:"1.5px solid #fecdd3",borderRadius:14,padding:"13px 16px",marginBottom:22}}>
                    <svg viewBox="0 0 20 20" width="16" height="16" fill="#f43f5e" style={{flexShrink:0,marginTop:1}}>
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-4.75a.75.75 0 001.5 0v-4.5a.75.75 0 00-1.5 0v4.5zm.75-7a1 1 0 110 2 1 1 0 010-2z" clipRule="evenodd"/>
                    </svg>
                    <span style={{fontSize:13,fontWeight:500,color:"#be123c",lineHeight:1.5}}>{error}</span>
                  </div>
                )}

                {/* ── EMAIL ── */}
                <div className="fade-up" style={{marginBottom:16,animationDelay:".1s"}}>
                  <label style={{display:"block",fontSize:11,fontWeight:700,color:"#6366f1",marginBottom:8,textTransform:"uppercase",letterSpacing:".1em"}}>Email</label>
                  <div className={`input-pill ${emailFocus?"focused":""} ${form.email&&step>=1?"filled":""} ${error&&!form.email?"errored":""}`}>
                    <span className="field-icon" style={{color:emailFocus?"#6366f1":"#c7d2fe"}}>
                      <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                      </svg>
                    </span>
                    <input
                      ref={emailRef}
                      className="fat-input"
                      type="email"
                      name="email"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={handleChange}
                      onFocus={() => setEmailFocus(true)}
                      onBlur={() => { setEmailFocus(false); if (form.email) setStep(s => Math.max(s,1)); }}
                      autoComplete="email"
                      disabled={loading}
                    />
                    {form.email && step >= 1 && (
                      <span style={{color:"#10b981",display:"flex",animation:"popIn .3s cubic-bezier(.34,1.56,.64,1) both"}}>
                        <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                      </span>
                    )}
                  </div>
                </div>

                {/* ── PASSWORD ── */}
                <div className="fade-up" style={{marginBottom:6,animationDelay:".16s"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <label style={{fontSize:11,fontWeight:700,color:"#6366f1",textTransform:"uppercase",letterSpacing:".1em"}}>Password</label>
                  </div>
                  <div className={`input-pill ${pwdFocus?"focused":""} ${form.password?"filled":""} ${error&&!form.password?"errored":""}`}>
                    <span className="field-icon" style={{color:pwdFocus?"#6366f1":"#c7d2fe"}}>
                      <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                      </svg>
                    </span>
                    <input
                      className="fat-input"
                      type={showPwd ? "text" : "password"}
                      name="password"
                      placeholder="your password"
                      value={form.password}
                      onChange={handleChange}
                      onFocus={() => setPwdFocus(true)}
                      onBlur={() => setPwdFocus(false)}
                      autoComplete="current-password"
                      disabled={loading}
                    />
                    <button type="button" className="pw-toggle" onClick={() => setShowPwd(s => !s)} tabIndex={-1} aria-label="Toggle">
                      {showPwd
                        ? <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor"><path d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"/><path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"/></svg>
                        : <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/></svg>
                      }
                    </button>
                  </div>

                  {/* strength bar */}
                  {pwdStrength && (
                    <div style={{marginTop:8,animation:"fadeIn .3s ease"}}>
                      <div style={{height:3,borderRadius:99,background:"#e0e7ff",overflow:"hidden"}}>
                        <div style={{height:"100%",borderRadius:99,width:pwdStrength.w,background:pwdStrength.color,transition:"width .4s ease,background .4s ease"}}/>
                      </div>
                      <p style={{fontSize:11,color:pwdStrength.color,marginTop:5,fontWeight:600}}>{pwdStrength.label}</p>
                    </div>
                  )}
                </div>

                {/* ── CTA ── */}
                <div className="fade-up" style={{marginTop:28,animationDelay:".22s"}}>
                  <button type="submit" disabled={loading} className="cta-btn">
                    <span style={{position:"relative",zIndex:1,display:"flex",alignItems:"center",gap:10}}>
                      {loading ? (
                        <>
                          <svg style={{animation:"spin .7s linear infinite",flexShrink:0}} viewBox="0 0 24 24" width="18" height="18" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,.3)" strokeWidth="3"/>
                            <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                          </svg>
                          Signing you in…
                        </>
                      ) : (
                        <>
                          Sign in to FatehAI
                          <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor" style={{flexShrink:0}}>
                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                          </svg>
                        </>
                      )}
                    </span>
                  </button>
                </div>

                {/* divider */}
                <div style={{display:"flex",alignItems:"center",gap:12,margin:"22px 0"}}>
                  <div style={{flex:1,height:"1px",background:"#e0e7ff"}}/>
                  <span style={{fontSize:12,color:"#a5b4fc",fontWeight:500}}>or</span>
                  <div style={{flex:1,height:"1px",background:"#e0e7ff"}}/>
                </div>

                {/* register */}
                <p style={{textAlign:"center",fontSize:14,color:"#64748b"}}>
                  Don't have an account?{" "}
                  <Link to="/register" style={{color:"#6366f1",fontWeight:700,textDecoration:"none"}}
                    onMouseEnter={e=>e.target.style.textDecoration="underline"}
                    onMouseLeave={e=>e.target.style.textDecoration="none"}>
                    Create one free →
                  </Link>
                </p>

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