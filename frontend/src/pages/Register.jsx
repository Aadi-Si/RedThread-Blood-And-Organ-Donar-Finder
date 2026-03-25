import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "donor",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API}/auth/register`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(formData),
});
      const data = await response.json();
      if (!response.ok) {
        setError(data.error);
        return;
      }
      navigate("/login");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isDonor = formData.role === "donor";

  return (
    <div
      style={{
        minHeight: "100svh",
        display: "flex",
        fontFamily: "'Inter', sans-serif",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }

        .reg-left {
          flex: 1;
          background: linear-gradient(135deg, #7F1D1D 0%, #B91C1C 50%, #DC2626 100%);
          display: flex; flex-direction: column; justify-content: center; align-items: center;
          padding: clamp(40px, 6vw, 80px);
          position: relative; overflow: hidden;
        }
        .reg-left-pattern { position:absolute;inset:0;background-image:radial-gradient(circle,rgba(255,255,255,0.06) 1px,transparent 1px);background-size:28px 28px;pointer-events:none; }
        .reg-left-glow { position:absolute;width:400px;height:400px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,0.08) 0%,transparent 70%);top:-100px;right:-100px;pointer-events:none; }
        .reg-left-glow2 { position:absolute;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,0.05) 0%,transparent 70%);bottom:-80px;left:-60px;pointer-events:none; }

        .left-content { position:relative;z-index:1;max-width:400px;text-align:center;animation:fadeUp 0.8s ease forwards; }
        .left-logo { font-size:clamp(28px,4vw,40px);font-weight:900;color:white;letter-spacing:-1px;margin-bottom:clamp(20px,3vh,32px); }
        .left-title { font-size:clamp(22px,3vw,34px);font-weight:800;color:white;letter-spacing:-1px;line-height:1.15;margin-bottom:14px; }
        .left-sub { font-size:clamp(13px,1.4vw,15px);color:rgba(255,255,255,0.7);line-height:1.7;margin-bottom:clamp(28px,4vh,44px); }

        .role-preview { width:100%;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);border-radius:20px;padding:clamp(20px,3vw,28px);text-align:left;transition:all 0.4s ease; }
        .role-preview-label { font-size:11px;font-weight:700;color:rgba(255,255,255,0.5);letter-spacing:2px;text-transform:uppercase;margin-bottom:16px; }
        .role-preview-title { font-size:clamp(18px,2.5vw,24px);font-weight:800;color:white;margin-bottom:12px; }
        .role-feature { display:flex;align-items:center;gap:10px;margin-bottom:10px;font-size:clamp(12px,1.3vw,14px);color:rgba(255,255,255,0.8); }
        .role-feature:last-child { margin-bottom:0; }
        .role-feat-icon { font-size:16px;flex-shrink:0; }

        .reg-right {
          width:clamp(340px,48vw,580px);
          background:#fafafa;
          display:flex;align-items:center;justify-content:center;
          padding:clamp(24px,4vw,48px);
          overflow-y:auto;
        }
        .reg-form-wrap { width:100%;max-width:440px;animation:fadeUp 0.7s ease 0.2s both; }

        .form-header { margin-bottom:clamp(20px,3vh,28px); }
        .form-title { font-size:clamp(20px,2.8vw,26px);font-weight:800;color:#111;letter-spacing:-0.8px;margin-bottom:6px; }
        .form-sub { font-size:clamp(12px,1.3vw,13px);color:#888; }
        .form-sub a { color:#B91C1C;font-weight:600;text-decoration:none; }
        .form-sub a:hover { text-decoration:underline; }

        .role-toggle { display:flex;background:white;border:1.5px solid #e5e7eb;border-radius:14px;padding:4px;margin-bottom:clamp(16px,3vh,22px);gap:4px; }
        .role-btn { flex:1;padding:clamp(9px,1.5vh,12px) 16px;border-radius:10px;border:none;font-size:clamp(12px,1.4vw,14px);font-weight:600;cursor:pointer;font-family:inherit;transition:all 0.25s;display:flex;align-items:center;justify-content:center;gap:7px; }
        .role-btn.active { background:#B91C1C;color:white;box-shadow:0 4px 12px rgba(185,28,28,0.3); }
        .role-btn.inactive { background:transparent;color:#888; }
        .role-btn.inactive:hover { background:#f3f4f6;color:#555; }

        .error-box { background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:11px 14px;font-size:13px;color:#B91C1C;font-weight:500;margin-bottom:18px;display:flex;align-items:center;gap:8px;animation:shake 0.4s ease; }
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-5px)} 40%{transform:translateX(5px)} 60%{transform:translateX(-3px)} 80%{transform:translateX(3px)} }

        .form-row { display:grid;grid-template-columns:1fr 1fr;gap:clamp(10px,1.5vw,14px);margin-bottom:clamp(12px,2vh,16px); }
        .form-group { margin-bottom:clamp(12px,2vh,16px); }
        .form-group.no-mb { margin-bottom:0; }
        .form-label { display:block;font-size:clamp(11px,1.2vw,12px);font-weight:700;color:#374151;margin-bottom:5px;letter-spacing:0.3px;text-transform:uppercase; }
        .input-wrap { position:relative; }
        .form-input { width:100%;background:white;border:1.5px solid #e5e7eb;border-radius:11px;padding:clamp(10px,1.6vh,12px) clamp(12px,1.8vw,15px);font-size:clamp(13px,1.4vw,14px);color:#111;font-family:inherit;transition:all 0.2s;outline:none; }
        .form-input:focus { border-color:#B91C1C;box-shadow:0 0 0 3px rgba(185,28,28,0.08); }
        .form-input::placeholder { color:#9ca3af; }
        .input-eye { position:absolute;right:12px;top:50%;transform:translateY(-50%);cursor:pointer;color:#9ca3af;font-size:15px;background:none;border:none;padding:2px;transition:color 0.2s; }
        .input-eye:hover { color:#B91C1C; }

        .btn-register { width:100%;background:#B91C1C;color:white;border:none;padding:clamp(12px,2vh,15px);border-radius:12px;font-size:clamp(14px,1.6vw,15px);font-weight:700;cursor:pointer;font-family:inherit;transition:all 0.3s;display:flex;align-items:center;justify-content:center;gap:8px;margin-top:clamp(4px,1vh,8px);box-shadow:0 4px 20px rgba(185,28,28,0.3); }
        .btn-register:hover:not(:disabled) { background:#991B1B;transform:translateY(-2px);box-shadow:0 8px 30px rgba(185,28,28,0.4); }
        .btn-register:disabled { opacity:0.7;cursor:not-allowed; }
        .spinner { width:15px;height:15px;border:2px solid rgba(255,255,255,0.3);border-top-color:white;border-radius:50%;animation:spin 0.7s linear infinite;flex-shrink:0; }
        @keyframes spin { to{transform:rotate(360deg)} }

        .login-link { text-align:center;margin-top:clamp(14px,2.5vh,20px);font-size:clamp(12px,1.3vw,13px);color:#888; }
        .login-link a { color:#B91C1C;font-weight:700;text-decoration:none; }
        .login-link a:hover { text-decoration:underline; }

        .terms { font-size:clamp(10px,1.1vw,11px);color:#aaa;text-align:center;margin-top:clamp(10px,1.5vh,14px);line-height:1.5; }
        .terms a { color:#B91C1C;text-decoration:none; }

        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

        @media (max-width:768px) {
          .reg-left { display:none; }
          .reg-right { width:100%;min-height:100svh;padding:clamp(24px,6vw,40px) clamp(20px,6vw,32px);background:white; }
          .reg-form-wrap { max-width:100%; }
          .form-row { grid-template-columns:1fr; }
        }
        @media (max-width:1024px) and (min-width:769px) {
          .reg-left { padding:40px; }
          .left-sub { display:none; }
          .reg-right { width:52%; }
        }
        @media (max-width:400px) {
          .role-btn { font-size:12px;padding:9px 10px; }
        }
      `}</style>

      {/* Left Panel */}
      <div className="reg-left">
        <div className="reg-left-pattern" />
        <div className="reg-left-glow" />
        <div className="reg-left-glow2" />
        <div className="left-content">
          <div className="left-logo">RedThread</div>
          <h2 className="left-title">
            {isDonor
              ? "Become a lifesaver today."
              : "Connect with donors instantly."}
          </h2>
          <p className="left-sub">
            {isDonor
              ? "Register as a donor and get notified when nearby hospitals need your blood type urgently."
              : "Register your hospital and find matching blood donors within minutes of posting a request."}
          </p>
          <div className="role-preview">
            <div className="role-preview-label">
              {isDonor ? "Donor Benefits" : "Hospital Benefits"}
            </div>
            <div className="role-preview-title">
              {isDonor ? "For Donors 🙋" : "For Hospitals 🏥"}
            </div>
            {isDonor ? (
              <>
                <div className="role-feature">
                  <span className="role-feat-icon">🔔</span>Get notified
                  instantly when nearby hospitals need you
                </div>
                <div className="role-feature">
                  <span className="role-feat-icon">📍</span>Set your location
                  and blood type once
                </div>
                <div className="role-feature">
                  <span className="role-feat-icon">✅</span>Accept or decline
                  requests from your dashboard
                </div>
                <div className="role-feature">
                  <span className="role-feat-icon">📊</span>Track your full
                  donation history
                </div>
              </>
            ) : (
              <>
                <div className="role-feature">
                  <span className="role-feat-icon">⚡</span>Post urgent requests
                  in under 30 seconds
                </div>
                <div className="role-feature">
                  <span className="role-feat-icon">📍</span>Auto-match donors
                  within 10km radius
                </div>
                <div className="role-feature">
                  <span className="role-feat-icon">📧</span>Donors notified via
                  email instantly
                </div>
                <div className="role-feature">
                  <span className="role-feat-icon">🗂️</span>Manage all requests
                  from one dashboard
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="reg-right">
        <div className="reg-form-wrap">
          <div className="form-header">
            <div className="form-title">Create your account</div>
          </div>

          {/* Role Toggle */}
          <div className="role-toggle">
            <button
              type="button"
              className={`role-btn ${formData.role === "donor" ? "active" : "inactive"}`}
              onClick={() => setFormData({ ...formData, role: "donor" })}
            >
              I'm a Donor
            </button>
            <button
              type="button"
              className={`role-btn ${formData.role === "hospital" ? "active" : "inactive"}`}
              onClick={() => setFormData({ ...formData, role: "hospital" })}
            >
              I'm a Hospital
            </button>
          </div>

          {error && (
            <div className="error-box">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleRegister}>
            {/* Name + Phone row */}
            <div className="form-row">
              <div className="form-group no-mb">
                <label className="form-label">
                  {isDonor ? "Full Name" : "Hospital Name"}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder={isDonor ? "John Doe" : "Apollo Hospital"}
                />
              </div>
              <div className="form-group no-mb">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="9999999999"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="you@example.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Min. 6 characters"
                  style={{ paddingRight: 40 }}
                />
                <button
                  type="button"
                  className="input-eye"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    // Eye OFF (hidden password)
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19C7 19 2.73 15.11 1 12c.73-1.28 1.67-2.42 2.77-3.36M9.88 9.88A3 3 0 0 0 12 15a3 3 0 0 0 2.12-.88M1 1l22 22" />
                    </svg>
                  ) : (
                    // Eye ON (show password)
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-register" disabled={loading}>
              {loading ? (
                <>
                  <div className="spinner" /> Creating account...
                </>
              ) : (
                `→ Create ${isDonor ? "Donor" : "Hospital"} Account`
              )}
            </button>
          </form>

          <div className="login-link">
            Already registered? <Link to="/login">Login →</Link>
          </div>

          <div className="terms">
            By registering, you agree to our <a href="#">Terms of Service</a>{" "}
            and <a href="#">Privacy Policy</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
