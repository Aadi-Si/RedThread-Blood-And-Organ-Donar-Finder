import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../config/supabase'

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await response.json()
      if (!response.ok) { setError(data.error); return }
      const token = data.session.access_token
      localStorage.setItem('token', token)
      const profileResponse = await fetch('http://localhost:3000/auth/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const profileData = await profileResponse.json()
      localStorage.setItem('role', profileData.user.role)
      if (profileData.user.role === 'donor') navigate('/donor/dashboard')
      else navigate('/hospital/dashboard')
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: 'http://localhost:5173/auth/callback' }
    })
  }

  return (
    <div style={{ minHeight: '100svh', display: 'flex', fontFamily: "'Inter', sans-serif", overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }

        .login-left {
          flex: 1;
          background: linear-gradient(135deg, #7F1D1D 0%, #B91C1C 50%, #DC2626 100%);
          display: flex; flex-direction: column; justify-content: center; align-items: center;
          padding: clamp(40px, 6vw, 80px);
          position: relative; overflow: hidden;
        }
        .login-left-pattern {
          position: absolute; inset: 0;
          background-image: radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size: 28px 28px; pointer-events: none;
        }
        .login-left-glow {
          position: absolute; width: 400px; height: 400px; border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%);
          top: -100px; right: -100px; pointer-events: none;
        }
        .login-left-glow-2 {
          position: absolute; width: 300px; height: 300px; border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%);
          bottom: -80px; left: -60px; pointer-events: none;
        }
        .left-content { position: relative; z-index: 1; max-width: 400px; text-align: center; animation: fadeUp 0.8s ease forwards; }
        .left-logo { font-size: clamp(28px, 4vw, 40px); font-weight: 900; color: white; letter-spacing: -1px; margin-bottom: clamp(24px, 4vh, 40px); }
        .left-title { font-size: clamp(24px, 3.5vw, 36px); font-weight: 800; color: white; letter-spacing: -1px; line-height: 1.15; margin-bottom: 16px; }
        .left-sub { font-size: clamp(13px, 1.5vw, 15px); color: rgba(255,255,255,0.7); line-height: 1.7; margin-bottom: clamp(32px, 5vh, 48px); }
        .left-cards { display: flex; flex-direction: column; gap: 12px; width: 100%; }
        .left-card { background: rgba(255,255,255,0.1); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.15); border-radius: 14px; padding: clamp(14px, 2vw, 18px) clamp(16px, 2.5vw, 22px); display: flex; align-items: center; gap: 14px; animation: slideInLeft 0.6s ease both; }
        .left-card:nth-child(1) { animation-delay: 0.3s; }
        .left-card:nth-child(2) { animation-delay: 0.5s; }
        .left-card:nth-child(3) { animation-delay: 0.7s; }
        .card-icon { font-size: clamp(20px, 2.5vw, 24px); flex-shrink: 0; }
        .card-text { text-align: left; }
        .card-title { font-size: clamp(12px, 1.4vw, 14px); font-weight: 700; color: white; margin-bottom: 2px; }
        .card-desc { font-size: clamp(11px, 1.2vw, 12px); color: rgba(255,255,255,0.6); }

        .login-right {
          width: clamp(320px, 45vw, 560px);
          background: #fafafa;
          display: flex; align-items: center; justify-content: center;
          padding: clamp(24px, 4vw, 48px);
          overflow-y: auto;
        }
        .login-form-wrap { width: 100%; max-width: 420px; animation: fadeUp 0.7s ease 0.2s both; }
        .form-header { margin-bottom: clamp(24px, 4vh, 36px); }
        .form-title { font-size: clamp(22px, 3vw, 28px); font-weight: 800; color: #111; letter-spacing: -0.8px; margin-bottom: 6px; }
        .form-sub { font-size: clamp(13px, 1.4vw, 14px); color: #888; }
        .form-sub a { color: #B91C1C; font-weight: 600; text-decoration: none; }
        .form-sub a:hover { text-decoration: underline; }

        .error-box { background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; padding: 12px 16px; font-size: 13px; color: #B91C1C; font-weight: 500; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; animation: shake 0.4s ease; }
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }

        .form-group { margin-bottom: clamp(14px, 2.5vh, 20px); }
        .form-label { display: block; font-size: clamp(12px, 1.3vw, 13px); font-weight: 600; color: #374151; margin-bottom: 6px; letter-spacing: 0.2px; }
        .input-wrap { position: relative; }
        .form-input { width: 100%; background: white; border: 1.5px solid #e5e7eb; border-radius: 12px; padding: clamp(10px, 1.8vh, 13px) clamp(14px, 2vw, 16px); font-size: clamp(13px, 1.4vw, 15px); color: #111; font-family: inherit; transition: all 0.2s; outline: none; }
        .form-input:focus { border-color: #B91C1C; box-shadow: 0 0 0 3px rgba(185,28,28,0.08); }
        .form-input::placeholder { color: #9ca3af; }
        .input-icon { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); cursor: pointer; color: #9ca3af; font-size: 16px; transition: color 0.2s; background: none; border: none; padding: 0; }
        .input-icon:hover { color: #B91C1C; }

        .btn-login { width: 100%; background: #B91C1C; color: white; border: none; padding: clamp(12px, 2vh, 15px); border-radius: 12px; font-size: clamp(14px, 1.6vw, 15px); font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.3s; position: relative; overflow: hidden; margin-top: clamp(4px, 1vh, 8px); box-shadow: 0 4px 20px rgba(185,28,28,0.3); }
        .btn-login:hover:not(:disabled) { background: #991B1B; transform: translateY(-2px); box-shadow: 0 8px 30px rgba(185,28,28,0.4); }
        .btn-login:active:not(:disabled) { transform: translateY(0); }
        .btn-login:disabled { opacity: 0.7; cursor: not-allowed; }
        .btn-login-inner { display: flex; align-items: center; justify-content: center; gap: 8px; }
        .spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .divider { display: flex; align-items: center; gap: 12px; margin: clamp(16px, 3vh, 24px) 0; }
        .divider-line { flex: 1; height: 1px; background: #e5e7eb; }
        .divider-text { font-size: 12px; color: #9ca3af; font-weight: 500; white-space: nowrap; }

        .btn-google { width: 100%; background: white; border: 1.5px solid #e5e7eb; color: #374151; padding: clamp(11px, 1.8vh, 14px); border-radius: 12px; font-size: clamp(13px, 1.5vw, 14px); font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 10px; }
        .btn-google:hover { border-color: #d1d5db; background: #f9fafb; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .google-icon { width: 18px; height: 18px; flex-shrink: 0; }

        .register-link { text-align: center; margin-top: clamp(16px, 3vh, 24px); font-size: clamp(12px, 1.4vw, 13px); color: #888; }
        .register-link a { color: #B91C1C; font-weight: 700; text-decoration: none; }
        .register-link a:hover { text-decoration: underline; }

        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideInLeft { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }

        /* Responsive */
        @media (max-width: 768px) {
          .login-left { display: none; }
          .login-right { width: 100%; min-height: 100svh; padding: clamp(24px, 6vw, 40px) clamp(20px, 6vw, 32px); background: white; }
          .login-form-wrap { max-width: 100%; }
        }
        @media (max-width: 1024px) and (min-width: 769px) {
          .login-left { padding: 40px; }
          .left-cards { display: none; }
          .login-right { width: 50%; }
        }
      `}</style>

      {/* Left panel */}
      <div className="login-left">
        <div className="login-left-pattern" />
        <div className="login-left-glow" />
        <div className="login-left-glow-2" />
        <div className="left-content">
          <div className="left-logo">RedThread 🩸</div>
          <h2 className="left-title">Every second saves a life.</h2>
          <p className="left-sub">Join thousands of donors and hospitals using RedThread to connect in real time — based on blood type, location, and urgency.</p>
          <div className="left-cards">
            <div className="left-card">
              <span className="card-icon">⚡</span>
              <div className="card-text">
                <div className="card-title">Real-Time Matching</div>
                <div className="card-desc">Donors matched within seconds</div>
              </div>
            </div>
            <div className="left-card">
              <span className="card-icon">📍</span>
              <div className="card-text">
                <div className="card-title">Hyperlocal Search</div>
                <div className="card-desc">Find donors within 10km radius</div>
              </div>
            </div>
            <div className="left-card">
              <span className="card-icon">🔔</span>
              <div className="card-text">
                <div className="card-title">Instant Alerts</div>
                <div className="card-desc">Email notifications sent instantly</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="login-right">
        <div className="login-form-wrap">
          <div className="form-header">
            <div style={{ fontSize: 28, marginBottom: 12 }}>👋</div>
            <div className="form-title">Welcome back</div>
          </div>

          {error && (
            <div className="error-box">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email address</label>
              <div className="input-wrap">
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
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="••••••••"
                  style={{ paddingRight: 44 }}
                />
                <button type="button" className="input-icon" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-login" disabled={loading}>
              <div className="btn-login-inner">
                {loading ? <><div className="spinner" /> Logging in...</> : '→ Login to RedThread'}
              </div>
            </button>
          </form>

          <div className="divider">
            <div className="divider-line" />
            <span className="divider-text">or continue with</span>
            <div className="divider-line" />
          </div>

          <button className="btn-google" onClick={handleGoogleLogin}>
            <svg className="google-icon" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="register-link">
            New to RedThread? <Link to="/register">Create an account →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
