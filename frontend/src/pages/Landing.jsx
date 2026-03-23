import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Landing = () => {
  const navigate = useNavigate()
  const [scrollY, setScrollY] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [loaded, setLoaded] = useState(false)
  const [statsVisible, setStatsVisible] = useState(false)
  const [counts, setCounts] = useState({ donors: 0, lives: 0, hospitals: 0, cities: 0 })
  const [activeStep, setActiveStep] = useState(0)
  const [visibleSections, setVisibleSections] = useState({})
  const [hoveredDot, setHoveredDot] = useState(null)
  const [activeDotIndex, setActiveDotIndex] = useState(0)
  const statsRef = useRef(null)

  const mapDots = [
    { x: 28, y: 35, size: 'lg', active: true, name: 'Rahul S.', blood: 'A+' },
    { x: 45, y: 28, size: 'md', active: true, name: 'Priya M.', blood: 'O-' },
    { x: 62, y: 42, size: 'sm', active: false, name: 'Amit K.', blood: 'B+' },
    { x: 35, y: 55, size: 'md', active: true, name: 'Neha R.', blood: 'AB+' },
    { x: 72, y: 30, size: 'lg', active: true, name: 'Vikram P.', blood: 'O+' },
    { x: 55, y: 65, size: 'sm', active: true, name: 'Sona T.', blood: 'A-' },
    { x: 20, y: 60, size: 'md', active: false, name: 'Raj D.', blood: 'B-' },
    { x: 80, y: 55, size: 'sm', active: true, name: 'Meera J.', blood: 'O+' },
    { x: 48, y: 75, size: 'md', active: true, name: 'Arjun N.', blood: 'A+' },
    { x: 15, y: 45, size: 'sm', active: false, name: 'Divya S.', blood: 'B+' },
    { x: 68, y: 72, size: 'lg', active: true, name: 'Karan M.', blood: 'O-' },
    { x: 38, y: 20, size: 'sm', active: true, name: 'Anita V.', blood: 'AB-' },
  ]

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100)
    const handleScroll = () => setScrollY(window.scrollY)
    const handleMouse = (e) => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('mousemove', handleMouse)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouse)
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !statsVisible) {
        setStatsVisible(true)
        animateCount('donors', 0, 2400, 2000)
        animateCount('lives', 0, 980, 2000)
        animateCount('hospitals', 0, 142, 1500)
        animateCount('cities', 0, 38, 1200)
      }
    }, { threshold: 0.3 })
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [statsVisible])

  useEffect(() => {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisibleSections(prev => ({ ...prev, [entry.target.dataset.section]: true }))
        }
      })
    }, { threshold: 0.08 })
    document.querySelectorAll('[data-section]').forEach(el => sectionObserver.observe(el))
    return () => sectionObserver.disconnect()
  }, [loaded])

  useEffect(() => {
    const interval = setInterval(() => setActiveStep(prev => (prev + 1) % 4), 2500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const activeDots = mapDots.map((d, i) => ({ ...d, i })).filter(d => d.active)
    let idx = 0
    const interval = setInterval(() => {
      setActiveDotIndex(activeDots[idx % activeDots.length].i)
      idx++
    }, 1800)
    return () => clearInterval(interval)
  }, [])

  const animateCount = (key, start, end, duration) => {
    const startTime = Date.now()
    const tick = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCounts(prev => ({ ...prev, [key]: Math.floor(start + (end - start) * eased) }))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }

  const isVisible = (section) => visibleSections[section]

  const features = [
    { icon: '⚡', title: 'Real-Time Matching', desc: 'Instant donor-to-hospital connections based on blood type and proximity within seconds.', color: '#fef2f2', border: '#fecaca' },
    { icon: '📍', title: 'Location-Based Search', desc: 'Hyperlocal 10km radius matching finds donors who can actually arrive in time.', color: '#fff7ed', border: '#fed7aa' },
    { icon: '🔔', title: 'Emergency Alerts', desc: 'Critical requests trigger immediate email notifications to all matching donors.', color: '#fdf4ff', border: '#e9d5ff' },
    { icon: '✅', title: 'Verified Donors', desc: 'Every donor profile verified with blood type and real-time availability status.', color: '#f0fdf4', border: '#bbf7d0' },
    { icon: '🏥', title: 'Hospital Dashboard', desc: 'Hospitals manage requests, track responses, and coordinate donations seamlessly.', color: '#eff6ff', border: '#bfdbfe' },
    { icon: '📊', title: 'Donation History', desc: 'Complete audit trail of every donation and request for full transparency.', color: '#fefce8', border: '#fde68a' },
  ]

  const steps = [
    { num: '01', title: 'Register', desc: 'Sign up as a donor or hospital. Takes under 2 minutes.', icon: '📋', color: '#B91C1C' },
    { num: '02', title: 'Set Profile', desc: 'Donors set blood type, location, and availability status.', icon: '📍', color: '#991B1B' },
    { num: '03', title: 'Get Matched', desc: 'Hospitals post requests. Nearby donors get notified instantly.', icon: '🔔', color: '#7F1D1D' },
    { num: '04', title: 'Save a Life', desc: 'Donor accepts, heads to hospital. A life is saved.', icon: '🩸', color: '#450A0A' },
  ]

  const testimonials = [
    { quote: "RedThread notified me within seconds. I was at the hospital in 20 minutes. The patient survived.", name: "Arjun Mehta", role: "Blood Donor, Delhi", avatar: "AM" },
    { quote: "We posted a critical O- request at 2am. Three donors responded within minutes. Incredible platform.", name: "Dr. Priya Sharma", role: "Chief Surgeon, Apollo Hospital", avatar: "PS" },
    { quote: "My daughter needed a rare blood type. RedThread found a matching donor 4km away in under 5 minutes.", name: "Sunita Kapoor", role: "Patient's Mother, Mumbai", avatar: "SK" },
  ]

  return (
    <div style={{ fontFamily: "'Inter', 'Poppins', sans-serif", background: '#fafafa', color: '#111', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        html { scroll-behavior:smooth; }

        /* Preloader */
        .preloader { position:fixed;inset:0;z-index:9999;background:#B91C1C;display:flex;align-items:center;justify-content:center;transition:opacity 0.8s ease,visibility 0.8s ease; }
        .preloader.hide { opacity:0;visibility:hidden;pointer-events:none; }
        .preloader-text { font-size:clamp(24px,5vw,32px);font-weight:800;color:white;letter-spacing:-1px;animation:preloaderPulse 0.8s ease infinite alternate; }
        @keyframes preloaderPulse { from{opacity:0.6;transform:scale(0.98)} to{opacity:1;transform:scale(1)} }

        /* Cursor */
        .cursor-glow { position:fixed;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(185,28,28,0.06) 0%,transparent 70%);pointer-events:none;z-index:0;transition:left 0.15s ease,top 0.15s ease; }

        /* Navbar */
        .nav { position:fixed;top:0;left:0;right:0;z-index:100;padding:0 clamp(16px,4vw,64px);height:68px;display:flex;justify-content:space-between;align-items:center;transition:all 0.3s ease; }
        .nav.scrolled { background:rgba(255,255,255,0.95);backdrop-filter:blur(20px);box-shadow:0 1px 40px rgba(0,0,0,0.08); }
        .nav-logo { font-size:clamp(16px,2vw,20px);font-weight:800;color:#B91C1C;letter-spacing:-0.5px;cursor:pointer;white-space:nowrap; }
        .nav-links { display:flex;gap:clamp(16px,3vw,40px);align-items:center; }
        .nav-link { font-size:14px;font-weight:500;color:#555;cursor:pointer;transition:color 0.2s;text-decoration:none;white-space:nowrap; }
        .nav-link:hover { color:#B91C1C; }
        .nav-btns { display:flex;gap:8px;align-items:center; }
        .btn-outline { background:transparent;border:1.5px solid #B91C1C;color:#B91C1C;padding:9px clamp(14px,2vw,24px);border-radius:100px;font-size:clamp(12px,1.5vw,14px);font-weight:600;cursor:pointer;font-family:inherit;transition:all 0.2s;white-space:nowrap; }
        .btn-outline:hover { background:#B91C1C;color:white;transform:translateY(-1px); }
        .btn-solid { background:#B91C1C;border:none;color:white;padding:9px clamp(14px,2vw,24px);border-radius:100px;font-size:clamp(12px,1.5vw,14px);font-weight:600;cursor:pointer;font-family:inherit;transition:all 0.2s;box-shadow:0 4px 20px rgba(185,28,28,0.35);white-space:nowrap; }
        .btn-solid:hover { background:#991B1B;transform:translateY(-1px);box-shadow:0 8px 30px rgba(185,28,28,0.45); }

        /* Hero */
        .hero { min-height:100svh;display:flex;align-items:center;padding:clamp(80px,12vh,120px) clamp(16px,4vw,64px) clamp(60px,8vh,80px);background:linear-gradient(135deg,#fff 0%,#fff5f5 50%,#fff 100%);position:relative;overflow:hidden; }
        .hero-bg-circle-1 { position:absolute;width:min(800px,90vw);height:min(800px,90vw);border-radius:50%;background:radial-gradient(circle,rgba(185,28,28,0.06) 0%,transparent 70%);right:-20%;top:-20%;pointer-events:none; }
        .hero-bg-circle-2 { position:absolute;width:min(400px,60vw);height:min(400px,60vw);border-radius:50%;background:radial-gradient(circle,rgba(185,28,28,0.04) 0%,transparent 70%);left:-10%;bottom:-10%;pointer-events:none; }
        .hero-threads { position:absolute;inset:0;pointer-events:none;overflow:hidden; }
        .hero-content { position:relative;z-index:1;max-width:min(680px,100%);width:100%; }
        .hero-badge { display:inline-flex;align-items:center;gap:8px;background:rgba(185,28,28,0.08);border:1px solid rgba(185,28,28,0.2);color:#B91C1C;padding:8px 16px;border-radius:100px;font-size:clamp(11px,1.5vw,13px);font-weight:600;margin-bottom:clamp(16px,3vh,28px);opacity:0;transform:translateY(20px);animation:fadeUp 0.7s ease 0.3s forwards;max-width:100%; }
        .heartbeat { animation:heartbeat 1.2s ease infinite;display:inline-block;flex-shrink:0; }
        @keyframes heartbeat { 0%,100%{transform:scale(1)} 14%{transform:scale(1.2)} 28%{transform:scale(1)} 42%{transform:scale(1.15)} 70%{transform:scale(1)} }
        .hero-title { font-size:clamp(36px,6vw,80px);font-weight:900;line-height:1.05;letter-spacing:clamp(-1px,-0.05em,-2.5px);margin-bottom:clamp(14px,2.5vh,24px);opacity:0;transform:translateY(20px);animation:fadeUp 0.7s ease 0.5s forwards;word-break:break-word; }
        .hero-title .gradient-text { background:linear-gradient(135deg,#B91C1C 0%,#ef4444 50%,#f87171 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text; }
        .hero-sub { font-size:clamp(15px,2vw,18px);color:#666;line-height:1.7;max-width:520px;margin-bottom:clamp(24px,4vh,40px);font-weight:400;opacity:0;transform:translateY(20px);animation:fadeUp 0.7s ease 0.7s forwards; }
        .hero-btns { display:flex;gap:12px;flex-wrap:wrap;opacity:0;transform:translateY(20px);animation:fadeUp 0.7s ease 0.9s forwards; }
        .btn-hero-primary { background:#B91C1C;color:white;border:none;padding:clamp(12px,2vh,16px) clamp(24px,3vw,40px);border-radius:100px;font-size:clamp(14px,1.8vw,16px);font-weight:700;cursor:pointer;font-family:inherit;transition:all 0.3s;box-shadow:0 8px 30px rgba(185,28,28,0.35);display:flex;align-items:center;gap:8px;white-space:nowrap; }
        .btn-hero-primary:hover { background:#991B1B;transform:translateY(-3px);box-shadow:0 16px 40px rgba(185,28,28,0.45); }
        .btn-hero-secondary { background:white;color:#B91C1C;border:2px solid rgba(185,28,28,0.2);padding:clamp(12px,2vh,16px) clamp(24px,3vw,40px);border-radius:100px;font-size:clamp(14px,1.8vw,16px);font-weight:600;cursor:pointer;font-family:inherit;transition:all 0.3s;white-space:nowrap; }
        .btn-hero-secondary:hover { border-color:#B91C1C;transform:translateY(-3px);box-shadow:0 8px 20px rgba(185,28,28,0.15); }
        .hero-visual { position:absolute;right:clamp(16px,4vw,64px);top:50%;transform:translateY(-50%);width:clamp(320px,35vw,500px);height:clamp(320px,35vw,500px);opacity:0;animation:fadeIn 1s ease 1s forwards; }
        .hero-card { background:white;border-radius:20px;padding:clamp(16px,2vw,24px);box-shadow:0 20px 60px rgba(0,0,0,0.1);position:absolute; }
        .hero-card-main { width:clamp(200px,22vw,300px);top:50%;left:50%;transform:translate(-50%,-50%); }
        .hero-card-notify { width:clamp(160px,18vw,220px);top:10%;right:0;animation:float 4s ease infinite; }
        .hero-card-donor { width:clamp(150px,16vw,200px);bottom:10%;left:0;animation:float 4s ease 2s infinite; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        .card-label { font-size:clamp(9px,1vw,11px);font-weight:700;color:#999;letter-spacing:1px;text-transform:uppercase;margin-bottom:10px; }
        .blood-type { font-size:clamp(32px,4vw,48px);font-weight:900;color:#B91C1C;letter-spacing:-2px;line-height:1; }
        .card-sub { font-size:clamp(11px,1.2vw,13px);color:#666;margin-top:8px; }
        .notify-icon { font-size:clamp(20px,2.5vw,28px);margin-bottom:8px; }
        .notify-title { font-size:clamp(12px,1.3vw,14px);font-weight:700;color:#111; }
        .notify-sub { font-size:clamp(10px,1.1vw,12px);color:#666;margin-top:4px; }
        .notify-time { font-size:clamp(10px,1vw,11px);color:#B91C1C;font-weight:600;margin-top:8px; }
        .donor-name { font-size:clamp(13px,1.4vw,15px);font-weight:700;color:#111; }
        .donor-info { font-size:clamp(10px,1.1vw,12px);color:#666;margin-top:4px; }
        .donor-badge { display:inline-block;background:#dcfce7;color:#16a34a;font-size:clamp(9px,1vw,11px);font-weight:700;padding:3px 10px;border-radius:100px;margin-top:8px; }
        .ring { position:absolute;border-radius:50%;border:1px solid rgba(185,28,28,0.15);top:50%;left:50%;transform:translate(-50%,-50%);animation:ringPulse 3s ease infinite; }
        @keyframes ringPulse { 0%{opacity:0.8;transform:translate(-50%,-50%) scale(0.8)} 100%{opacity:0;transform:translate(-50%,-50%) scale(1.5)} }

        /* Stats */
        .stats-section { padding:clamp(40px,6vh,80px) clamp(16px,4vw,64px);background:white;border-top:1px solid #f0f0f0;border-bottom:1px solid #f0f0f0; }
        .stats-grid { display:grid;grid-template-columns:repeat(4,1fr);max-width:1100px;margin:0 auto; }
        .stat-item { padding:clamp(16px,3vh,24px) clamp(12px,3vw,40px);text-align:center;border-right:1px solid #f0f0f0; }
        .stat-item:last-child { border-right:none; }
        .stat-num { font-size:clamp(28px,5vw,52px);font-weight:900;letter-spacing:-2px;line-height:1;background:linear-gradient(135deg,#B91C1C,#ef4444);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text; }
        .stat-label { font-size:clamp(11px,1.2vw,14px);color:#888;font-weight:500;margin-top:8px; }

        /* Reveal */
        .reveal { opacity:0;transform:translateY(40px);transition:opacity 0.7s ease,transform 0.7s ease; }
        .reveal.visible { opacity:1;transform:translateY(0); }
        .reveal-scale { opacity:0;transform:scale(0.95);transition:opacity 0.7s ease,transform 0.7s ease; }
        .reveal-scale.visible { opacity:1;transform:scale(1); }

        /* Sections */
        .sec-wrap { padding:clamp(60px,10vh,120px) clamp(16px,4vw,64px); }
        .section { max-width:1200px;margin:0 auto; }
        .section-tag { font-size:clamp(10px,1.2vw,12px);font-weight:700;color:#B91C1C;letter-spacing:3px;text-transform:uppercase;margin-bottom:16px; }
        .section-title { font-size:clamp(26px,4vw,52px);font-weight:800;letter-spacing:clamp(-0.5px,-0.04em,-1.5px);line-height:1.1;margin-bottom:16px; }
        .section-sub { font-size:clamp(14px,1.6vw,16px);color:#666;max-width:480px;line-height:1.7; }

        /* Features */
        .features-bg { background:#fafafa; }
        .features-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(12px,2vw,20px);margin-top:clamp(32px,5vh,64px); }
        .feature-card { border-radius:20px;padding:clamp(20px,3vw,36px);border:1.5px solid transparent;transition:all 0.4s cubic-bezier(0.34,1.56,0.64,1);cursor:default;opacity:0;transform:translateY(30px); }
        .feature-card.visible { opacity:1;transform:translateY(0); }
        .feature-card:hover { transform:translateY(-8px) scale(1.02);box-shadow:0 24px 60px rgba(185,28,28,0.12); }
        .feature-icon { font-size:clamp(28px,3.5vw,40px);margin-bottom:clamp(12px,2vh,20px);display:block;transition:transform 0.3s; }
        .feature-card:hover .feature-icon { transform:scale(1.2) rotate(-5deg); }
        .feature-title { font-size:clamp(15px,1.8vw,18px);font-weight:700;margin-bottom:10px;letter-spacing:-0.3px; }
        .feature-desc { font-size:clamp(13px,1.4vw,14px);color:#666;line-height:1.7; }

        /* Steps */
        .steps-bg { background:white; }
        .steps-wrapper { display:grid;grid-template-columns:1fr 1fr;gap:clamp(32px,6vw,80px);align-items:center;margin-top:clamp(32px,5vh,64px); }
        .steps-list { display:flex;flex-direction:column;gap:0; }
        .step-item { display:flex;gap:clamp(12px,2vw,20px);padding:clamp(14px,2vw,24px);border-radius:16px;cursor:pointer;transition:all 0.3s;border:2px solid transparent; }
        .step-item.active { background:#fff5f5;border-color:#fecaca; }
        .step-circle { width:clamp(44px,5vw,56px);height:clamp(44px,5vw,56px);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:clamp(16px,2vw,20px);flex-shrink:0;transition:all 0.3s; }
        .step-num-label { font-size:clamp(9px,1vw,11px);font-weight:700;color:#B91C1C;letter-spacing:2px;text-transform:uppercase;margin-bottom:4px; }
        .step-title { font-size:clamp(15px,1.8vw,18px);font-weight:700;margin-bottom:6px; }
        .step-desc { font-size:clamp(12px,1.4vw,14px);color:#666;line-height:1.6; }
        .steps-visual { position:relative;height:clamp(340px,40vw,460px);display:flex;align-items:center;justify-content:center; }
        .step-phone { width:clamp(200px,22vw,260px);background:white;border-radius:32px;box-shadow:0 32px 80px rgba(0,0,0,0.15);overflow:hidden;border:8px solid #111;transition:all 0.5s; }
        .phone-screen { background:linear-gradient(135deg,#fff5f5,#fff);padding:clamp(14px,2vw,20px);min-height:clamp(300px,35vw,400px); }
        .phone-header { display:flex;justify-content:space-between;align-items:center;margin-bottom:clamp(12px,2vh,20px); }
        .phone-logo { font-size:clamp(11px,1.3vw,14px);font-weight:800;color:#B91C1C; }
        .phone-status { font-size:clamp(9px,1vw,11px);color:#16a34a;font-weight:600;background:#dcfce7;padding:3px 8px;border-radius:100px; }

        /* Impact */
        .impact-bg { background:linear-gradient(135deg,#7F1D1D 0%,#B91C1C 50%,#DC2626 100%);position:relative;overflow:hidden; }
        .impact-bg-pattern { position:absolute;inset:0;background-image:radial-gradient(circle,rgba(255,255,255,0.05) 1px,transparent 1px);background-size:30px 30px;pointer-events:none; }
        .impact-title { font-size:clamp(28px,5vw,64px);font-weight:900;color:white;letter-spacing:-2px;margin-bottom:20px; }
        .impact-sub { font-size:clamp(14px,1.8vw,18px);color:rgba(255,255,255,0.7);max-width:520px;line-height:1.7;margin-bottom:clamp(32px,5vh,64px); }
        .testimonials-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(12px,2vw,24px); }
        .testimonial-card { background:rgba(255,255,255,0.1);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.15);border-radius:20px;padding:clamp(20px,3vw,32px);transition:all 0.4s;opacity:0;transform:translateY(30px); }
        .testimonial-card.visible { opacity:1;transform:translateY(0); }
        .testimonial-card:hover { background:rgba(255,255,255,0.18);transform:translateY(-6px);box-shadow:0 20px 60px rgba(0,0,0,0.2); }
        .quote-mark { font-size:clamp(36px,4vw,48px);color:rgba(255,255,255,0.3);line-height:1;margin-bottom:16px;font-family:Georgia,serif; }
        .quote-text { font-size:clamp(13px,1.5vw,15px);color:rgba(255,255,255,0.9);line-height:1.7;margin-bottom:24px;font-style:italic; }
        .quote-avatar { width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;color:white;margin-bottom:10px; }
        .quote-name { font-size:clamp(13px,1.4vw,14px);font-weight:700;color:white; }
        .quote-role { font-size:clamp(11px,1.2vw,12px);color:rgba(255,255,255,0.6);margin-top:4px; }

        /* Map */
        .map-section { background:#fafafa;padding:clamp(60px,10vh,120px) clamp(16px,4vw,64px); }
        .map-inner { max-width:1200px;margin:0 auto; }
        .map-container { margin-top:clamp(32px,5vh,64px);background:white;border-radius:24px;border:1px solid #f0f0f0;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.06);height:clamp(320px,45vw,480px);position:relative; }
        .map-bg-grad { position:absolute;inset:0;background:linear-gradient(135deg,#f8fafc 0%,#fff5f5 50%,#f8fafc 100%); }
        .map-grid { position:absolute;inset:0;background-image:linear-gradient(rgba(185,28,28,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(185,28,28,0.04) 1px,transparent 1px);background-size:40px 40px; }
        .map-dot { position:absolute;border-radius:50%;transform:translate(-50%,-50%);cursor:pointer;transition:all 0.3s;z-index:2; }
        .map-dot.active { background:#B91C1C; }
        .map-dot.inactive { background:#d1d5db; }
        .map-dot.lg { width:clamp(12px,1.5vw,18px);height:clamp(12px,1.5vw,18px); }
        .map-dot.md { width:clamp(9px,1.1vw,13px);height:clamp(9px,1.1vw,13px); }
        .map-dot.sm { width:clamp(6px,0.8vw,9px);height:clamp(6px,0.8vw,9px); }
        .map-dot.active.lg { box-shadow:0 0 0 6px rgba(185,28,28,0.15);animation:mapPulse 2s ease infinite; }
        .map-dot.active.md { box-shadow:0 0 0 4px rgba(185,28,28,0.12);animation:mapPulse 2s ease 0.5s infinite; }
        .map-dot.highlighted { transform:translate(-50%,-50%) scale(1.5);box-shadow:0 0 0 8px rgba(185,28,28,0.25) !important; }
        @keyframes mapPulse { 0%,100%{box-shadow:0 0 0 4px rgba(185,28,28,0.15)} 50%{box-shadow:0 0 0 12px rgba(185,28,28,0.05)} }
        .map-tooltip { position:absolute;background:white;border-radius:12px;padding:10px 14px;box-shadow:0 8px 32px rgba(0,0,0,0.15);font-size:12px;pointer-events:none;z-index:10;white-space:nowrap;transform:translate(-50%,-130%); }
        .map-tooltip::after { content:'';position:absolute;bottom:-6px;left:50%;transform:translateX(-50%);width:12px;height:12px;background:white;clip-path:polygon(0 0,100% 0,50% 100%); }
        .tooltip-name { font-weight:700;color:#111; }
        .tooltip-blood { font-size:11px;color:#B91C1C;font-weight:600;margin-top:2px; }
        .map-overlay { position:absolute;background:white;border-radius:10px;box-shadow:0 4px 20px rgba(0,0,0,0.1);font-size:clamp(11px,1.3vw,14px); }
        .map-title-ov { top:clamp(12px,2vw,24px);left:clamp(12px,2vw,24px);padding:clamp(8px,1.2vw,12px) clamp(12px,1.8vw,20px);font-weight:700;color:#111; }
        .map-count-ov { top:clamp(12px,2vw,24px);right:clamp(12px,2vw,24px);background:#B91C1C;color:white;padding:clamp(8px,1vw,10px) clamp(12px,1.5vw,16px);font-weight:700;animation:countPulse 2s ease infinite; }
        @keyframes countPulse { 0%,100%{box-shadow:0 0 0 0 rgba(185,28,28,0.4)} 50%{box-shadow:0 0 0 8px rgba(185,28,28,0)} }
        .map-legend-ov { bottom:clamp(12px,2vw,24px);right:clamp(12px,2vw,24px);padding:clamp(10px,1.5vw,16px) clamp(12px,1.8vw,20px); }
        .map-req-ov { bottom:clamp(12px,2vw,24px);left:clamp(12px,2vw,24px);padding:clamp(10px,1.5vw,14px) clamp(12px,1.8vw,18px);max-width:clamp(160px,20vw,220px); }
        .legend-item { display:flex;align-items:center;gap:8px;margin-bottom:8px;color:#555;font-size:clamp(11px,1.2vw,13px); }
        .legend-item:last-child { margin-bottom:0; }
        .legend-dot { width:10px;height:10px;border-radius:50%;flex-shrink:0; }
        .map-req-title { font-weight:700;color:#111;margin-bottom:4px;font-size:clamp(12px,1.4vw,14px); }
        .map-req-detail { font-size:clamp(10px,1.1vw,12px);color:#666; }
        .map-req-badge { display:inline-block;background:#fef2f2;color:#B91C1C;font-size:clamp(9px,1vw,11px);font-weight:700;padding:3px 8px;border-radius:100px;margin-top:6px; }

        /* CTA */
        .cta-section { padding:clamp(80px,12vh,140px) clamp(16px,4vw,64px);text-align:center;background:white;position:relative;overflow:hidden; }
        .cta-bg { position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(185,28,28,0.05) 0%,transparent 70%); }
        .cta-title { font-size:clamp(28px,6vw,72px);font-weight:900;letter-spacing:clamp(-1px,-0.04em,-2px);margin-bottom:20px;position:relative;line-height:1.05; }
        .cta-sub { font-size:clamp(15px,1.8vw,18px);color:#666;max-width:480px;margin:0 auto 48px;line-height:1.7;position:relative; }
        .cta-btns { display:flex;gap:12px;justify-content:center;flex-wrap:wrap;position:relative; }
        .cta-trust { display:flex;align-items:center;justify-content:center;gap:clamp(16px,3vw,32px);margin-top:clamp(24px,4vh,48px);position:relative;flex-wrap:wrap; }
        .trust-item { display:flex;align-items:center;gap:6px;font-size:clamp(12px,1.4vw,14px);color:#888;font-weight:500; }

        /* Footer */
        .footer { background:#111;color:white;padding:clamp(40px,6vh,60px) clamp(16px,4vw,64px) clamp(24px,4vh,40px); }
        .footer-top { display:flex;justify-content:space-between;margin-bottom:clamp(32px,5vh,48px);gap:32px;flex-wrap:wrap; }
        .footer-logo { font-size:clamp(18px,2vw,22px);font-weight:800;color:#ef4444;letter-spacing:-0.5px; }
        .footer-tagline { font-size:clamp(12px,1.3vw,14px);color:#666;margin-top:8px; }
        .footer-links { display:flex;gap:clamp(32px,5vw,60px);flex-wrap:wrap; }
        .footer-col-title { font-size:clamp(10px,1.1vw,12px);font-weight:700;color:#555;letter-spacing:2px;text-transform:uppercase;margin-bottom:16px; }
        .footer-link { font-size:clamp(12px,1.3vw,14px);color:#666;cursor:pointer;transition:color 0.2s;display:block;margin-bottom:10px; }
        .footer-link:hover { color:#ef4444; }
        .footer-bottom { border-top:1px solid #222;padding-top:clamp(16px,3vh,32px);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px; }
        .footer-copy { font-size:clamp(11px,1.2vw,13px);color:#555; }
        .footer-heart { color:#ef4444; }

        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }

        /* ===== RESPONSIVE BREAKPOINTS ===== */

        /* Large screens - hide floating cards below 1100px */
        @media (max-width:1100px) {
          .hero-visual { display:none; }
          .hero-content { max-width:100%; }
        }

        /* Tablets - 768px to 1024px */
        @media (max-width:1024px) and (min-width:769px) {
          .nav-links { display:none; }
          .stats-grid { grid-template-columns:repeat(2,1fr); }
          .stat-item:nth-child(2) { border-right:none; }
          .stat-item:nth-child(3) { border-top:1px solid #f0f0f0; }
          .features-grid { grid-template-columns:repeat(2,1fr); }
          .steps-wrapper { grid-template-columns:1fr; }
          .steps-visual { display:none; }
          .testimonials-grid { grid-template-columns:repeat(2,1fr); }
          .testimonials-grid .testimonial-card:last-child { grid-column:1/-1;max-width:400px;margin:0 auto;width:100%; }
        }

        /* Mobile - below 768px */
        @media (max-width:768px) {
          .nav-links { display:none; }
          .cursor-glow { display:none; }

          /* Stats 2x2 grid on mobile */
          .stats-grid { grid-template-columns:repeat(2,1fr); }
          .stat-item { border-right:none;border-bottom:1px solid #f0f0f0; }
          .stat-item:nth-child(1),.stat-item:nth-child(2) { border-right:none; }
          .stat-item:nth-child(1),.stat-item:nth-child(3) { border-right:1px solid #f0f0f0; }
          .stat-item:nth-child(3),.stat-item:nth-child(4) { border-bottom:none; }

          /* Features single column */
          .features-grid { grid-template-columns:1fr; }

          /* Steps single column, no phone visual */
          .steps-wrapper { grid-template-columns:1fr; }
          .steps-visual { display:none; }

          /* Testimonials single column */
          .testimonials-grid { grid-template-columns:1fr; }

          /* Map smaller height */
          .map-container { height:clamp(280px,80vw,360px); }

          /* Hide map overlays that are too small */
          .map-legend-ov { display:none; }
          .map-req-ov { display:none; }
        }

        /* Small mobile - below 480px */
        @media (max-width:480px) {
          .nav-btns .btn-outline { display:none; }
          .hero-badge span.badge-text { display:none; }
          .cta-trust { gap:12px; }
          .trust-item { font-size:11px; }
          .map-title-ov { font-size:12px;padding:8px 12px; }
          .map-count-ov { font-size:11px;padding:6px 10px; }
        }

        /* Very small screens */
        @media (max-width:360px) {
          .hero-btns { flex-direction:column; }
          .btn-hero-primary, .btn-hero-secondary { width:100%;justify-content:center; }
          .cta-btns { flex-direction:column;align-items:center; }
        }
      `}</style>

      {/* Preloader */}
      <div className={`preloader ${loaded ? 'hide' : ''}`}>
        <div className="preloader-text">RedThread 🩸</div>
      </div>

      {/* Cursor glow */}
      <div className="cursor-glow" style={{ left: mousePos.x - 250, top: mousePos.y - 250 }} />

      {/* Navbar */}
      <nav className={`nav ${scrollY > 20 ? 'scrolled' : ''}`}>
        <div className="nav-logo" onClick={() => window.scrollTo(0, 0)}>RedThread 🩸</div>
        <div className="nav-links">
          <a className="nav-link" href="#features">Features</a>
          <a className="nav-link" href="#how">How it works</a>
          <a className="nav-link" href="#impact">Impact</a>
          <a className="nav-link" href="#map">Map</a>
        </div>
        <div className="nav-btns">
          <button className="btn-outline" onClick={() => navigate('/login')}>Login</button>
          <button className="btn-solid" onClick={() => navigate('/register')}>Get Started</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-bg-circle-1" />
        <div className="hero-bg-circle-2" />
        <div className="hero-threads">
          <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.4 }}>
            <defs>
              <linearGradient id="threadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#B91C1C" stopOpacity="0" />
                <stop offset="50%" stopColor="#B91C1C" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#B91C1C" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M 0 200 Q 400 100 800 300 T 1600 200" stroke="url(#threadGrad)" strokeWidth="1.5" fill="none">
              <animateTransform attributeName="transform" type="translate" from="0 0" to="-200 50" dur="8s" repeatCount="indefinite" />
            </path>
            <path d="M 0 400 Q 300 250 700 450 T 1600 350" stroke="url(#threadGrad)" strokeWidth="1" fill="none">
              <animateTransform attributeName="transform" type="translate" from="0 0" to="-150 -30" dur="10s" repeatCount="indefinite" />
            </path>
            <path d="M 200 0 Q 500 300 400 600" stroke="url(#threadGrad)" strokeWidth="1" fill="none">
              <animateTransform attributeName="transform" type="translate" from="0 0" to="80 0" dur="12s" repeatCount="indefinite" />
            </path>
          </svg>
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="heartbeat">🩸</span>
            <span className="badge-text">Connecting Lives in Real Time</span>
          </div>
          <h1 className="hero-title">Connecting Lives,<br /><span className="gradient-text">One Drop at a Time.</span></h1>
          <p className="hero-sub">RedThread matches blood donors with hospitals and patients instantly — based on location, blood type, and availability. Because every second matters.</p>
          <div className="hero-btns">
            <button className="btn-hero-primary" onClick={() => navigate('/register')}>🩸 Find Donors</button>
            <button className="btn-hero-secondary" onClick={() => navigate('/register')}>Become a Donor →</button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="ring" style={{ width: 300, height: 300 }} />
          <div className="ring" style={{ width: 420, height: 420, animationDelay: '1s' }} />
          <div className="hero-card hero-card-main">
            <div className="card-label">Blood Request — Critical</div>
            <div className="blood-type">O−</div>
            <div className="card-sub">🏥 Apollo Hospital, Delhi</div>
            <div style={{ marginTop: 16, padding: '10px 16px', background: '#fef2f2', borderRadius: 10, fontSize: 13, color: '#B91C1C', fontWeight: 600 }}>⚡ 3 donors notified nearby</div>
          </div>
          <div className="hero-card hero-card-notify">
            <div className="notify-icon">🔔</div>
            <div className="notify-title">Urgent Request Nearby!</div>
            <div className="notify-sub">Apollo Hospital needs O− blood</div>
            <div className="notify-time">Just now · 2.4km away</div>
          </div>
          <div className="hero-card hero-card-donor">
            <div className="donor-name">Arjun Mehta</div>
            <div className="donor-info">🩸 O− · Available Now</div>
            <div className="donor-badge">✓ Verified Donor</div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="stats-section" ref={statsRef}>
        <div className="stats-grid">
          {[
            { num: counts.donors.toLocaleString() + '+', label: 'Registered Donors' },
            { num: counts.lives + '+', label: 'Lives Saved' },
            { num: counts.hospitals + '+', label: 'Partner Hospitals' },
            { num: counts.cities + '+', label: 'Cities Covered' },
          ].map((s, i) => (
            <div className="stat-item" key={i}>
              <div className="stat-num">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="features-bg sec-wrap" id="features" data-section="features">
        <div className="section">
          <div className={`reveal ${isVisible('features') ? 'visible' : ''}`}>
            <div className="section-tag">Why RedThread</div>
            <h2 className="section-title">Everything you need<br />to save a life.</h2>
            <p className="section-sub">Built for speed, reliability, and real-world impact in critical medical situations.</p>
          </div>
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className={`feature-card ${isVisible('features') ? 'visible' : ''}`} style={{ background: f.color, borderColor: f.border, transitionDelay: `${i * 100}ms` }}>
                <span className="feature-icon">{f.icon}</span>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="steps-bg sec-wrap" id="how" data-section="steps">
        <div className="section">
          <div className={`reveal ${isVisible('steps') ? 'visible' : ''}`}>
            <div className="section-tag">How it works</div>
            <h2 className="section-title">Simple steps.<br />Life-saving results.</h2>
          </div>
          <div className="steps-wrapper">
            <div className="steps-list">
              {steps.map((s, i) => (
                <div key={i} className={`step-item ${activeStep === i ? 'active' : ''}`} onClick={() => setActiveStep(i)}>
                  <div className="step-circle" style={{ background: activeStep === i ? `linear-gradient(135deg, ${s.color}, #ef4444)` : '#e5e7eb' }}>
                    <span>{s.icon}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="step-num-label">{s.num}</div>
                    <div className="step-title">{s.title}</div>
                    {activeStep === i && <div className="step-desc" style={{ animation: 'fadeUp 0.3s ease' }}>{s.desc}</div>}
                  </div>
                </div>
              ))}
            </div>
            <div className="steps-visual">
              <div className="step-phone">
                <div style={{ background: '#111', padding: '8px 0', textAlign: 'center' }}>
                  <div style={{ width: 60, height: 4, background: '#333', borderRadius: 2, margin: '0 auto' }} />
                </div>
                <div className="phone-screen">
                  {activeStep === 0 && (
                    <div style={{ animation: 'fadeUp 0.4s ease' }}>
                      <div className="phone-header"><div className="phone-logo">RedThread 🩸</div><div className="phone-status">● Live</div></div>
                      <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 14, color: '#111' }}>Create Account</div>
                      {['Full Name', 'Email', 'Phone'].map((p, i) => (
                        <div key={i} style={{ background: '#f9fafb', border: '1.5px solid #e5e7eb', borderRadius: 10, padding: '10px 14px', marginBottom: 8, fontSize: 13, color: '#999' }}>{p}</div>
                      ))}
                      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                        <div style={{ flex: 1, background: '#B91C1C', color: 'white', padding: '10px', borderRadius: 10, textAlign: 'center', fontSize: 13, fontWeight: 700 }}>Donor</div>
                        <div style={{ flex: 1, background: '#f3f4f6', color: '#666', padding: '10px', borderRadius: 10, textAlign: 'center', fontSize: 13 }}>Hospital</div>
                      </div>
                      <div style={{ background: '#B91C1C', color: 'white', padding: '12px', borderRadius: 12, textAlign: 'center', fontSize: 14, fontWeight: 700 }}>Register →</div>
                    </div>
                  )}
                  {activeStep === 1 && (
                    <div style={{ animation: 'fadeUp 0.4s ease' }}>
                      <div className="phone-header"><div className="phone-logo">RedThread 🩸</div><div className="phone-status">✓ Done</div></div>
                      <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 14, color: '#111' }}>Set Your Profile</div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#999', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Blood Type</div>
                      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 12 }}>
                        {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bt, i) => (
                          <div key={i} style={{ padding: '5px 8px', borderRadius: 8, fontSize: 11, fontWeight: 700, background: bt === 'O-' ? '#B91C1C' : '#f3f4f6', color: bt === 'O-' ? 'white' : '#666' }}>{bt}</div>
                        ))}
                      </div>
                      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: 10, fontSize: 12, color: '#16a34a', fontWeight: 600 }}>📍 Location captured — Delhi NCR</div>
                      <div style={{ background: '#B91C1C', color: 'white', padding: '12px', borderRadius: 12, textAlign: 'center', fontSize: 14, fontWeight: 700, marginTop: 12 }}>Save →</div>
                    </div>
                  )}
                  {activeStep === 2 && (
                    <div style={{ animation: 'fadeUp 0.4s ease' }}>
                      <div className="phone-header"><div className="phone-logo">RedThread 🩸</div><div className="phone-status">● Active</div></div>
                      <div style={{ background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: 14, padding: 14, marginBottom: 12 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: '#B91C1C', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>🚨 Urgent Request</div>
                        <div style={{ fontSize: 26, fontWeight: 900, color: '#B91C1C', letterSpacing: -1 }}>O−</div>
                        <div style={{ fontSize: 12, color: '#666', marginTop: 3 }}>🏥 Apollo Hospital · 2.4km</div>
                        <div style={{ fontSize: 10, color: '#B91C1C', fontWeight: 600, marginTop: 4 }}>Critical · Just now</div>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <div style={{ flex: 1, background: '#B91C1C', color: 'white', padding: '10px', borderRadius: 10, textAlign: 'center', fontSize: 13, fontWeight: 700 }}>✅ Accept</div>
                        <div style={{ flex: 1, background: '#f3f4f6', color: '#666', padding: '10px', borderRadius: 10, textAlign: 'center', fontSize: 13 }}>❌ Reject</div>
                      </div>
                    </div>
                  )}
                  {activeStep === 3 && (
                    <div style={{ animation: 'fadeUp 0.4s ease', textAlign: 'center', paddingTop: 16 }}>
                      <div className="phone-header"><div className="phone-logo">RedThread 🩸</div></div>
                      <div style={{ fontSize: 52, marginBottom: 10, animation: 'heartbeat 1s ease infinite' }}>🩸</div>
                      <div style={{ fontSize: 18, fontWeight: 900, color: '#111', marginBottom: 6 }}>You're a Hero!</div>
                      <div style={{ fontSize: 12, color: '#666', lineHeight: 1.6 }}>Head to Apollo Hospital now.</div>
                      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: 10, marginTop: 14, fontSize: 12, color: '#16a34a', fontWeight: 600 }}>✅ Hospital notified</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Impact */}
      <div className="impact-bg sec-wrap" id="impact" data-section="impact">
        <div className="impact-bg-pattern" />
        <div className="section" style={{ position: 'relative' }}>
          <div className={`reveal ${isVisible('impact') ? 'visible' : ''}`}>
            <div className="section-tag" style={{ color: 'rgba(255,255,255,0.6)' }}>Real Stories</div>
          </div>
          <h2 className={`impact-title reveal ${isVisible('impact') ? 'visible' : ''}`} style={{ transitionDelay: '100ms' }}>Lives changed<br />by RedThread.</h2>
          <p className={`impact-sub reveal ${isVisible('impact') ? 'visible' : ''}`} style={{ transitionDelay: '200ms' }}>Real stories from donors, patients, and hospitals who experienced the power of fast, hyperlocal matching.</p>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className={`testimonial-card ${isVisible('impact') ? 'visible' : ''}`} style={{ transitionDelay: `${300 + i * 150}ms` }}>
                <div className="quote-mark">"</div>
                <div className="quote-text">{t.quote}</div>
                <div className="quote-avatar">{t.avatar}</div>
                <div className="quote-name">{t.name}</div>
                <div className="quote-role">{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="map-section" id="map" data-section="map">
        <div className="map-inner">
          <div className={`reveal ${isVisible('map') ? 'visible' : ''}`}>
            <div className="section-tag">Live Donor Map</div>
            <h2 className="section-title">Donors near you,<br />right now.</h2>
            <p className="section-sub">Real-time donor availability across your city. Every dot is a potential lifesaver.</p>
          </div>
          <div className={`map-container reveal-scale ${isVisible('map') ? 'visible' : ''}`} style={{ transitionDelay: '200ms' }}>
            <div className="map-bg-grad" />
            <div className="map-grid" />
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
              <path d="M 0 240 Q 200 200 400 240 T 800 220" stroke="rgba(185,28,28,0.08)" strokeWidth="3" fill="none" strokeDasharray="8 4" />
              <path d="M 100 0 Q 200 150 180 480" stroke="rgba(185,28,28,0.06)" strokeWidth="2" fill="none" strokeDasharray="6 4" />
              <path d="M 400 0 Q 350 200 380 480" stroke="rgba(185,28,28,0.06)" strokeWidth="2" fill="none" strokeDasharray="6 4" />
              <path d="M 0 160 Q 400 140 800 180" stroke="rgba(185,28,28,0.05)" strokeWidth="2" fill="none" />
              <path d="M 0 320 Q 300 300 600 340 T 900 310" stroke="rgba(185,28,28,0.05)" strokeWidth="2" fill="none" />
              <line x1="50%" y1="50%" x2={`${mapDots[activeDotIndex].x}%`} y2={`${mapDots[activeDotIndex].y}%`} stroke="#B91C1C" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.5">
                <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="1s" repeatCount="indefinite" />
              </line>
            </svg>
            {/* Hospital */}
            <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', zIndex: 3 }}>
              <div style={{ width: 36, height: 36, background: 'white', border: '2.5px solid #B91C1C', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, boxShadow: '0 4px 16px rgba(185,28,28,0.25)' }}>🏥</div>
              <div style={{ position: 'absolute', bottom: -22, left: '50%', transform: 'translateX(-50%)', fontSize: 9, fontWeight: 700, color: '#B91C1C', whiteSpace: 'nowrap', background: 'white', padding: '2px 5px', borderRadius: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>Apollo Hospital</div>
            </div>
            {mapDots.map((dot, i) => (
              <div key={i} style={{ position: 'absolute', left: `${dot.x}%`, top: `${dot.y}%`, zIndex: 2 }}>
                <div
                  className={`map-dot ${dot.active ? 'active' : 'inactive'} ${dot.size} ${activeDotIndex === i ? 'highlighted' : ''}`}
                  style={{ position: 'relative', transform: 'translate(-50%,-50%)' }}
                  onMouseEnter={() => setHoveredDot(i)}
                  onMouseLeave={() => setHoveredDot(null)}
                />
                {hoveredDot === i && (
                  <div className="map-tooltip" style={{ left: 0, top: 0 }}>
                    <div className="tooltip-name">{dot.name}</div>
                    <div className="tooltip-blood">🩸 {dot.blood} · {dot.active ? '✓ Available' : '✗ Unavailable'}</div>
                  </div>
                )}
              </div>
            ))}
            <div className="map-overlay map-title-ov">🗺 Delhi NCR — Live View</div>
            <div className="map-overlay map-count-ov">🟢 {mapDots.filter(d => d.active).length} Active</div>
            <div className="map-overlay map-legend-ov">
              <div className="legend-item"><div className="legend-dot" style={{ background: '#B91C1C' }} />Available donor</div>
              <div className="legend-item"><div className="legend-dot" style={{ background: '#d1d5db' }} />Unavailable</div>
              <div className="legend-item"><span style={{ fontSize: 12 }}>🏥</span> Hospital</div>
            </div>
            <div className="map-overlay map-req-ov">
              <div className="map-req-title">🚨 Active Request</div>
              <div className="map-req-detail">Apollo Hospital · O− Blood</div>
              <div className="map-req-badge">Critical · {mapDots.filter(d => d.active)[activeDotIndex % mapDots.filter(d => d.active).length]?.name} responding</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="cta-section" data-section="cta">
        <div className="cta-bg" />
        <h2 className={`cta-title reveal ${isVisible('cta') ? 'visible' : ''}`}>
          Be the reason<br />
          <span style={{ background: 'linear-gradient(135deg,#B91C1C,#ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            someone survives.
          </span>
        </h2>
        <p className={`cta-sub reveal ${isVisible('cta') ? 'visible' : ''}`} style={{ transitionDelay: '100ms' }}>
          Join thousands of donors and hospitals already using RedThread to save lives every day.
        </p>
        <div className={`cta-btns reveal ${isVisible('cta') ? 'visible' : ''}`} style={{ transitionDelay: '200ms' }}>
          <button className="btn-hero-primary" onClick={() => navigate('/register')}>🩸 Become a Donor</button>
          <button className="btn-hero-secondary" onClick={() => navigate('/register')}>Register Hospital →</button>
        </div>
        <div className={`cta-trust reveal ${isVisible('cta') ? 'visible' : ''}`} style={{ transitionDelay: '300ms' }}>
          <div className="trust-item">✅ Free to join</div>
          <div className="trust-item">🔒 Secure & private</div>
          <div className="trust-item">⚡ Real-time matching</div>
          <div className="trust-item">🌍 Available 24/7</div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-top">
          <div>
            <div className="footer-logo">RedThread 🩸</div>
            <div className="footer-tagline">Connecting lives, one drop at a time.</div>
          </div>
          <div className="footer-links">
            <div>
              <div className="footer-col-title">Platform</div>
              <div className="footer-link" onClick={() => navigate('/register')}>Become a Donor</div>
              <div className="footer-link" onClick={() => navigate('/register')}>Register Hospital</div>
              <div className="footer-link" onClick={() => navigate('/login')}>Login</div>
            </div>
            <div>
              <div className="footer-col-title">Features</div>
              <div className="footer-link">Real-time Matching</div>
              <div className="footer-link">Emergency Alerts</div>
              <div className="footer-link">Donor Dashboard</div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copy">© 2026 RedThread. All rights reserved.</div>
          <div className="footer-copy">Made with <span className="footer-heart">❤️</span> to save lives</div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
