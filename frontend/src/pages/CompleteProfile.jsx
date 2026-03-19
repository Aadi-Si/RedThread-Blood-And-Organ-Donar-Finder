import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const CompleteProfile = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ name: '', phone: '', role: 'donor' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const token = localStorage.getItem('token')

  useEffect(() => { if (!token) navigate('/login') }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await fetch('http://localhost:3000/auth/complete-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      })
      const data = await response.json()
      if (!response.ok) { setError(data.error); return }
      localStorage.setItem('role', formData.role)
      if (formData.role === 'donor') navigate('/donor/dashboard')
      else navigate('/hospital/dashboard')
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const isDonor = formData.role === 'donor'

  return (
    <div style={{ minHeight: '100svh', display: 'flex', fontFamily: "'Inter', sans-serif", overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideInLeft { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-5px)} 40%{transform:translateX(5px)} 60%{transform:translateX(-3px)} 80%{transform:translateX(3px)} }
        @keyframes spin { to{transform:rotate(360deg)} }

        .cp-left {
          flex:1; background:linear-gradient(135deg,#7F1D1D 0%,#B91C1C 50%,#DC2626 100%);
          display:flex; flex-direction:column; justify-content:center; align-items:center;
          padding:clamp(40px,6vw,80px); position:relative; overflow:hidden;
        }
        .cp-left-pattern { position:absolute;inset:0;background-image:radial-gradient(circle,rgba(255,255,255,0.06) 1px,transparent 1px);background-size:28px 28px;pointer-events:none; }
        .cp-left-glow { position:absolute;width:400px;height:400px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,0.08) 0%,transparent 70%);top:-100px;right:-100px;pointer-events:none; }
        .cp-left-glow2 { position:absolute;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,0.05) 0%,transparent 70%);bottom:-80px;left:-60px;pointer-events:none; }
        .left-content { position:relative;z-index:1;max-width:400px;text-align:center;animation:fadeUp 0.8s ease forwards; }
        .left-logo { font-size:clamp(28px,4vw,40px);font-weight:900;color:white;letter-spacing:-1px;margin-bottom:clamp(20px,3vh,32px); }
        .left-step-label { font-size:11px;font-weight:700;color:rgba(255,255,255,0.5);letter-spacing:3px;text-transform:uppercase;margin-bottom:12px; }
        .left-title { font-size:clamp(22px,3vw,34px);font-weight:800;color:white;letter-spacing:-1px;line-height:1.15;margin-bottom:14px; }
        .left-sub { font-size:clamp(13px,1.4vw,15px);color:rgba(255,255,255,0.7);line-height:1.7;margin-bottom:clamp(28px,4vh,44px); }

        .steps-track { display:flex;flex-direction:column;gap:16px;width:100%; }
        .track-step { display:flex;align-items:center;gap:14px;padding:14px 18px;border-radius:14px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);transition:all 0.3s; }
        .track-step.done { background:rgba(255,255,255,0.15);border-color:rgba(255,255,255,0.25); }
        .track-num { width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,0.15);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;color:white;flex-shrink:0; }
        .track-num.done { background:rgba(255,255,255,0.9);color:#B91C1C; }
        .track-text { text-align:left; }
        .track-title { font-size:clamp(12px,1.4vw,14px);font-weight:700;color:white; }
        .track-sub { font-size:clamp(10px,1.1vw,12px);color:rgba(255,255,255,0.55);margin-top:2px; }

        .cp-right {
          width:clamp(320px,45vw,540px); background:#fafafa;
          display:flex;align-items:center;justify-content:center;
          padding:clamp(24px,4vw,48px); overflow-y:auto;
        }
        .form-wrap { width:100%;max-width:420px;animation:fadeUp 0.7s ease 0.2s both; }
        .form-header { margin-bottom:clamp(20px,3vh,28px); }
        .form-emoji { font-size:28px;margin-bottom:10px; }
        .form-title { font-size:clamp(20px,2.8vw,26px);font-weight:800;color:#111;letter-spacing:-0.8px;margin-bottom:6px; }
        .form-sub { font-size:clamp(12px,1.3vw,13px);color:#888;line-height:1.6; }

        .role-toggle { display:flex;background:white;border:1.5px solid #e5e7eb;border-radius:14px;padding:4px;margin-bottom:clamp(16px,3vh,22px);gap:4px; }
        .role-btn { flex:1;padding:clamp(9px,1.5vh,12px) 16px;border-radius:10px;border:none;font-size:clamp(12px,1.4vw,14px);font-weight:600;cursor:pointer;font-family:inherit;transition:all 0.25s;display:flex;align-items:center;justify-content:center;gap:7px; }
        .role-btn.active { background:#B91C1C;color:white;box-shadow:0 4px 12px rgba(185,28,28,0.3); }
        .role-btn.inactive { background:transparent;color:#888; }
        .role-btn.inactive:hover { background:#f3f4f6;color:#555; }

        .error-box { background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:11px 14px;font-size:13px;color:#B91C1C;font-weight:500;margin-bottom:18px;display:flex;align-items:center;gap:8px;animation:shake 0.4s ease; }

        .form-group { margin-bottom:clamp(14px,2.5vh,18px); }
        .form-label { display:block;font-size:11px;font-weight:700;color:#374151;margin-bottom:6px;letter-spacing:0.3px;text-transform:uppercase; }
        .form-input { width:100%;background:white;border:1.5px solid #e5e7eb;border-radius:11px;padding:clamp(10px,1.6vh,13px) clamp(12px,1.8vw,15px);font-size:clamp(13px,1.4vw,14px);color:#111;font-family:inherit;transition:all 0.2s;outline:none; }
        .form-input:focus { border-color:#B91C1C;box-shadow:0 0 0 3px rgba(185,28,28,0.08); }
        .form-input::placeholder { color:#9ca3af; }

        .submit-btn { width:100%;background:#B91C1C;color:white;border:none;padding:clamp(12px,2vh,15px);border-radius:12px;font-size:clamp(14px,1.6vw,15px);font-weight:700;cursor:pointer;font-family:inherit;transition:all 0.3s;display:flex;align-items:center;justify-content:center;gap:8px;margin-top:clamp(4px,1vh,8px);box-shadow:0 4px 20px rgba(185,28,28,0.3); }
        .submit-btn:hover:not(:disabled) { background:#991B1B;transform:translateY(-2px);box-shadow:0 8px 30px rgba(185,28,28,0.4); }
        .submit-btn:disabled { opacity:0.7;cursor:not-allowed; }
        .spinner { width:15px;height:15px;border:2px solid rgba(255,255,255,0.3);border-top-color:white;border-radius:50%;animation:spin 0.7s linear infinite;flex-shrink:0; }

        .hint { font-size:clamp(11px,1.2vw,12px);color:#aaa;text-align:center;margin-top:clamp(12px,2vh,16px);line-height:1.6; }

        @media (max-width:768px) {
          .cp-left { display:none; }
          .cp-right { width:100%;min-height:100svh;padding:clamp(24px,6vw,40px) clamp(20px,6vw,32px);background:white; }
          .form-wrap { max-width:100%; }
        }
        @media (max-width:1024px) and (min-width:769px) {
          .cp-left { padding:40px; }
          .steps-track { display:none; }
          .cp-right { width:52%; }
        }
      `}</style>

      {/* Left Panel */}
      <div className="cp-left">
        <div className="cp-left-pattern" />
        <div className="cp-left-glow" />
        <div className="cp-left-glow2" />
        <div className="left-content">
          <div className="left-logo">RedThread 🩸</div>
          <div className="left-step-label">One last step</div>
          <h2 className="left-title">{isDonor ? 'Tell us about yourself.' : 'Set up your hospital.'}</h2>
          <p className="left-sub">
            {isDonor
              ? 'You signed in with Google! Just tell us your name and phone so donors can reach you when needed.'
              : 'Almost done! Tell us your hospital name and contact so donors can connect with you instantly.'}
          </p>
          <div className="steps-track">
            <div className="track-step done" style={{ animation: 'slideInLeft 0.5s ease 0.3s both' }}>
              <div className="track-num done">✓</div>
              <div className="track-text">
                <div className="track-title">Sign in with Google</div>
                <div className="track-sub">Account verified successfully</div>
              </div>
            </div>
            <div className="track-step done" style={{ animation: 'slideInLeft 0.5s ease 0.5s both' }}>
              <div className="track-num done">✓</div>
              <div className="track-text">
                <div className="track-title">Choose your role</div>
                <div className="track-sub">{isDonor ? 'Donor selected' : 'Hospital selected'}</div>
              </div>
            </div>
            <div className="track-step" style={{ animation: 'slideInLeft 0.5s ease 0.7s both', background: 'rgba(255,255,255,0.18)', borderColor: 'rgba(255,255,255,0.35)' }}>
              <div className="track-num" style={{ background: 'white', color: '#B91C1C' }}>3</div>
              <div className="track-text">
                <div className="track-title">Complete profile</div>
                <div className="track-sub" style={{ color: 'rgba(255,255,255,0.8)' }}>Fill in the form →</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="cp-right">
        <div className="form-wrap">
          <div className="form-header">
            <div className="form-emoji">{isDonor ? '🙋' : '🏥'}</div>
            <div className="form-title">Complete your profile</div>
            <div className="form-sub">You're almost in! Just a few more details and you're ready to {isDonor ? 'start saving lives' : 'find donors instantly'}.</div>
          </div>

          {/* Role Toggle */}
          <div className="role-toggle">
            <button type="button" className={`role-btn ${formData.role === 'donor' ? 'active' : 'inactive'}`} onClick={() => setFormData({ ...formData, role: 'donor' })}>
              🩸 I'm a Donor
            </button>
            <button type="button" className={`role-btn ${formData.role === 'hospital' ? 'active' : 'inactive'}`} onClick={() => setFormData({ ...formData, role: 'hospital' })}>
              🏥 I'm a Hospital
            </button>
          </div>

          {error && (
            <div className="error-box"><span>⚠️</span> {error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">{isDonor ? 'Full Name' : 'Hospital Name'}</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="form-input"
                placeholder={isDonor ? 'John Doe' : 'Apollo Hospital'}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="form-input"
                placeholder="9999999999"
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading
                ? <><div className="spinner" /> Saving profile...</>
                : `→ Complete ${isDonor ? 'Donor' : 'Hospital'} Profile`
              }
            </button>
          </form>

          <div className="hint">
            Your information is secure and only used to match you with {isDonor ? 'nearby blood requests' : 'available donors'}.
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompleteProfile
