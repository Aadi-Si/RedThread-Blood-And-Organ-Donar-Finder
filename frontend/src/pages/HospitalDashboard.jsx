import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthLoader from "../components/AuthLoader";

const HospitalDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("requests");
  const [showForm, setShowForm] = useState(false);
  const [posting, setPosting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    blood_type: "A+",
    urgency_level: "critical",
    message: "",
    latitude: "",
    longitude: "",
  });

  const token = localStorage.getItem("token");

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch("http://localhost:3000/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProfile(data.user);
    } catch (e) {}
  };

  const fetchRequests = async () => {
    try {
      const res = await fetch("http://localhost:3000/hospital/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRequests(data.history);
    } catch (e) {}
  };

  const handleGetLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData({
          ...formData,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        showToast("Location captured!");
      },
      () => showToast("Could not get location.", "error"),
    );
  };

  const handlePostRequest = async (e) => {
    e.preventDefault();
    setPosting(true);
    try {
      const res = await fetch("http://localhost:3000/hospital/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error, "error");
        return;
      }
      showToast(
        `🎉 Request posted! ${data.notified_donors} donor${data.notified_donors !== 1 ? "s" : ""} notified.`,
      );
      setShowForm(false);
      setFormData({
        blood_type: "A+",
        urgency_level: "critical",
        message: "",
        latitude: "",
        longitude: "",
      });
      fetchRequests();
    } catch (e) {
      showToast("Something went wrong.", "error");
    } finally {
      setPosting(false);
    }
  };

  const handleCloseRequest = async (requestId) => {
    try {
      const res = await fetch(
        `http://localhost:3000/hospital/request/${requestId}/close`,
        { method: "PUT", headers: { Authorization: `Bearer ${token}` } },
      );
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error, "error");
        return;
      }
      showToast("Request closed successfully.");
      fetchRequests();
    } catch (e) {}
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const urgencyConfig = {
    critical: {
      bg: "#fef2f2",
      color: "#B91C1C",
      border: "#fecaca",
      label: "🚨 Critical",
      dot: "#ef4444",
    },
    high: {
      bg: "#fff7ed",
      color: "#c2410c",
      border: "#fed7aa",
      label: "🔴 High",
      dot: "#f97316",
    },
    medium: {
      bg: "#fefce8",
      color: "#a16207",
      border: "#fde68a",
      label: "🟡 Medium",
      dot: "#eab308",
    },
    low: {
      bg: "#f0fdf4",
      color: "#15803d",
      border: "#bbf7d0",
      label: "🟢 Low",
      dot: "#22c55e",
    },
  };

  const activeCount = requests.filter((r) => r.is_active).length;
  const totalResponses = requests.reduce(
    (acc, r) => acc + (r.responses?.length || 0),
    0,
  );
  const acceptedResponses = requests.reduce(
    (acc, r) =>
      acc +
      (r.responses?.filter((res) => res.status === "accepted").length || 0),
    0,
  );

  const navItems = [
    { id: "requests", icon: "📋", label: "All Requests", count: activeCount },
    { id: "post", icon: "➕", label: "Post Request" },
    { id: "profile", icon: "🏥", label: "Hospital Profile" },
  ];

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchProfile(), fetchRequests()]);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadAllData();
    const interval = setInterval(fetchRequests, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <AuthLoader status="Loading your dashboard..." />;

  return (
    <div
      style={{
        minHeight: "100svh",
        background: "#f8f9fa",
        fontFamily: "'Inter',sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}

        .toast{position:fixed;top:20px;right:20px;z-index:1000;padding:14px 20px;border-radius:14px;font-size:14px;font-weight:600;display:flex;align-items:center;gap:10px;box-shadow:0 8px 32px rgba(0,0,0,0.12);animation:sir 0.4s ease;max-width:380px;}
        .toast.success{background:#f0fdf4;border:1px solid #bbf7d0;color:#15803d;}
        .toast.error{background:#fef2f2;border:1px solid #fecaca;color:#B91C1C;}
        @keyframes sir{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}

        .sidebar{width:240px;background:white;border-right:1px solid #f0f0f0;display:flex;flex-direction:column;flex-shrink:0;height:100vh;position:sticky;top:0;}
        .sb-logo{padding:24px 20px 20px;border-bottom:1px solid #f5f5f5;}
        .sb-logo-text{font-size:18px;font-weight:900;color:#B91C1C;letter-spacing:-0.5px;}
        .sb-logo-sub{font-size:11px;color:#aaa;margin-top:2px;font-weight:500;}
        .sb-nav{flex:1;padding:16px 12px;display:flex;flex-direction:column;gap:4px;}
        .nav-item{display:flex;align-items:center;gap:12px;padding:11px 14px;border-radius:12px;cursor:pointer;transition:all 0.2s;border:none;background:transparent;font-family:inherit;font-size:14px;font-weight:500;color:#666;width:100%;text-align:left;}
        .nav-item:hover{background:#f5f5f5;color:#111;}
        .nav-item.active{background:#fef2f2;color:#B91C1C;font-weight:700;}
        .nav-icon{font-size:16px;flex-shrink:0;}
        .nav-badge{margin-left:auto;background:#B91C1C;color:white;font-size:10px;font-weight:800;padding:2px 7px;border-radius:100px;}
        .sb-footer{padding:16px 12px;border-top:1px solid #f5f5f5;}
        .sb-user{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:12px;cursor:pointer;transition:background 0.2s;}
        .sb-user:hover{background:#f5f5f5;}
        .user-av{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#B91C1C,#ef4444);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;color:white;flex-shrink:0;}
        .user-nm{font-size:13px;font-weight:700;color:#111;}
        .user-rl{font-size:11px;color:#999;margin-top:1px;}
        .logout-btn{display:flex;align-items:center;gap:8px;padding:9px 14px;border-radius:10px;border:none;background:transparent;font-family:inherit;font-size:13px;font-weight:600;color:#999;cursor:pointer;transition:all 0.2s;width:100%;}
        .logout-btn:hover{background:#fef2f2;color:#B91C1C;}

        .main{flex:1;display:flex;flex-direction:column;min-width:0;overflow-y:auto;}
        .topbar{display:none;background:white;border-bottom:1px solid #f0f0f0;padding:14px 16px;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50;}
        .topbar-logo{font-size:16px;font-weight:900;color:#B91C1C;}
        .burger{background:none;border:none;cursor:pointer;font-size:20px;padding:4px;}

        .drawer-ov{position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:200;display:none;}
        .drawer-ov.open{display:block;}
        .drawer{position:fixed;left:0;top:0;bottom:0;width:260px;background:white;z-index:201;transform:translateX(-100%);transition:transform 0.3s ease;display:flex;flex-direction:column;}
        .drawer.open{transform:translateX(0);}

        .page-hdr{padding:clamp(20px,3vh,32px) clamp(16px,3vw,32px) 0;display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:12px;}
        .page-title{font-size:clamp(20px,2.5vw,26px);font-weight:800;color:#111;letter-spacing:-0.5px;}
        .page-sub{font-size:clamp(12px,1.3vw,14px);color:#888;margin-top:4px;}
        .post-btn{background:#B91C1C;color:white;border:none;padding:clamp(10px,1.8vh,13px) clamp(16px,2.5vw,24px);border-radius:12px;font-size:clamp(13px,1.5vw,14px);font-weight:700;cursor:pointer;font-family:inherit;transition:all 0.3s;display:flex;align-items:center;gap:8px;box-shadow:0 4px 16px rgba(185,28,28,0.3);white-space:nowrap;}
        .post-btn:hover{background:#991B1B;transform:translateY(-2px);box-shadow:0 8px 24px rgba(185,28,28,0.4);}
        .post-btn.cancel{background:#f3f4f6;color:#555;box-shadow:none;}
        .post-btn.cancel:hover{background:#e5e7eb;transform:translateY(-1px);}

        .content{padding:clamp(16px,2.5vh,24px) clamp(16px,3vw,32px) clamp(24px,4vh,40px);}

        .stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:clamp(10px,1.5vw,16px);margin-bottom:clamp(16px,2.5vh,24px);}
        .stat-card{background:white;border-radius:14px;padding:clamp(14px,2vw,20px);border:1px solid #f0f0f0;position:relative;overflow:hidden;transition:all 0.3s;}
        .stat-card:hover{box-shadow:0 4px 20px rgba(0,0,0,0.07);transform:translateY(-2px);}
        .stat-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;}
        .stat-red::before{background:linear-gradient(90deg,#B91C1C,#ef4444);}
        .stat-blue::before{background:linear-gradient(90deg,#1d4ed8,#3b82f6);}
        .stat-green::before{background:linear-gradient(90deg,#15803d,#22c55e);}
        .stat-orange::before{background:linear-gradient(90deg,#c2410c,#f97316);}
        .stat-val{font-size:clamp(24px,3vw,36px);font-weight:900;letter-spacing:-1px;line-height:1;margin-bottom:6px;}
        .stat-lbl{font-size:clamp(11px,1.2vw,12px);color:#888;font-weight:500;}
        .stat-icon{position:absolute;top:16px;right:16px;font-size:20px;opacity:0.4;}

        /* Post form */
        .form-card{background:white;border-radius:16px;border:1px solid #f0f0f0;overflow:hidden;margin-bottom:clamp(16px,2.5vh,20px);animation:slideDown 0.3s ease;}
        @keyframes slideDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
        .form-hdr{padding:clamp(16px,2.5vw,22px);border-bottom:1px solid #f5f5f5;display:flex;align-items:center;gap:12px;}
        .form-hdr-icon{width:40px;height:40px;border-radius:10px;background:linear-gradient(135deg,#fef2f2,#fee2e2);display:flex;align-items:center;justify-content:center;font-size:18px;}
        .form-hdr-title{font-size:clamp(14px,1.7vw,16px);font-weight:700;color:#111;}
        .form-hdr-sub{font-size:12px;color:#888;margin-top:2px;}
        .form-body{padding:clamp(16px,2.5vw,22px);}
        .form-row{display:grid;grid-template-columns:1fr 1fr;gap:clamp(10px,1.5vw,16px);margin-bottom:clamp(12px,2vh,16px);}
        .fgrp{display:flex;flex-direction:column;gap:6px;}
        .fgrp.full{margin-bottom:clamp(12px,2vh,16px);}
        .flabel{font-size:11px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:0.5px;}
        .fselect,.ftextarea{background:white;border:1.5px solid #e5e7eb;border-radius:10px;padding:clamp(9px,1.5vh,11px) clamp(12px,1.5vw,14px);font-size:clamp(13px,1.4vw,14px);color:#111;font-family:inherit;transition:all 0.2s;outline:none;width:100%;}
        .fselect{appearance:none;cursor:pointer;}
        .fselect:focus,.ftextarea:focus{border-color:#B91C1C;box-shadow:0 0 0 3px rgba(185,28,28,0.08);}
        .ftextarea{resize:vertical;min-height:80px;}
        .loc-btn{width:100%;background:white;border:1.5px dashed #e5e7eb;border-radius:10px;padding:clamp(10px,1.8vh,13px);font-size:clamp(13px,1.4vw,14px);font-weight:600;color:#666;cursor:pointer;font-family:inherit;transition:all 0.2s;display:flex;align-items:center;justify-content:center;gap:8px;}
        .loc-btn:hover{border-color:#B91C1C;color:#B91C1C;background:#fef2f2;}
        .loc-set{display:flex;align-items:center;gap:6px;font-size:12px;color:#15803d;font-weight:600;margin-top:8px;padding:8px 12px;background:#f0fdf4;border-radius:8px;border:1px solid #bbf7d0;}
        .submit-btn{width:100%;background:linear-gradient(135deg,#B91C1C,#ef4444);color:white;border:none;padding:clamp(12px,2vh,14px);border-radius:12px;font-size:clamp(13px,1.5vw,15px);font-weight:700;cursor:pointer;font-family:inherit;transition:all 0.3s;margin-top:clamp(8px,1.5vh,12px);display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:0 4px 20px rgba(185,28,28,0.3);}
        .submit-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 28px rgba(185,28,28,0.4);}
        .submit-btn:disabled{opacity:0.6;cursor:not-allowed;}
        .spinner{width:15px;height:15px;border:2px solid rgba(255,255,255,0.3);border-top-color:white;border-radius:50%;animation:spin 0.7s linear infinite;flex-shrink:0;}
        @keyframes spin{to{transform:rotate(360deg)}}

        /* Blood type visual selector */
        .blood-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;}
        .blood-option{padding:8px 4px;border-radius:8px;border:1.5px solid #e5e7eb;text-align:center;font-size:13px;font-weight:700;cursor:pointer;transition:all 0.2s;background:white;font-family:inherit;color:#666;}
        .blood-option:hover{border-color:#B91C1C;color:#B91C1C;}
        .blood-option.selected{background:#B91C1C;color:white;border-color:#B91C1C;box-shadow:0 2px 8px rgba(185,28,28,0.3);}

        /* Urgency selector */
        .urgency-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;}
        .urg-option{padding:8px 4px;border-radius:8px;border:1.5px solid #e5e7eb;text-align:center;font-size:11px;font-weight:700;cursor:pointer;transition:all 0.2s;background:white;font-family:inherit;}
        .urg-option:hover{transform:translateY(-1px);}

        /* Request cards */
        .req-list{display:flex;flex-direction:column;gap:clamp(12px,2vh,16px);}
        .req-card{background:white;border-radius:16px;border:1.5px solid #f0f0f0;overflow:hidden;transition:all 0.3s;animation:fu 0.4s ease;}
        @keyframes fu{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .req-card:hover{box-shadow:0 6px 28px rgba(0,0,0,0.08);transform:translateY(-2px);}
        .req-card-top{padding:clamp(14px,2vw,20px);display:flex;justify-content:space-between;align-items:flex-start;gap:12px;}
        .req-left{display:flex;align-items:center;gap:clamp(12px,2vw,16px);}
        .req-blood-badge{width:clamp(52px,7vw,64px);height:clamp(52px,7vw,64px);border-radius:14px;background:linear-gradient(135deg,#fef2f2,#fee2e2);display:flex;align-items:center;justify-content:center;font-size:clamp(18px,2.5vw,22px);font-weight:900;color:#B91C1C;letter-spacing:-1px;flex-shrink:0;border:1.5px solid #fecaca;}
        .req-blood-text{font-size:clamp(16px,2vw,20px);font-weight:900;color:#111;letter-spacing:-0.5px;}
        .req-time{font-size:clamp(11px,1.2vw,12px);color:#aaa;margin-top:3px;font-weight:500;}
        .req-badges{display:flex;flex-direction:column;align-items:flex-end;gap:6px;}
        .urgency-badge{padding:5px 12px;border-radius:100px;font-size:clamp(10px,1.1vw,11px);font-weight:700;white-space:nowrap;}
        .status-badge{padding:4px 10px;border-radius:100px;font-size:clamp(10px,1vw,11px);font-weight:700;}
        .status-active{background:#f0fdf4;color:#15803d;border:1px solid #bbf7d0;}
        .status-closed{background:#f5f5f5;color:#888;border:1px solid #e5e7eb;}

        .req-card-body{padding:0 clamp(14px,2vw,20px) clamp(14px,2vw,20px);}
        .req-msg{font-size:clamp(12px,1.3vw,13px);color:#555;line-height:1.6;padding:10px 14px;background:#fafafa;border-radius:8px;border-left:3px solid #fecaca;margin-bottom:14px;}
        .responses-section{margin-bottom:14px;}
        .responses-title{font-size:clamp(11px,1.2vw,12px);font-weight:700;color:#666;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;}
        .responses-list{display:flex;flex-direction:column;gap:6px;}
        .response-item{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:10px;background:#fafafa;border:1px solid #f0f0f0;}
        .res-icon{font-size:14px;flex-shrink:0;}
        .res-name{font-size:clamp(12px,1.3vw,13px);font-weight:600;color:#111;}
        .res-phone{font-size:clamp(11px,1.2vw,12px);color:#888;margin-left:auto;}
        .res-status-accepted{display:inline-block;font-size:10px;font-weight:700;padding:2px 8px;border-radius:100px;background:#dcfce7;color:#15803d;margin-left:8px;}
        .res-status-rejected{display:inline-block;font-size:10px;font-weight:700;padding:2px 8px;border-radius:100px;background:#fef2f2;color:#B91C1C;margin-left:8px;}
        .close-btn{background:#f3f4f6;color:#555;border:none;padding:clamp(8px,1.4vh,10px) clamp(14px,2vw,18px);border-radius:10px;font-size:clamp(12px,1.3vw,13px);font-weight:600;cursor:pointer;font-family:inherit;transition:all 0.2s;display:flex;align-items:center;gap:6px;}
        .close-btn:hover{background:#e5e7eb;color:#374151;}

        /* Empty */
        .empty{text-align:center;padding:clamp(40px,6vh,64px) 24px;}
        .empty-icon{font-size:52px;margin-bottom:16px;}
        .empty-title{font-size:clamp(16px,1.8vw,18px);font-weight:700;color:#374151;margin-bottom:8px;}
        .empty-sub{font-size:clamp(13px,1.4vw,14px);color:#9ca3af;line-height:1.6;}

        /* Profile */
        .profile-hero{background:linear-gradient(135deg,#B91C1C,#ef4444);border-radius:16px;padding:clamp(20px,3vw,28px);margin-bottom:20px;position:relative;overflow:hidden;}
        .profile-hero::before{content:'';position:absolute;inset:0;background-image:radial-gradient(circle,rgba(255,255,255,0.08) 1px,transparent 1px);background-size:20px 20px;}
        .profile-hero-content{position:relative;z-index:1;display:flex;align-items:center;gap:clamp(14px,2vw,20px);}
        .profile-av-lg{width:clamp(56px,7vw,72px);height:clamp(56px,7vw,72px);border-radius:50%;background:rgba(255,255,255,0.2);backdrop-filter:blur(10px);border:3px solid rgba(255,255,255,0.3);display:flex;align-items:center;justify-content:center;font-size:clamp(22px,3vw,28px);font-weight:900;color:white;flex-shrink:0;}
        .profile-hero-name{font-size:clamp(18px,2.5vw,24px);font-weight:800;color:white;letter-spacing:-0.5px;}
        .profile-hero-sub{font-size:clamp(12px,1.3vw,14px);color:rgba(255,255,255,0.75);margin-top:4px;}
        .profile-grid{display:grid;grid-template-columns:1fr 1fr;gap:clamp(10px,1.5vw,14px);}
        .pfield{background:#fafafa;border-radius:12px;padding:clamp(12px,1.8vw,16px);border:1px solid #f0f0f0;}
        .pfield-label{font-size:10px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:6px;}
        .pfield-value{font-size:clamp(13px,1.5vw,15px);font-weight:700;color:#111;}

        @media (max-width:768px){
          .sidebar{display:none;}
          .topbar{display:flex;}
          .drawer-ov.open{display:block;}
          .stats-row{grid-template-columns:repeat(2,1fr);}
          .form-row{grid-template-columns:1fr;}
          .profile-grid{grid-template-columns:1fr;}
          .blood-grid{grid-template-columns:repeat(4,1fr);}
          .urgency-grid{grid-template-columns:repeat(2,1fr);}
        }
        @media (max-width:480px){
          .stats-row{grid-template-columns:1fr 1fr;}
          .req-badges{flex-direction:row;align-items:center;}
        }
      `}</style>

      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === "success" ? "✅" : "⚠️"} {toast.message}
        </div>
      )}

      {/* Drawer overlay */}
      <div
        className={`drawer-ov ${sidebarOpen ? "open" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />
      <div className={`drawer ${sidebarOpen ? "open" : ""}`}>
        <div className="sb-logo" style={{ padding: "20px 16px" }}>
          <div className="sb-logo-text">RedThread</div>
          <div className="sb-logo-sub">Hospital Dashboard</div>
        </div>
        <div className="sb-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
              {item.count > 0 && (
                <span className="nav-badge">{item.count}</span>
              )}
            </button>
          ))}
        </div>
        <div className="sb-footer">
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, minHeight: "100svh" }}>
        {/* Desktop Sidebar */}
        <div className="sidebar">
          <div className="sb-logo">
            <div className="sb-logo-text">RedThread</div>
            <div className="sb-logo-sub">Hospital Dashboard</div>
          </div>
          <div className="sb-nav">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`nav-item ${activeTab === item.id ? "active" : ""}`}
                onClick={() => setActiveTab(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
                {item.count > 0 && (
                  <span className="nav-badge">{item.count}</span>
                )}
              </button>
            ))}
          </div>
          <div className="sb-footer">
            <div className="sb-user">
              <div className="user-av">
                {profile?.name?.charAt(0)?.toUpperCase() || "H"}
              </div>
              <div>
                <div className="user-nm">{profile?.name}</div>
                <div className="user-rl">Hospital</div>
              </div>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {/* Main */}
        <div className="main">
          {/* Mobile topbar */}
          <div className="topbar">
            <div className="topbar-logo">RedThread</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 13, color: "#888" }}>
                Hi, {profile?.name?.split(" ")[0]} 👋
              </span>
              <button className="burger" onClick={() => setSidebarOpen(true)}>
                ☰
              </button>
            </div>
          </div>

          {/* Page header */}
          <div className="page-hdr">
            <div>
              <div className="page-title">
                {activeTab === "requests" && "Blood Requests"}
                {activeTab === "post" && "Post New Request"}
                {activeTab === "profile" && "Hospital Profile"}
              </div>
              <div className="page-sub">
                {activeTab === "requests" &&
                  `${activeCount} active · ${requests.length} total`}
                {activeTab === "post" && "Notify nearby donors instantly"}
                {activeTab === "profile" && "Your hospital information"}
              </div>
            </div>
            {activeTab === "requests" && (
              <button className="post-btn" onClick={() => setActiveTab("post")}>
                ➕ Post Urgent Request
              </button>
            )}
          </div>

          <div className="content">
            {/* Stats */}
            <div className="stats-row">
              <div className="stat-card stat-red">
                <div className="stat-icon">📋</div>
                <div className="stat-val" style={{ color: "#B91C1C" }}>
                  {requests.length}
                </div>
                <div className="stat-lbl">Total Requests</div>
              </div>
              <div className="stat-card stat-green">
                <div className="stat-icon">🟢</div>
                <div className="stat-val" style={{ color: "#15803d" }}>
                  {activeCount}
                </div>
                <div className="stat-lbl">Active Now</div>
              </div>
              <div className="stat-card stat-blue">
                <div className="stat-icon">👥</div>
                <div className="stat-val" style={{ color: "#1d4ed8" }}>
                  {totalResponses}
                </div>
                <div className="stat-lbl">Total Responses</div>
              </div>
              <div className="stat-card stat-orange">
                <div className="stat-icon">✅</div>
                <div className="stat-val" style={{ color: "#c2410c" }}>
                  {acceptedResponses}
                </div>
                <div className="stat-lbl">Donors Accepted</div>
              </div>
            </div>

            {/* REQUESTS TAB */}
            {activeTab === "requests" &&
              (requests.length === 0 ? (
                <div
                  style={{
                    background: "white",
                    borderRadius: 16,
                    border: "1px solid #f0f0f0",
                  }}
                >
                  <div className="empty">
                    <div className="empty-icon">🏥</div>
                    <div className="empty-title">No requests posted yet</div>
                    <div className="empty-sub">
                      Post your first urgent blood request to start finding
                      nearby donors.
                    </div>
                    <button
                      className="post-btn"
                      style={{ margin: "20px auto 0", display: "flex" }}
                      onClick={() => setActiveTab("post")}
                    >
                      ➕ Post First Request
                    </button>
                  </div>
                </div>
              ) : (
                <div className="req-list">
                  {requests.map((req, i) => {
                    const cfg =
                      urgencyConfig[req.urgency_level] || urgencyConfig.low;
                    return (
                      <div
                        key={req.id}
                        className="req-card"
                        style={{ animationDelay: `${i * 60}ms` }}
                      >
                        <div className="req-card-top">
                          <div className="req-left">
                            <div className="req-blood-badge">
                              {req.blood_type}
                            </div>
                            <div>
                              <div className="req-blood-text">
                                {req.blood_type} Blood Needed
                              </div>
                              <div className="req-time">
                                🕐 {new Date(req.created_at).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <div className="req-badges">
                            <div
                              className="urgency-badge"
                              style={{
                                background: cfg.bg,
                                color: cfg.color,
                                border: `1px solid ${cfg.border}`,
                              }}
                            >
                              {cfg.label}
                            </div>
                            <div
                              className={`status-badge ${req.is_active ? "status-active" : "status-closed"}`}
                            >
                              {req.is_active ? "● Active" : "○ Closed"}
                            </div>
                          </div>
                        </div>
                        {(req.message ||
                          (req.responses && req.responses.length > 0) ||
                          req.is_active) && (
                          <div className="req-card-body">
                            {req.message && (
                              <div className="req-msg">"{req.message}"</div>
                            )}
                            {req.responses && req.responses.length > 0 && (
                              <div className="responses-section">
                                <div className="responses-title">
                                  👥 Donor Responses ({req.responses.length})
                                </div>
                                <div className="responses-list">
                                  {req.responses.map((res, j) => (
                                    <div key={j} className="response-item">
                                      <span className="res-icon">
                                        {res.status === "accepted"
                                          ? "✅"
                                          : "❌"}
                                      </span>
                                      <span className="res-name">
                                        {res.profiles?.name}
                                      </span>
                                      <span
                                        className={
                                          res.status === "accepted"
                                            ? "res-status-accepted"
                                            : "res-status-rejected"
                                        }
                                      >
                                        {res.status}
                                      </span>
                                      <span className="res-phone">
                                        {res.profiles?.phone}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {req.is_active && (
                              <button
                                className="close-btn"
                                onClick={() => handleCloseRequest(req.id)}
                              >
                                ✕ Close Request
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}

            {/* POST TAB */}
            {activeTab === "post" && (
              <div className="form-card">
                <div className="form-hdr">
                  <div className="form-hdr-icon">🚨</div>
                  <div>
                    <div className="form-hdr-title">
                      New Urgent Blood Request
                    </div>
                    <div className="form-hdr-sub">
                      Matching donors within 10km will be notified instantly
                    </div>
                  </div>
                </div>
                <div className="form-body">
                  <form onSubmit={handlePostRequest}>
                    <div className="fgrp full">
                      <label className="flabel">Blood Type Needed</label>
                      <div className="blood-grid">
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                          (bt) => (
                            <button
                              key={bt}
                              type="button"
                              className={`blood-option ${formData.blood_type === bt ? "selected" : ""}`}
                              onClick={() =>
                                setFormData({ ...formData, blood_type: bt })
                              }
                            >
                              {bt}
                            </button>
                          ),
                        )}
                      </div>
                    </div>

                    <div className="fgrp full">
                      <label className="flabel">Urgency Level</label>
                      <div className="urgency-grid">
                        {[
                          {
                            val: "low",
                            label: "🟢 Low",
                            bg: "#f0fdf4",
                            color: "#15803d",
                            border: "#bbf7d0",
                          },
                          {
                            val: "medium",
                            label: "🟡 Medium",
                            bg: "#fefce8",
                            color: "#a16207",
                            border: "#fde68a",
                          },
                          {
                            val: "high",
                            label: "🔴 High",
                            bg: "#fff7ed",
                            color: "#c2410c",
                            border: "#fed7aa",
                          },
                          {
                            val: "critical",
                            label: "🚨 Critical",
                            bg: "#fef2f2",
                            color: "#B91C1C",
                            border: "#fecaca",
                          },
                        ].map((u) => (
                          <button
                            key={u.val}
                            type="button"
                            className="urg-option"
                            onClick={() =>
                              setFormData({ ...formData, urgency_level: u.val })
                            }
                            style={{
                              background:
                                formData.urgency_level === u.val
                                  ? u.bg
                                  : "white",
                              color:
                                formData.urgency_level === u.val
                                  ? u.color
                                  : "#888",
                              borderColor:
                                formData.urgency_level === u.val
                                  ? u.border
                                  : "#e5e7eb",
                              fontWeight:
                                formData.urgency_level === u.val ? 800 : 600,
                            }}
                          >
                            {u.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="fgrp full">
                      <label className="flabel">Message (Optional)</label>
                      <textarea
                        className="ftextarea"
                        name="message"
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        placeholder="Add details about the request, patient condition, urgency..."
                      />
                    </div>

                    <div className="fgrp full">
                      <label className="flabel">Hospital Location</label>
                      <button
                        type="button"
                        className="loc-btn"
                        onClick={handleGetLocation}
                      >
                        📍 Use My Current Location
                      </button>
                      {formData.latitude && (
                        <div className="loc-set">
                          ✅ Location set:{" "}
                          {Number(formData.latitude).toFixed(4)},{" "}
                          {Number(formData.longitude).toFixed(4)}
                        </div>
                      )}
                    </div>

                    <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                      <button
                        type="button"
                        className="close-btn"
                        style={{ flex: 1, justifyContent: "center" }}
                        onClick={() => setActiveTab("requests")}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="submit-btn"
                        style={{ flex: 2 }}
                        disabled={posting}
                      >
                        {posting ? (
                          <>
                            <div className="spinner" /> Posting & Notifying...
                          </>
                        ) : (
                          "Post Request & Notify Donors"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <div>
                <div className="profile-hero">
                  <div className="profile-hero-content">
                    <div className="profile-av-lg">
                      {profile?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <div className="profile-hero-name">{profile?.name}</div>
                      <div className="profile-hero-sub">
                        Verified Hospital · RedThread Partner
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    background: "white",
                    borderRadius: 16,
                    border: "1px solid #f0f0f0",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      padding: "clamp(16px,2.5vw,22px)",
                      borderBottom: "1px solid #f5f5f5",
                      fontWeight: 700,
                      fontSize: 15,
                      color: "#111",
                    }}
                  >
                    Hospital Information
                  </div>
                  <div style={{ padding: "clamp(14px,2vw,20px)" }}>
                    <div className="profile-grid">
                      {[
                        { label: "Hospital Name", value: profile?.name },
                        { label: "Email", value: profile?.email },
                        {
                          label: "Phone",
                          value: profile?.phone || "Not provided",
                        },
                        { label: "Role", value: "Hospital" },
                        {
                          label: "Total Requests",
                          value: `${requests.length} posted`,
                        },
                        {
                          label: "Active Requests",
                          value: `${activeCount} open`,
                        },
                      ].map((f, i) => (
                        <div key={i} className="pfield">
                          <div className="pfield-label">{f.label}</div>
                          <div className="pfield-value">{f.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalDashboard;
