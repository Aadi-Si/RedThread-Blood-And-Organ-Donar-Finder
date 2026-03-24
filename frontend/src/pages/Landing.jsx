import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [loaded, setLoaded] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [counts, setCounts] = useState({
    donors: 0,
    lives: 0,
    hospitals: 0,
    cities: 0,
  });
  const [activeStep, setActiveStep] = useState(0);
  const [visibleSections, setVisibleSections] = useState({});
  const [hoveredDot, setHoveredDot] = useState(null);
  const [activeDotIndex, setActiveDotIndex] = useState(0);
  const statsRef = useRef(null);

  const mapDots = [
    { x: 28, y: 35, size: "lg", active: true, name: "Rahul S.", blood: "A+" },
    { x: 45, y: 28, size: "md", active: true, name: "Priya M.", blood: "O-" },
    { x: 62, y: 42, size: "sm", active: false, name: "Amit K.", blood: "B+" },
    { x: 35, y: 55, size: "md", active: true, name: "Neha R.", blood: "AB+" },
    { x: 72, y: 30, size: "lg", active: true, name: "Vikram P.", blood: "O+" },
    { x: 55, y: 65, size: "sm", active: true, name: "Sona T.", blood: "A-" },
    { x: 20, y: 60, size: "md", active: false, name: "Raj D.", blood: "B-" },
    { x: 80, y: 55, size: "sm", active: true, name: "Meera J.", blood: "O+" },
    { x: 48, y: 75, size: "md", active: true, name: "Arjun N.", blood: "A+" },
    { x: 15, y: 45, size: "sm", active: false, name: "Divya S.", blood: "B+" },
    { x: 68, y: 72, size: "lg", active: true, name: "Karan M.", blood: "O-" },
    { x: 38, y: 20, size: "sm", active: true, name: "Anita V.", blood: "AB-" },
  ];

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouse = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouse);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !statsVisible) {
          setStatsVisible(true);
          animateCount("donors", 0, 2400, 2000);
          animateCount("lives", 0, 980, 2000);
          animateCount("hospitals", 0, 142, 1500);
          animateCount("cities", 0, 38, 1200);
        }
      },
      { threshold: 0.3 },
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, [statsVisible]);

  useEffect(() => {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({
              ...prev,
              [entry.target.dataset.section]: true,
            }));
          }
        });
      },
      { threshold: 0.08 },
    );
    document
      .querySelectorAll("[data-section]")
      .forEach((el) => sectionObserver.observe(el));
    return () => sectionObserver.disconnect();
  }, [loaded]);

  useEffect(() => {
    const interval = setInterval(
      () => setActiveStep((prev) => (prev + 1) % 4),
      2500,
    );
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const activeDots = mapDots
      .map((d, i) => ({ ...d, i }))
      .filter((d) => d.active);
    let idx = 0;
    const interval = setInterval(() => {
      setActiveDotIndex(activeDots[idx % activeDots.length].i);
      idx++;
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const animateCount = (key, start, end, duration) => {
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCounts((prev) => ({
        ...prev,
        [key]: Math.floor(start + (end - start) * eased),
      }));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const isVisible = (section) => visibleSections[section];

  const features = [
    {
      icon: "⚡",
      title: "Real-Time Matching",
      desc: "Instant donor-to-hospital connections based on blood type and proximity within seconds.",
      bg: "#fef2f2",
      border: "#fecaca",
    },
    {
      icon: "📍",
      title: "Location-Based Search",
      desc: "Hyperlocal 10km radius matching finds donors who can actually arrive in time.",
      bg: "#fff7ed",
      border: "#fed7aa",
    },
    {
      icon: "🔔",
      title: "Emergency Alerts",
      desc: "Critical requests trigger immediate email notifications to all matching donors.",
      bg: "#fdf4ff",
      border: "#e9d5ff",
    },
    {
      icon: "✅",
      title: "Verified Donors",
      desc: "Every donor profile verified with blood type and real-time availability status.",
      bg: "#f0fdf4",
      border: "#bbf7d0",
    },
    {
      icon: "🏥",
      title: "Hospital Dashboard",
      desc: "Hospitals manage requests, track responses, and coordinate donations seamlessly.",
      bg: "#eff6ff",
      border: "#bfdbfe",
    },
    {
      icon: "📊",
      title: "Donation History",
      desc: "Complete audit trail of every donation and request for full transparency.",
      bg: "#fefce8",
      border: "#fde68a",
    },
  ];

  const steps = [
    {
      num: "01",
      title: "Register",
      desc: "Sign up as a donor or hospital. Takes under 2 minutes.",
      icon: "📋",
      color: "#B91C1C",
    },
    {
      num: "02",
      title: "Set Profile",
      desc: "Donors set blood type, location, and availability status.",
      icon: "📍",
      color: "#991B1B",
    },
    {
      num: "03",
      title: "Get Matched",
      desc: "Hospitals post requests. Nearby donors get notified instantly.",
      icon: "🔔",
      color: "#7F1D1D",
    },
    {
      num: "04",
      title: "Save a Life",
      desc: "Donor accepts, heads to hospital. A life is saved.",
      icon: "🩸",
      color: "#450A0A",
    },
  ];

  const testimonials = [
    {
      quote:
        "RedThread notified me within seconds. I was at the hospital in 20 minutes. The patient survived.",
      name: "Arjun Mehta",
      role: "Blood Donor, Delhi",
      avatar: "AM",
    },
    {
      quote:
        "We posted a critical O- request at 2am. Three donors responded within minutes. Incredible platform.",
      name: "Dr. Priya Sharma",
      role: "Chief Surgeon, Apollo Hospital",
      avatar: "PS",
    },
    {
      quote:
        "My daughter needed a rare blood type. RedThread found a matching donor 4km away in under 5 minutes.",
      name: "Sunita Kapoor",
      role: "Patient's Mother, Mumbai",
      avatar: "SK",
    },
  ];

  const dotSizeClass = (size) => {
    if (size === "lg") return "w-4 h-4 md:w-[18px] md:h-[18px]";
    if (size === "md") return "w-3 h-3 md:w-[13px] md:h-[13px]";
    return "w-2 h-2 md:w-[9px] md:h-[9px]";
  };

  return (
    <div className="font-inter bg-[#fafafa] text-[#111] overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800&display=swap');

        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { font-family: 'Inter', 'Poppins', sans-serif; }

        /* ---- Keyframe animations ---- */
        @keyframes preloaderPulse {
          from { opacity: 0.6; transform: scale(0.98); }
          to   { opacity: 1;   transform: scale(1);    }
        }
        @keyframes heartbeat {
          0%,100% { transform: scale(1);    }
          14%     { transform: scale(1.2);  }
          28%     { transform: scale(1);    }
          42%     { transform: scale(1.15); }
          70%     { transform: scale(1);    }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes float {
          0%,100% { transform: translateY(0);     }
          50%     { transform: translateY(-12px);  }
        }
        @keyframes ringPulse {
          0%   { opacity: 0.8; transform: translate(-50%,-50%) scale(0.8); }
          100% { opacity: 0;   transform: translate(-50%,-50%) scale(1.5); }
        }
        @keyframes mapPulse {
          0%,100% { box-shadow: 0 0 0 4px rgba(185,28,28,0.15); }
          50%     { box-shadow: 0 0 0 12px rgba(185,28,28,0.05); }
        }
        @keyframes countPulse {
          0%,100% { box-shadow: 0 0 0 0   rgba(185,28,28,0.4); }
          50%     { box-shadow: 0 0 0 8px rgba(185,28,28,0);   }
        }
        @keyframes threadMove1 {
          from { transform: translate(0,0);     }
          to   { transform: translate(-200px,50px); }
        }
        @keyframes threadMove2 {
          from { transform: translate(0,0);      }
          to   { transform: translate(-150px,-30px); }
        }
        @keyframes threadMove3 {
          from { transform: translate(0,0); }
          to   { transform: translate(80px,0); }
        }
        @keyframes dashOffset {
          from { stroke-dashoffset: 0;   }
          to   { stroke-dashoffset: -20; }
        }

        /* ---- Utility animation classes ---- */
        .anim-preloader-pulse { animation: preloaderPulse 0.8s ease infinite alternate; }
        .anim-heartbeat       { animation: heartbeat 1.2s ease infinite; display: inline-block; }
        .anim-heartbeat-slow  { animation: heartbeat 1s ease infinite;  }
        .anim-float           { animation: float 4s ease infinite; }
        .anim-float-delay     { animation: float 4s ease 2s infinite; }
        .anim-ring            { animation: ringPulse 3s ease infinite; }
        .anim-ring-delay      { animation: ringPulse 3s ease 1s infinite; }
        .anim-fade-in         { animation: fadeIn 1s ease 1s forwards; opacity: 0; }
        .anim-map-pulse-lg    { animation: mapPulse 2s ease infinite; }
        .anim-map-pulse-md    { animation: mapPulse 2s ease 0.5s infinite; }
        .anim-count-pulse     { animation: countPulse 2s ease infinite; }
        .anim-thread-1        { animation: threadMove1 8s linear infinite; }
        .anim-thread-2        { animation: threadMove2 10s linear infinite; }
        .anim-thread-3        { animation: threadMove3 12s linear infinite; }
        .anim-dash-offset     { animation: dashOffset 1s linear infinite; }

        /* Hero entrance animations */
        .hero-badge-anim    { opacity: 0; transform: translateY(20px); animation: fadeUp 0.7s ease 0.3s forwards; }
        .hero-title-anim    { opacity: 0; transform: translateY(20px); animation: fadeUp 0.7s ease 0.5s forwards; }
        .hero-sub-anim      { opacity: 0; transform: translateY(20px); animation: fadeUp 0.7s ease 0.7s forwards; }
        .hero-btns-anim     { opacity: 0; transform: translateY(20px); animation: fadeUp 0.7s ease 0.9s forwards; }
        .step-desc-anim     { animation: fadeUp 0.3s ease; }
        .phone-content-anim { animation: fadeUp 0.4s ease; }

        /* Reveal on scroll */
        .reveal {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .reveal-scale {
          opacity: 0;
          transform: scale(0.95);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .reveal-scale.visible {
          opacity: 1;
          transform: scale(1);
        }

        /* Gradient text */
        .gradient-text {
          background: linear-gradient(135deg, #B91C1C 0%, #ef4444 50%, #f87171 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .gradient-text-red {
          background: linear-gradient(135deg, #B91C1C, #ef4444);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Map dot highlighted */
        .map-dot-highlighted {
          transform: translate(-50%,-50%) scale(1.5) !important;
          box-shadow: 0 0 0 8px rgba(185,28,28,0.25) !important;
        }

        /* Feature card hover */
        .feature-card {
          transition: all 0.4s cubic-bezier(0.34,1.56,0.64,1);
          opacity: 0;
          transform: translateY(30px);
        }
        .feature-card.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .feature-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 24px 60px rgba(185,28,28,0.12);
        }
        .feature-card:hover .feature-icon {
          transform: scale(1.2) rotate(-5deg);
        }
        .feature-icon {
          transition: transform 0.3s;
        }

        /* Testimonial card */
        .testimonial-card {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.4s;
        }
        .testimonial-card.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .testimonial-card:hover {
          background: rgba(255,255,255,0.18) !important;
          transform: translateY(-6px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
        }

        /* Responsive */
        @media (max-width: 1100px) { .hero-visual { display: none; } }
        @media (max-width: 1024px) {
          .nav-links { display: none; }
          .steps-visual { display: none; }
        }
        @media (max-width: 768px) {
          .nav-links { display: none; }
          .cursor-glow { display: none; }
          .steps-visual { display: none; }
          .map-legend-ov { display: none; }
          .map-req-ov { display: none; }
        }
        @media (max-width: 480px) {
          .btn-outline-nav { display: none; }
          .badge-text-span { display: none; }
        }
        @media (max-width: 360px) {
          .hero-btns-wrap { flex-direction: column; }
          .cta-btns-wrap  { flex-direction: column; align-items: center; }
        }
      `}</style>

      {/* ─── Preloader ─── */}
      <div
        className={`fixed inset-0 z-[9999] bg-[#B91C1C] flex items-center justify-center transition-all duration-700 ${loaded ? "opacity-0 invisible pointer-events-none" : "opacity-100 visible"}`}
      >
        <div className="text-[clamp(24px,5vw,32px)] font-black text-white tracking-tight anim-preloader-pulse">
          RedThread 🩸
        </div>
      </div>

      {/* ─── Cursor glow ─── */}
      <div
        className="cursor-glow fixed w-[500px] h-[500px] rounded-full pointer-events-none z-0 transition-[left,top] duration-150"
        style={{
          background:
            "radial-gradient(circle, rgba(185,28,28,0.06) 0%, transparent 70%)",
          left: mousePos.x - 250,
          top: mousePos.y - 250,
        }}
      />

      {/* ─── Navbar ─── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] px-[clamp(16px,4vw,64px)] h-[68px] flex justify-between items-center transition-all duration-300 ${scrollY > 20 ? "bg-white/95 backdrop-blur-xl shadow-[0_1px_40px_rgba(0,0,0,0.08)]" : ""}`}
      >
        <div
          className="text-[clamp(16px,2vw,20px)] font-black text-[#B91C1C] tracking-tight cursor-pointer whitespace-nowrap"
          onClick={() => window.scrollTo(0, 0)}
        >
          RedThread 🩸
        </div>

        <div className="nav-links flex gap-[clamp(16px,3vw,40px)] items-center">
          {["#features", "#how", "#impact", "#map"].map((href, i) => (
            <a
              key={i}
              href={href}
              className="text-sm font-medium text-[#555] hover:text-[#B91C1C] transition-colors duration-200 no-underline whitespace-nowrap"
            >
              {["Features", "How it works", "Impact", "Map"][i]}
            </a>
          ))}
        </div>

        <div className="flex gap-2 items-center">
          <button
            className="btn-outline-nav bg-transparent border-[1.5px] border-[#B91C1C] text-[#B91C1C] px-[clamp(14px,2vw,24px)] py-[9px] rounded-full text-[clamp(12px,1.5vw,14px)] font-semibold cursor-pointer font-[inherit] transition-all duration-200 whitespace-nowrap hover:bg-[#B91C1C] hover:text-white hover:-translate-y-px"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <button
            className="bg-[#B91C1C] border-none text-white px-[clamp(14px,2vw,24px)] py-[9px] rounded-full text-[clamp(12px,1.5vw,14px)] font-semibold cursor-pointer font-[inherit] transition-all duration-200 shadow-[0_4px_20px_rgba(185,28,28,0.35)] whitespace-nowrap hover:bg-[#991B1B] hover:-translate-y-px hover:shadow-[0_8px_30px_rgba(185,28,28,0.45)]"
            onClick={() => navigate("/register")}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section
        className="min-h-svh flex items-center pt-[clamp(80px,12vh,120px)] pb-[clamp(60px,8vh,80px)] px-[clamp(16px,4vw,64px)] relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg,#fff 0%,#fff5f5 50%,#fff 100%)",
        }}
      >
        {/* Background circles */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: "min(800px,90vw)",
            height: "min(800px,90vw)",
            background:
              "radial-gradient(circle,rgba(185,28,28,0.06) 0%,transparent 70%)",
            right: "-20%",
            top: "-20%",
          }}
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: "min(400px,60vw)",
            height: "min(400px,60vw)",
            background:
              "radial-gradient(circle,rgba(185,28,28,0.04) 0%,transparent 70%)",
            left: "-10%",
            bottom: "-10%",
          }}
        />

        {/* Animated threads */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg
            width="100%"
            height="100%"
            className="absolute inset-0 opacity-40"
          >
            <defs>
              <linearGradient
                id="threadGrad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#B91C1C" stopOpacity="0" />
                <stop offset="50%" stopColor="#B91C1C" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#B91C1C" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M 0 200 Q 400 100 800 300 T 1600 200"
              stroke="url(#threadGrad)"
              strokeWidth="1.5"
              fill="none"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                from="0 0"
                to="-200 50"
                dur="8s"
                repeatCount="indefinite"
              />
            </path>
            <path
              d="M 0 400 Q 300 250 700 450 T 1600 350"
              stroke="url(#threadGrad)"
              strokeWidth="1"
              fill="none"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                from="0 0"
                to="-150 -30"
                dur="10s"
                repeatCount="indefinite"
              />
            </path>
            <path
              d="M 200 0 Q 500 300 400 600"
              stroke="url(#threadGrad)"
              strokeWidth="1"
              fill="none"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                from="0 0"
                to="80 0"
                dur="12s"
                repeatCount="indefinite"
              />
            </path>
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-[1] max-w-[min(680px,100%)] w-full">
          <div className="inline-flex items-center gap-2 bg-[rgba(185,28,28,0.08)] border border-[rgba(185,28,28,0.2)] text-[#B91C1C] px-4 py-2 rounded-full text-[clamp(11px,1.5vw,13px)] font-semibold mb-[clamp(16px,3vh,28px)] max-w-full hero-badge-anim">
            <span className="anim-heartbeat flex-shrink-0">🩸</span>
            <span className="badge-text-span">
              Connecting Lives in Real Time
            </span>
          </div>

          <h1 className="text-[clamp(36px,6vw,80px)] font-black leading-[1.05] tracking-[-clamp(1px,0.05em,2.5px)] mb-[clamp(14px,2.5vh,24px)] hero-title-anim break-words">
            Connecting Lives,
            <br />
            <span className="gradient-text">One Drop at a Time.</span>
          </h1>

          <p className="text-[clamp(15px,2vw,18px)] text-[#666] leading-[1.7] max-w-[520px] mb-[clamp(24px,4vh,40px)] font-normal hero-sub-anim">
            RedThread matches blood donors with hospitals and patients instantly
            — based on location, blood type, and availability. Because every
            second matters.
          </p>

          <div className="hero-btns-wrap flex gap-3 flex-wrap hero-btns-anim">
            <button
              className="bg-[#B91C1C] text-white border-none px-[clamp(24px,3vw,40px)] py-[clamp(12px,2vh,16px)] rounded-full text-[clamp(14px,1.8vw,16px)] font-bold cursor-pointer font-[inherit] transition-all duration-300 shadow-[0_8px_30px_rgba(185,28,28,0.35)] flex items-center gap-2 whitespace-nowrap hover:bg-[#991B1B] hover:-translate-y-[3px] hover:shadow-[0_16px_40px_rgba(185,28,28,0.45)]"
              onClick={() => navigate("/register")}
            >
              🩸 Find Donors
            </button>
            <button
              className="bg-white text-[#B91C1C] border-2 border-[rgba(185,28,28,0.2)] px-[clamp(24px,3vw,40px)] py-[clamp(12px,2vh,16px)] rounded-full text-[clamp(14px,1.8vw,16px)] font-semibold cursor-pointer font-[inherit] transition-all duration-300 whitespace-nowrap hover:border-[#B91C1C] hover:-translate-y-[3px] hover:shadow-[0_8px_20px_rgba(185,28,28,0.15)]"
              onClick={() => navigate("/register")}
            >
              Become a Donor →
            </button>
          </div>
        </div>

        {/* Floating hero visual */}
        <div className="hero-visual absolute top-1/2 -translate-y-1/2 right-[clamp(16px,4vw,64px)] w-[clamp(320px,35vw,500px)] h-[clamp(320px,35vw,500px)] anim-fade-in">
          {/* Rings */}
          <div
            className="anim-ring absolute rounded-full border border-[rgba(185,28,28,0.15)]"
            style={{
              width: 300,
              height: 300,
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
            }}
          />
          <div
            className="anim-ring-delay absolute rounded-full border border-[rgba(185,28,28,0.15)]"
            style={{
              width: 420,
              height: 420,
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
            }}
          />

          {/* Main card */}
          <div className="bg-white rounded-[20px] p-[clamp(16px,2vw,24px)] shadow-[0_20px_60px_rgba(0,0,0,0.1)] absolute w-[clamp(200px,22vw,300px)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="text-[11px] font-bold text-[#999] tracking-[1px] uppercase mb-[10px]">
              Blood Request — Critical
            </div>
            <div className="text-[clamp(32px,4vw,48px)] font-black text-[#B91C1C] tracking-[-2px] leading-none">
              O−
            </div>
            <div className="text-[clamp(11px,1.2vw,13px)] text-[#666] mt-2">
              🏥 Apollo Hospital, Delhi
            </div>
            <div className="mt-4 px-4 py-[10px] bg-[#fef2f2] rounded-[10px] text-[13px] text-[#B91C1C] font-semibold">
              ⚡ 3 donors notified nearby
            </div>
          </div>

          {/* Notify card */}
          <div className="bg-white rounded-[20px] p-[clamp(16px,2vw,24px)] shadow-[0_20px_60px_rgba(0,0,0,0.1)] absolute w-[clamp(160px,18vw,220px)] top-[10%] right-0 anim-float">
            <div className="text-[clamp(20px,2.5vw,28px)] mb-2">🔔</div>
            <div className="text-[clamp(12px,1.3vw,14px)] font-bold text-[#111]">
              Urgent Request Nearby!
            </div>
            <div className="text-[clamp(10px,1.1vw,12px)] text-[#666] mt-1">
              Apollo Hospital needs O− blood
            </div>
            <div className="text-[clamp(10px,1vw,11px)] text-[#B91C1C] font-semibold mt-2">
              Just now · 2.4km away
            </div>
          </div>

          {/* Donor card */}
          <div className="bg-white rounded-[20px] p-[clamp(16px,2vw,24px)] shadow-[0_20px_60px_rgba(0,0,0,0.1)] absolute w-[clamp(150px,16vw,200px)] bottom-[10%] left-0 anim-float-delay">
            <div className="text-[clamp(13px,1.4vw,15px)] font-bold text-[#111]">
              Arjun Mehta
            </div>
            <div className="text-[clamp(10px,1.1vw,12px)] text-[#666] mt-1">
              🩸 O− · Available Now
            </div>
            <div className="inline-block bg-[#dcfce7] text-[#16a34a] text-[clamp(9px,1vw,11px)] font-bold px-[10px] py-[3px] rounded-full mt-2">
              ✓ Verified Donor
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats ─── */}
      <div
        ref={statsRef}
        className="py-[clamp(40px,6vh,80px)] px-[clamp(16px,4vw,64px)] bg-white border-t border-b border-[#f0f0f0]"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 max-w-[1100px] mx-auto">
          {[
            {
              num: counts.donors.toLocaleString() + "+",
              label: "Registered Donors",
            },
            { num: counts.lives + "+", label: "Lives Saved" },
            { num: counts.hospitals + "+", label: "Partner Hospitals" },
            { num: counts.cities + "+", label: "Cities Covered" },
          ].map((s, i) => (
            <div
              key={i}
              className="py-[clamp(16px,3vh,24px)] px-[clamp(12px,3vw,40px)] text-center border-r border-[#f0f0f0] last:border-r-0 max-md:border-r-0 max-md:border-b max-md:last:border-b-0"
              style={{
                borderRight:
                  i === 1
                    ? window.innerWidth <= 768
                      ? "none"
                      : undefined
                    : undefined,
                borderLeft:
                  i === 1 || i === 3
                    ? window.innerWidth <= 768
                      ? "none"
                      : undefined
                    : undefined,
              }}
            >
              <div
                className="text-[clamp(28px,5vw,52px)] font-black tracking-[-2px] leading-none"
                style={{
                  background: "linear-gradient(135deg,#B91C1C,#ef4444)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {s.num}
              </div>
              <div className="text-[clamp(11px,1.2vw,14px)] text-[#888] font-medium mt-2">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Features ─── */}
      <div
        id="features"
        data-section="features"
        className="bg-[#fafafa] py-[clamp(60px,10vh,120px)] px-[clamp(16px,4vw,64px)]"
      >
        <div className="max-w-[1200px] mx-auto">
          <div className={`reveal ${isVisible("features") ? "visible" : ""}`}>
            <div className="text-[clamp(10px,1.2vw,12px)] font-bold text-[#B91C1C] tracking-[3px] uppercase mb-4">
              Why RedThread
            </div>
            <h2 className="text-[clamp(26px,4vw,52px)] font-extrabold tracking-tight leading-[1.1] mb-4">
              Everything you need
              <br />
              to save a life.
            </h2>
            <p className="text-[clamp(14px,1.6vw,16px)] text-[#666] max-w-[480px] leading-[1.7]">
              Built for speed, reliability, and real-world impact in critical
              medical situations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[clamp(12px,2vw,20px)] mt-[clamp(32px,5vh,64px)]">
            {features.map((f, i) => (
              <div
                key={i}
                className={`feature-card rounded-[20px] p-[clamp(20px,3vw,36px)] border-[1.5px] cursor-default ${isVisible("features") ? "visible" : ""}`}
                style={{
                  background: f.bg,
                  borderColor: f.border,
                  transitionDelay: `${i * 100}ms`,
                }}
              >
                <span className="feature-icon text-[clamp(28px,3.5vw,40px)] mb-[clamp(12px,2vh,20px)] block">
                  {f.icon}
                </span>
                <div className="text-[clamp(15px,1.8vw,18px)] font-bold mb-[10px] tracking-[-0.3px]">
                  {f.title}
                </div>
                <div className="text-[clamp(13px,1.4vw,14px)] text-[#666] leading-[1.7]">
                  {f.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Steps ─── */}
      <div
        id="how"
        data-section="steps"
        className="bg-white py-[clamp(60px,10vh,120px)] px-[clamp(16px,4vw,64px)]"
      >
        <div className="max-w-[1200px] mx-auto">
          <div className={`reveal ${isVisible("steps") ? "visible" : ""}`}>
            <div className="text-[clamp(10px,1.2vw,12px)] font-bold text-[#B91C1C] tracking-[3px] uppercase mb-4">
              How it works
            </div>
            <h2 className="text-[clamp(26px,4vw,52px)] font-extrabold tracking-tight leading-[1.1] mb-4">
              Simple steps.
              <br />
              Life-saving results.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(32px,6vw,80px)] items-center mt-[clamp(32px,5vh,64px)]">
            {/* Steps list */}
            <div className="flex flex-col">
              {steps.map((s, i) => (
                <div
                  key={i}
                  className={`flex gap-[clamp(12px,2vw,20px)] p-[clamp(14px,2vw,24px)] rounded-2xl cursor-pointer transition-all duration-300 border-2 ${activeStep === i ? "bg-[#fff5f5] border-[#fecaca]" : "border-transparent"}`}
                  onClick={() => setActiveStep(i)}
                >
                  <div
                    className="w-[clamp(44px,5vw,56px)] h-[clamp(44px,5vw,56px)] rounded-full flex items-center justify-center text-[clamp(16px,2vw,20px)] flex-shrink-0 transition-all duration-300"
                    style={{
                      background:
                        activeStep === i
                          ? `linear-gradient(135deg, ${s.color}, #ef4444)`
                          : "#e5e7eb",
                    }}
                  >
                    {s.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-[clamp(9px,1vw,11px)] font-bold text-[#B91C1C] tracking-[2px] uppercase mb-1">
                      {s.num}
                    </div>
                    <div className="text-[clamp(15px,1.8vw,18px)] font-bold mb-[6px]">
                      {s.title}
                    </div>
                    {activeStep === i && (
                      <div className="text-[clamp(12px,1.4vw,14px)] text-[#666] leading-[1.6] step-desc-anim">
                        {s.desc}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Phone visual */}
            <div className="steps-visual relative h-[clamp(340px,40vw,460px)] flex items-center justify-center">
              <div className="w-[clamp(200px,22vw,260px)] bg-white rounded-[32px] shadow-[0_32px_80px_rgba(0,0,0,0.15)] overflow-hidden border-[8px] border-[#111] transition-all duration-500">
                <div className="bg-[#111] py-2 text-center">
                  <div className="w-[60px] h-1 bg-[#333] rounded-sm mx-auto" />
                </div>
                <div
                  className="p-[clamp(14px,2vw,20px)] min-h-[clamp(300px,35vw,400px)]"
                  style={{ background: "linear-gradient(135deg,#fff5f5,#fff)" }}
                >
                  {activeStep === 0 && (
                    <div className="phone-content-anim">
                      <div className="flex justify-between items-center mb-[clamp(12px,2vh,20px)]">
                        <div className="text-[clamp(11px,1.3vw,14px)] font-black text-[#B91C1C]">
                          RedThread 🩸
                        </div>
                        <div className="text-[clamp(9px,1vw,11px)] text-[#16a34a] font-semibold bg-[#dcfce7] px-2 py-[3px] rounded-full">
                          ● Live
                        </div>
                      </div>
                      <div className="text-base font-extrabold mb-[14px] text-[#111]">
                        Create Account
                      </div>
                      {["Full Name", "Email", "Phone"].map((p, i) => (
                        <div
                          key={i}
                          className="bg-[#f9fafb] border-[1.5px] border-[#e5e7eb] rounded-[10px] px-[14px] py-[10px] mb-2 text-[13px] text-[#999]"
                        >
                          {p}
                        </div>
                      ))}
                      <div className="flex gap-2 mb-[14px]">
                        <div className="flex-1 bg-[#B91C1C] text-white py-[10px] rounded-[10px] text-center text-[13px] font-bold">
                          Donor
                        </div>
                        <div className="flex-1 bg-[#f3f4f6] text-[#666] py-[10px] rounded-[10px] text-center text-[13px]">
                          Hospital
                        </div>
                      </div>
                      <div className="bg-[#B91C1C] text-white py-3 rounded-[12px] text-center text-[14px] font-bold">
                        Register →
                      </div>
                    </div>
                  )}
                  {activeStep === 1 && (
                    <div className="phone-content-anim">
                      <div className="flex justify-between items-center mb-[14px]">
                        <div className="text-[clamp(11px,1.3vw,14px)] font-black text-[#B91C1C]">
                          RedThread 🩸
                        </div>
                        <div className="text-[clamp(9px,1vw,11px)] text-[#16a34a] font-semibold bg-[#dcfce7] px-2 py-[3px] rounded-full">
                          ✓ Done
                        </div>
                      </div>
                      <div className="text-[15px] font-extrabold mb-[14px] text-[#111]">
                        Set Your Profile
                      </div>
                      <div className="text-[11px] font-bold text-[#999] mb-2 uppercase tracking-[1px]">
                        Blood Type
                      </div>
                      <div className="flex flex-wrap gap-[5px] mb-3">
                        {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(
                          (bt, i) => (
                            <div
                              key={i}
                              className={`px-2 py-[5px] rounded-[8px] text-[11px] font-bold ${bt === "O-" ? "bg-[#B91C1C] text-white" : "bg-[#f3f4f6] text-[#666]"}`}
                            >
                              {bt}
                            </div>
                          ),
                        )}
                      </div>
                      <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-[10px] p-[10px] text-[12px] text-[#16a34a] font-semibold">
                        📍 Location captured — Delhi NCR
                      </div>
                      <div className="bg-[#B91C1C] text-white py-3 rounded-[12px] text-center text-[14px] font-bold mt-3">
                        Save →
                      </div>
                    </div>
                  )}
                  {activeStep === 2 && (
                    <div className="phone-content-anim">
                      <div className="flex justify-between items-center mb-[clamp(12px,2vh,20px)]">
                        <div className="text-[clamp(11px,1.3vw,14px)] font-black text-[#B91C1C]">
                          RedThread 🩸
                        </div>
                        <div className="text-[clamp(9px,1vw,11px)] text-[#16a34a] font-semibold bg-[#dcfce7] px-2 py-[3px] rounded-full">
                          ● Active
                        </div>
                      </div>
                      <div className="bg-[#fef2f2] border-[1.5px] border-[#fecaca] rounded-[14px] p-[14px] mb-3">
                        <div className="text-[10px] font-bold text-[#B91C1C] uppercase tracking-[1px] mb-[6px]">
                          🚨 Urgent Request
                        </div>
                        <div className="text-[26px] font-black text-[#B91C1C] tracking-[-1px]">
                          O−
                        </div>
                        <div className="text-[12px] text-[#666] mt-[3px]">
                          🏥 Apollo Hospital · 2.4km
                        </div>
                        <div className="text-[10px] text-[#B91C1C] font-semibold mt-1">
                          Critical · Just now
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1 bg-[#B91C1C] text-white py-[10px] rounded-[10px] text-center text-[13px] font-bold">
                          ✅ Accept
                        </div>
                        <div className="flex-1 bg-[#f3f4f6] text-[#666] py-[10px] rounded-[10px] text-center text-[13px]">
                          ❌ Reject
                        </div>
                      </div>
                    </div>
                  )}
                  {activeStep === 3 && (
                    <div className="phone-content-anim text-center pt-4">
                      <div className="flex justify-between items-center mb-[clamp(12px,2vh,20px)]">
                        <div className="text-[clamp(11px,1.3vw,14px)] font-black text-[#B91C1C]">
                          RedThread 🩸
                        </div>
                      </div>
                      <div className="text-[52px] mb-[10px] anim-heartbeat-slow">
                        🩸
                      </div>
                      <div className="text-[18px] font-black text-[#111] mb-[6px]">
                        You're a Hero!
                      </div>
                      <div className="text-[12px] text-[#666] leading-[1.6]">
                        Head to Apollo Hospital now.
                      </div>
                      <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-[12px] p-[10px] mt-[14px] text-[12px] text-[#16a34a] font-semibold">
                        ✅ Hospital notified
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Impact ─── */}
      <div
        id="impact"
        data-section="impact"
        className="py-[clamp(60px,10vh,120px)] px-[clamp(16px,4vw,64px)] relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg,#7F1D1D 0%,#B91C1C 50%,#DC2626 100%)",
        }}
      >
        {/* Pattern */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle,rgba(255,255,255,0.05) 1px,transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        <div className="max-w-[1200px] mx-auto relative">
          <div className={`reveal ${isVisible("impact") ? "visible" : ""}`}>
            <div className="text-[clamp(10px,1.2vw,12px)] font-bold text-[rgba(255,255,255,0.6)] tracking-[3px] uppercase mb-4">
              Real Stories
            </div>
          </div>
          <h2
            className={`text-[clamp(28px,5vw,64px)] font-black text-white tracking-[-2px] mb-5 reveal ${isVisible("impact") ? "visible" : ""}`}
            style={{ transitionDelay: "100ms" }}
          >
            Lives changed
            <br />
            by RedThread.
          </h2>
          <p
            className={`text-[clamp(14px,1.8vw,18px)] text-[rgba(255,255,255,0.7)] max-w-[520px] leading-[1.7] mb-[clamp(32px,5vh,64px)] reveal ${isVisible("impact") ? "visible" : ""}`}
            style={{ transitionDelay: "200ms" }}
          >
            Real stories from donors, patients, and hospitals who experienced
            the power of fast, hyperlocal matching.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[clamp(12px,2vw,24px)]">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className={`testimonial-card rounded-[20px] p-[clamp(20px,3vw,32px)] border border-[rgba(255,255,255,0.15)] ${isVisible("impact") ? "visible" : ""}`}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(20px)",
                  transitionDelay: `${300 + i * 150}ms`,
                }}
              >
                <div className="text-[clamp(36px,4vw,48px)] text-[rgba(255,255,255,0.3)] leading-none mb-4 font-serif">
                  "
                </div>
                <div className="text-[clamp(13px,1.5vw,15px)] text-[rgba(255,255,255,0.9)] leading-[1.7] mb-6 italic">
                  {t.quote}
                </div>
                <div className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.2)] flex items-center justify-center text-[14px] font-extrabold text-white mb-[10px]">
                  {t.avatar}
                </div>
                <div className="text-[clamp(13px,1.4vw,14px)] font-bold text-white">
                  {t.name}
                </div>
                <div className="text-[clamp(11px,1.2vw,12px)] text-[rgba(255,255,255,0.6)] mt-1">
                  {t.role}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Map ─── */}
      <div
        id="map"
        data-section="map"
        className="bg-[#fafafa] py-[clamp(60px,10vh,120px)] px-[clamp(16px,4vw,64px)]"
      >
        <div className="max-w-[1200px] mx-auto">
          <div className={`reveal ${isVisible("map") ? "visible" : ""}`}>
            <div className="text-[clamp(10px,1.2vw,12px)] font-bold text-[#B91C1C] tracking-[3px] uppercase mb-4">
              Live Donor Map
            </div>
            <h2 className="text-[clamp(26px,4vw,52px)] font-extrabold tracking-tight leading-[1.1] mb-4">
              Donors near you,
              <br />
              right now.
            </h2>
            <p className="text-[clamp(14px,1.6vw,16px)] text-[#666] max-w-[480px] leading-[1.7]">
              Real-time donor availability across your city. Every dot is a
              potential lifesaver.
            </p>
          </div>

          <div
            className={`relative mt-[clamp(32px,5vh,64px)] bg-white rounded-[24px] border border-[#f0f0f0] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.06)] h-[clamp(320px,45vw,480px)] reveal-scale ${isVisible("map") ? "visible" : ""}`}
            style={{ transitionDelay: "200ms" }}
          >
            {/* Map background */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg,#f8fafc 0%,#fff5f5 50%,#f8fafc 100%)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(185,28,28,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(185,28,28,0.04) 1px,transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            {/* SVG paths + active line */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-[1]">
              <path
                d="M 0 240 Q 200 200 400 240 T 800 220"
                stroke="rgba(185,28,28,0.08)"
                strokeWidth="3"
                fill="none"
                strokeDasharray="8 4"
              />
              <path
                d="M 100 0 Q 200 150 180 480"
                stroke="rgba(185,28,28,0.06)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="6 4"
              />
              <path
                d="M 400 0 Q 350 200 380 480"
                stroke="rgba(185,28,28,0.06)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="6 4"
              />
              <path
                d="M 0 160 Q 400 140 800 180"
                stroke="rgba(185,28,28,0.05)"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M 0 320 Q 300 300 600 340 T 900 310"
                stroke="rgba(185,28,28,0.05)"
                strokeWidth="2"
                fill="none"
              />
              <line
                x1="50%"
                y1="50%"
                x2={`${mapDots[activeDotIndex].x}%`}
                y2={`${mapDots[activeDotIndex].y}%`}
                stroke="#B91C1C"
                strokeWidth="1.5"
                strokeDasharray="6 4"
                opacity="0.5"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="0"
                  to="-20"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </line>
            </svg>

            {/* Hospital marker */}
            <div
              className="absolute z-[3]"
              style={{
                left: "50%",
                top: "50%",
                transform: "translate(-50%,-50%)",
              }}
            >
              <div className="w-9 h-9 bg-white border-[2.5px] border-[#B91C1C] rounded-full flex items-center justify-center text-base shadow-[0_4px_16px_rgba(185,28,28,0.25)]">
                🏥
              </div>
              <div className="absolute bottom-[-22px] left-1/2 -translate-x-1/2 text-[9px] font-bold text-[#B91C1C] whitespace-nowrap bg-white px-[5px] py-[2px] rounded-[4px] shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
                Apollo Hospital
              </div>
            </div>

            {/* Dots */}
            {mapDots.map((dot, i) => (
              <div
                key={i}
                className="absolute z-[2]"
                style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
              >
                <div
                  className={`rounded-full cursor-pointer transition-all duration-300 ${dot.active ? "bg-[#B91C1C]" : "bg-[#d1d5db]"} ${dotSizeClass(dot.size)} ${activeDotIndex === i ? "map-dot-highlighted" : "translate-x-[-50%] translate-y-[-50%]"} ${dot.active && dot.size === "lg" ? "anim-map-pulse-lg" : ""} ${dot.active && dot.size === "md" ? "anim-map-pulse-md" : ""}`}
                  style={{ position: "relative" }}
                  onMouseEnter={() => setHoveredDot(i)}
                  onMouseLeave={() => setHoveredDot(null)}
                />
                {hoveredDot === i && (
                  <div
                    className="absolute bg-white rounded-[12px] px-[14px] py-[10px] shadow-[0_8px_32px_rgba(0,0,0,0.15)] text-[12px] pointer-events-none z-10 whitespace-nowrap"
                    style={{
                      transform: "translate(-50%,-130%)",
                      left: 0,
                      top: 0,
                    }}
                  >
                    <div className="font-bold text-[#111]">{dot.name}</div>
                    <div className="text-[11px] text-[#B91C1C] font-semibold mt-[2px]">
                      🩸 {dot.blood} ·{" "}
                      {dot.active ? "✓ Available" : "✗ Unavailable"}
                    </div>
                    <div
                      className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white"
                      style={{ clipPath: "polygon(0 0,100% 0,50% 100%)" }}
                    />
                  </div>
                )}
              </div>
            ))}

            {/* Overlays */}
            <div className="absolute bg-white rounded-[10px] shadow-[0_4px_20px_rgba(0,0,0,0.1)] font-bold text-[#111] text-[clamp(11px,1.3vw,14px)] top-[clamp(12px,2vw,24px)] left-[clamp(12px,2vw,24px)] px-[clamp(12px,1.8vw,20px)] py-[clamp(8px,1.2vw,12px)]">
              🗺 Delhi NCR — Live View
            </div>
            <div className="absolute bg-[#B91C1C] text-white rounded-[10px] shadow-[0_4px_20px_rgba(0,0,0,0.1)] font-bold text-[clamp(11px,1.3vw,14px)] top-[clamp(12px,2vw,24px)] right-[clamp(12px,2vw,24px)] px-[clamp(12px,1.5vw,16px)] py-[clamp(8px,1vw,10px)] anim-count-pulse">
              🟢 {mapDots.filter((d) => d.active).length} Active
            </div>
            <div className="map-legend-ov absolute bg-white rounded-[10px] shadow-[0_4px_20px_rgba(0,0,0,0.1)] text-[clamp(11px,1.2vw,13px)] bottom-[clamp(12px,2vw,24px)] right-[clamp(12px,2vw,24px)] px-[clamp(12px,1.8vw,20px)] py-[clamp(10px,1.5vw,16px)]">
              <div className="flex items-center gap-2 mb-2 text-[#555]">
                <div className="w-[10px] h-[10px] rounded-full bg-[#B91C1C] flex-shrink-0" />{" "}
                Available donor
              </div>
              <div className="flex items-center gap-2 mb-2 text-[#555]">
                <div className="w-[10px] h-[10px] rounded-full bg-[#d1d5db] flex-shrink-0" />{" "}
                Unavailable
              </div>
              <div className="flex items-center gap-2 text-[#555]">
                <span className="text-[12px]">🏥</span> Hospital
              </div>
            </div>
            <div className="map-req-ov absolute bg-white rounded-[10px] shadow-[0_4px_20px_rgba(0,0,0,0.1)] text-[clamp(11px,1.3vw,14px)] bottom-[clamp(12px,2vw,24px)] left-[clamp(12px,2vw,24px)] px-[clamp(12px,1.8vw,18px)] py-[clamp(10px,1.5vw,14px)] max-w-[clamp(160px,20vw,220px)]">
              <div className="font-bold text-[#111] mb-1 text-[clamp(12px,1.4vw,14px)]">
                🚨 Active Request
              </div>
              <div className="text-[clamp(10px,1.1vw,12px)] text-[#666]">
                Apollo Hospital · O− Blood
              </div>
              <div className="inline-block bg-[#fef2f2] text-[#B91C1C] text-[clamp(9px,1vw,11px)] font-bold px-2 py-[3px] rounded-full mt-[6px]">
                Critical ·{" "}
                {
                  mapDots.filter((d) => d.active)[
                    activeDotIndex % mapDots.filter((d) => d.active).length
                  ]?.name
                }{" "}
                responding
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── CTA ─── */}
      <div
        data-section="cta"
        className="py-[clamp(80px,12vh,140px)] px-[clamp(16px,4vw,64px)] text-center bg-white relative overflow-hidden"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center,rgba(185,28,28,0.05) 0%,transparent 70%)",
          }}
        />

        <h2
          className={`text-[clamp(28px,6vw,72px)] font-black tracking-tight leading-[1.05] mb-5 relative reveal ${isVisible("cta") ? "visible" : ""}`}
        >
          Be the reason
          <br />
          <span className="gradient-text">someone survives.</span>
        </h2>
        <p
          className={`text-[clamp(15px,1.8vw,18px)] text-[#666] max-w-[480px] mx-auto mb-12 leading-[1.7] relative reveal ${isVisible("cta") ? "visible" : ""}`}
          style={{ transitionDelay: "100ms" }}
        >
          Join thousands of donors and hospitals already using RedThread to save
          lives every day.
        </p>
        <div
          className={`cta-btns-wrap flex gap-3 justify-center flex-wrap relative reveal ${isVisible("cta") ? "visible" : ""}`}
          style={{ transitionDelay: "200ms" }}
        >
          <button
            className="bg-[#B91C1C] text-white border-none px-[clamp(24px,3vw,40px)] py-[clamp(12px,2vh,16px)] rounded-full text-[clamp(14px,1.8vw,16px)] font-bold cursor-pointer font-[inherit] transition-all duration-300 shadow-[0_8px_30px_rgba(185,28,28,0.35)] flex items-center gap-2 hover:bg-[#991B1B] hover:-translate-y-[3px] hover:shadow-[0_16px_40px_rgba(185,28,28,0.45)]"
            onClick={() => navigate("/register")}
          >
            🩸 Become a Donor
          </button>
          <button
            className="bg-white text-[#B91C1C] border-2 border-[rgba(185,28,28,0.2)] px-[clamp(24px,3vw,40px)] py-[clamp(12px,2vh,16px)] rounded-full text-[clamp(14px,1.8vw,16px)] font-semibold cursor-pointer font-[inherit] transition-all duration-300 hover:border-[#B91C1C] hover:-translate-y-[3px] hover:shadow-[0_8px_20px_rgba(185,28,28,0.15)]"
            onClick={() => navigate("/register")}
          >
            Register Hospital →
          </button>
        </div>
        <div
          className={`flex items-center justify-center gap-[clamp(16px,3vw,32px)] mt-[clamp(24px,4vh,48px)] relative flex-wrap reveal ${isVisible("cta") ? "visible" : ""}`}
          style={{ transitionDelay: "300ms" }}
        >
          {[
            "✅ Free to join",
            "🔒 Secure & private",
            "⚡ Real-time matching",
            "🌍 Available 24/7",
          ].map((t, i) => (
            <div
              key={i}
              className="flex items-center gap-[6px] text-[clamp(12px,1.4vw,14px)] text-[#888] font-medium"
            >
              {t}
            </div>
          ))}
        </div>
      </div>

      {/* ─── Footer ─── */}
      <footer className="bg-[#111] text-white py-[clamp(40px,6vh,60px)] px-[clamp(16px,4vw,64px)] pb-[clamp(24px,4vh,40px)]">
        <div className="flex justify-between mb-[clamp(32px,5vh,48px)] gap-8 flex-wrap">
          <div>
            <div className="text-[clamp(18px,2vw,22px)] font-black text-[#ef4444] tracking-tight">
              RedThread 🩸
            </div>
            <div className="text-[clamp(12px,1.3vw,14px)] text-[#666] mt-2">
              Connecting lives, one drop at a time.
            </div>
          </div>
          <div className="flex gap-[clamp(32px,5vw,60px)] flex-wrap">
            <div>
              <div className="text-[clamp(10px,1.1vw,12px)] font-bold text-[#555] tracking-[2px] uppercase mb-4">
                Platform
              </div>
              {[
                ["Become a Donor", "/register"],
                ["Register Hospital", "/register"],
                ["Login", "/login"],
              ].map(([label, path], i) => (
                <div
                  key={i}
                  className="text-[clamp(12px,1.3vw,14px)] text-[#666] cursor-pointer transition-colors duration-200 hover:text-[#ef4444] mb-[10px]"
                  onClick={() => navigate(path)}
                >
                  {label}
                </div>
              ))}
            </div>
            <div>
              <div className="text-[clamp(10px,1.1vw,12px)] font-bold text-[#555] tracking-[2px] uppercase mb-4">
                Features
              </div>
              {[
                "Real-time Matching",
                "Emergency Alerts",
                "Donor Dashboard",
              ].map((l, i) => (
                <div
                  key={i}
                  className="text-[clamp(12px,1.3vw,14px)] text-[#666] cursor-pointer transition-colors duration-200 hover:text-[#ef4444] mb-[10px]"
                >
                  {l}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-[#222] pt-[clamp(16px,3vh,32px)] flex justify-between items-center flex-wrap gap-3">
          <div className="text-[clamp(11px,1.2vw,13px)] text-[#555]">
            © 2026 RedThread. All rights reserved.
          </div>
          <div className="text-[clamp(11px,1.2vw,13px)] text-[#555]">
            Made with <span className="text-[#ef4444]">❤️</span> to save lives
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
