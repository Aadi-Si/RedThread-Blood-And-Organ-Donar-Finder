import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthLoader from "../components/AuthLoader";

const DonorDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [donorProfile, setDonorProfile] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [respondedRequests, setRespondedRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("requests");
  const [donorForm, setDonorForm] = useState({
    blood_type: "A+",
    is_available: true,
    latitude: "",
    longitude: "",
  });
  const [toast, setToast] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const token = localStorage.getItem("token");

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      try {
        await Promise.all(
          fetchProfile(),
          fetchDonorProfile(),
          fetchRequests(),
          fetchRespondedRequests(),
        );
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadAllData();
    const interval = setInterval(() => fetchRequests(), 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("http://localhost:3000/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProfile(data.user);
    } catch (e) {}
  };

  const fetchDonorProfile = async () => {
    try {
      const res = await fetch("http://localhost:3000/donor/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setDonorProfile(data.donor);
      setDonorForm({
        blood_type: data.donor.blood_type || "A+",
        is_available: data.donor.is_available,
        latitude: data.donor.latitude || "",
        longitude: data.donor.longitude || "",
      });
    } catch (e) {}
  };

  const fetchRequests = async () => {
    try {
      const res = await fetch("http://localhost:3000/donor/requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRequests(data.requests);
    } catch (e) {}
  };

  const fetchRespondedRequests = async () => {
    try {
      const res = await fetch("http://localhost:3000/donor/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRespondedRequests(data.history.map((h) => h.request_id));
    } catch (e) {}
  };

  const handleUpdateDonorProfile = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    try {
      const res = await fetch("http://localhost:3000/donor/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(donorForm),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error, "error");
        return;
      }
      showToast("Profile updated successfully!");
      fetchDonorProfile();
      fetchRequests();
    } catch (e) {
      showToast("Something went wrong.", "error");
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleGetLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setDonorForm({
          ...donorForm,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        showToast("Location captured successfully!");
      },
      () => showToast("Could not get location.", "error"),
    );
  };

  const handleAccept = async (requestId) => {
    try {
      const res = await fetch(
        `http://localhost:3000/donor/request/${requestId}/accept`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } },
      );
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error, "error");
        return;
      }
      showToast("Request accepted! Hospital will be notified. 🎉");
      fetchRequests();
      fetchRespondedRequests();
    } catch (e) {}
  };

  const handleReject = async (requestId) => {
    try {
      const res = await fetch(
        `http://localhost:3000/donor/request/${requestId}/reject`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } },
      );
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error, "error");
        return;
      }
      showToast("Request declined.");
      fetchRequests();
      fetchRespondedRequests();
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
      dot: "#ef4444",
      label: "🚨 Critical",
    },
    high: {
      bg: "#fff7ed",
      color: "#c2410c",
      border: "#fed7aa",
      dot: "#f97316",
      label: "🔴 High",
    },
    medium: {
      bg: "#fefce8",
      color: "#a16207",
      border: "#fde68a",
      dot: "#eab308",
      label: "🟡 Medium",
    },
    low: {
      bg: "#f0fdf4",
      color: "#15803d",
      border: "#bbf7d0",
      dot: "#22c55e",
      label: "🟢 Low",
    },
  };

  const navItems = [
    {
      id: "requests",
      icon: "🩸",
      label: "Blood Requests",
      count: requests.length,
    },
    { id: "settings", icon: "⚙️", label: "Donor Settings" },
    { id: "profile", icon: "👤", label: "My Profile" },
  ];

  if (loading) return <AuthLoader status="Loading your dashboard..." />;

  return (
    <div
      style={{
        minHeight: "100svh",
        background: "#f8f9fa",
        fontFamily: "'Inter', sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }

        /* Toast */
        .toast { position:fixed;top:20px;right:20px;z-index:1000;padding:14px 20px;border-radius:14px;font-size:14px;font-weight:600;display:flex;align-items:center;gap:10px;box-shadow:0 8px 32px rgba(0,0,0,0.12);animation:slideInRight 0.4s ease;max-width:360px; }
        .toast.success { background:#f0fdf4;border:1px solid #bbf7d0;color:#15803d; }
        .toast.error { background:#fef2f2;border:1px solid #fecaca;color:#B91C1C; }
        @keyframes slideInRight { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }

        /* Sidebar */
        .sidebar { width:240px;background:white;border-right:1px solid #f0f0f0;display:flex;flex-direction:column;flex-shrink:0;height:100vh;position:sticky;top:0; }
        .sidebar-logo { padding:24px 20px 20px;border-bottom:1px solid #f5f5f5; }
        .sidebar-logo-text { font-size:18px;font-weight:900;color:#B91C1C;letter-spacing:-0.5px; }
        .sidebar-logo-sub { font-size:11px;color:#aaa;margin-top:2px;font-weight:500; }
        .sidebar-nav { flex:1;padding:16px 12px;display:flex;flex-direction:column;gap:4px; }
        .nav-item { display:flex;align-items:center;gap:12px;padding:11px 14px;border-radius:12px;cursor:pointer;transition:all 0.2s;border:none;background:transparent;font-family:inherit;font-size:14px;font-weight:500;color:#666;width:100%;text-align:left;position:relative; }
        .nav-item:hover { background:#f5f5f5;color:#111; }
        .nav-item.active { background:#fef2f2;color:#B91C1C;font-weight:700; }
        .nav-item .nav-icon { font-size:16px;flex-shrink:0; }
        .nav-badge { margin-left:auto;background:#B91C1C;color:white;font-size:10px;font-weight:800;padding:2px 7px;border-radius:100px; }
        .sidebar-footer { padding:16px 12px;border-top:1px solid #f5f5f5; }
        .sidebar-user { display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:12px;cursor:pointer;transition:background 0.2s; }
        .sidebar-user:hover { background:#f5f5f5; }
        .user-avatar { width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#B91C1C,#ef4444);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;color:white;flex-shrink:0; }
        .user-name { font-size:13px;font-weight:700;color:#111; }
        .user-role { font-size:11px;color:#999;margin-top:1px; }
        .logout-btn { display:flex;align-items:center;gap:8px;padding:9px 14px;border-radius:10px;border:none;background:transparent;font-family:inherit;font-size:13px;font-weight:600;color:#999;cursor:pointer;transition:all 0.2s;width:100%; }
        .logout-btn:hover { background:#fef2f2;color:#B91C1C; }

        /* Main */
        .main-content { flex:1;display:flex;flex-direction:column;min-width:0;overflow-y:auto; }

        /* Top bar mobile */
        .topbar { display:none;background:white;border-bottom:1px solid #f0f0f0;padding:14px 16px;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50; }
        .topbar-logo { font-size:16px;font-weight:900;color:#B91C1C; }
        .burger { background:none;border:none;cursor:pointer;font-size:20px;padding:4px; }

        /* Mobile drawer */
        .drawer-overlay { position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:200;display:none; }
        .drawer { position:fixed;left:0;top:0;bottom:0;width:260px;background:white;z-index:201;transform:translateX(-100%);transition:transform 0.3s ease;display:flex;flex-direction:column; }
        .drawer.open { transform:translateX(0); }

        /* Page header */
        .page-header { padding:clamp(20px,3vh,32px) clamp(16px,3vw,32px) 0;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px; }
        .page-title { font-size:clamp(20px,2.5vw,26px);font-weight:800;color:#111;letter-spacing:-0.5px; }
        .page-sub { font-size:clamp(12px,1.3vw,14px);color:#888;margin-top:4px; }
        .status-pill { display:flex;align-items:center;gap:6px;padding:8px 14px;border-radius:100px;font-size:13px;font-weight:600; }
        .status-available { background:#f0fdf4;color:#15803d;border:1px solid #bbf7d0; }
        .status-unavailable { background:#fef2f2;color:#B91C1C;border:1px solid #fecaca; }
        .status-dot { width:7px;height:7px;border-radius:50%;animation:blink 1.5s ease infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.4} }

        /* Content area */
        .content-area { padding:clamp(16px,2.5vh,24px) clamp(16px,3vw,32px) clamp(24px,4vh,40px); }

        /* Cards */
        .card { background:white;border-radius:16px;border:1px solid #f0f0f0;overflow:hidden;transition:box-shadow 0.2s; }
        .card:hover { box-shadow:0 4px 24px rgba(0,0,0,0.06); }
        .card-header { padding:clamp(16px,2.5vw,22px) clamp(16px,2.5vw,22px) 0;display:flex;align-items:center;justify-content:space-between; }
        .card-title { font-size:clamp(14px,1.6vw,16px);font-weight:700;color:#111; }
        .card-body { padding:clamp(14px,2vw,20px) clamp(16px,2.5vw,22px) clamp(16px,2.5vw,22px); }

        /* Stats row */
        .stats-row { display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(10px,1.5vw,16px);margin-bottom:clamp(16px,2.5vh,24px); }
        .stat-card { background:white;border-radius:14px;padding:clamp(14px,2vw,20px);border:1px solid #f0f0f0;text-align:center; }
        .stat-val { font-size:clamp(24px,3vw,32px);font-weight:900;color:#B91C1C;letter-spacing:-1px;line-height:1; }
        .stat-lbl { font-size:clamp(11px,1.2vw,12px);color:#888;font-weight:500;margin-top:6px; }

        /* Profile grid */
        .profile-grid { display:grid;grid-template-columns:1fr 1fr;gap:clamp(12px,2vw,18px); }
        .profile-field { background:#fafafa;border-radius:12px;padding:clamp(12px,1.8vw,16px); }
        .profile-field-label { font-size:11px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px; }
        .profile-field-value { font-size:clamp(13px,1.5vw,15px);font-weight:600;color:#111; }

        /* Settings form */
        .settings-grid { display:grid;grid-template-columns:1fr 1fr;gap:clamp(10px,1.5vw,16px);margin-bottom:clamp(12px,2vh,16px); }
        .form-group { display:flex;flex-direction:column;gap:6px; }
        .form-label { font-size:11px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:0.5px; }
        .form-select, .form-input-field { background:white;border:1.5px solid #e5e7eb;border-radius:10px;padding:clamp(9px,1.5vh,11px) clamp(12px,1.5vw,14px);font-size:clamp(13px,1.4vw,14px);color:#111;font-family:inherit;transition:all 0.2s;outline:none;width:100%;appearance:none;cursor:pointer; }
        .form-select:focus, .form-input-field:focus { border-color:#B91C1C;box-shadow:0 0 0 3px rgba(185,28,28,0.08); }
        .loc-btn { width:100%;background:white;border:1.5px dashed #e5e7eb;border-radius:10px;padding:clamp(10px,1.8vh,13px);font-size:clamp(13px,1.4vw,14px);font-weight:600;color:#666;cursor:pointer;font-family:inherit;transition:all 0.2s;display:flex;align-items:center;justify-content:center;gap:8px; }
        .loc-btn:hover { border-color:#B91C1C;color:#B91C1C;background:#fef2f2; }
        .loc-set { display:flex;align-items:center;gap:6px;font-size:12px;color:#15803d;font-weight:600;margin-top:8px;padding:8px 12px;background:#f0fdf4;border-radius:8px;border:1px solid #bbf7d0; }
        .save-btn { width:100%;background:#B91C1C;color:white;border:none;padding:clamp(11px,1.8vh,14px);border-radius:12px;font-size:clamp(13px,1.5vw,14px);font-weight:700;cursor:pointer;font-family:inherit;transition:all 0.3s;margin-top:clamp(8px,1.5vh,12px);display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:0 4px 16px rgba(185,28,28,0.25); }
        .save-btn:hover:not(:disabled) { background:#991B1B;transform:translateY(-1px);box-shadow:0 6px 24px rgba(185,28,28,0.35); }
        .save-btn:disabled { opacity:0.6;cursor:not-allowed; }
        .spinner { width:14px;height:14px;border:2px solid rgba(255,255,255,0.3);border-top-color:white;border-radius:50%;animation:spin 0.7s linear infinite; }
        @keyframes spin { to{transform:rotate(360deg)} }

        /* Request cards */
        .requests-list { display:flex;flex-direction:column;gap:clamp(10px,1.5vh,14px); }
        .req-card { background:white;border-radius:14px;border:1.5px solid #f0f0f0;padding:clamp(14px,2vw,18px);transition:all 0.3s;animation:fadeUp 0.4s ease; }
        .req-card:hover { border-color:#fecaca;box-shadow:0 4px 20px rgba(185,28,28,0.08);transform:translateY(-2px); }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .req-top { display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:10px; }
        .req-blood { font-size:clamp(22px,3vw,28px);font-weight:900;color:#B91C1C;letter-spacing:-1px;line-height:1; }
        .req-hospital { font-size:clamp(12px,1.3vw,13px);color:#666;margin-top:3px;font-weight:500; }
        .urgency-badge { padding:5px 12px;border-radius:100px;font-size:clamp(10px,1.1vw,11px);font-weight:700;flex-shrink:0;white-space:nowrap; }
        .req-msg { font-size:clamp(12px,1.3vw,13px);color:#555;line-height:1.6;margin-bottom:12px;padding:10px 12px;background:#fafafa;border-radius:8px;border-left:3px solid #e5e7eb; }
        .req-actions { display:flex;gap:8px; }
        .btn-accept { flex:1;background:#16a34a;color:white;border:none;padding:clamp(9px,1.5vh,11px);border-radius:10px;font-size:clamp(12px,1.4vw,13px);font-weight:700;cursor:pointer;font-family:inherit;transition:all 0.2s;display:flex;align-items:center;justify-content:center;gap:6px; }
        .btn-accept:hover { background:#15803d;transform:translateY(-1px); }
        .btn-reject { flex:1;background:#f3f4f6;color:#555;border:none;padding:clamp(9px,1.5vh,11px);border-radius:10px;font-size:clamp(12px,1.4vw,13px);font-weight:600;cursor:pointer;font-family:inherit;transition:all 0.2s;display:flex;align-items:center;justify-content:center;gap:6px; }
        .btn-reject:hover { background:#e5e7eb;color:#374151; }
        .responded-badge { width:100%;background:#f0fdf4;color:#15803d;border:1px solid #bbf7d0;border-radius:10px;padding:clamp(9px,1.5vh,11px);font-size:clamp(12px,1.3vw,13px);font-weight:700;text-align:center; }

        /* Empty state */
        .empty-state { text-align:center;padding:clamp(32px,5vh,56px) 24px; }
        .empty-icon { font-size:48px;margin-bottom:16px; }
        .empty-title { font-size:clamp(15px,1.8vw,18px);font-weight:700;color:#374151;margin-bottom:8px; }
        .empty-sub { font-size:clamp(12px,1.4vw,14px);color:#9ca3af;line-height:1.6; }
        .empty-warning { font-size:clamp(12px,1.3vw,13px);color:#B91C1C;font-weight:600;margin-top:12px;padding:10px 16px;background:#fef2f2;border-radius:10px;border:1px solid #fecaca;display:inline-block; }

        /* Responsive */
        @media (max-width: 768px) {
          .sidebar { display:none; }
          .topbar { display:flex; }
          .drawer-overlay.open { display:block; }
          .stats-row { grid-template-columns:repeat(3,1fr); }
          .profile-grid { grid-template-columns:1fr; }
          .settings-grid { grid-template-columns:1fr; }
        }
        @media (max-width: 480px) {
          .stats-row { grid-template-columns:1fr 1fr; }
          .stats-row .stat-card:last-child { grid-column:1/-1; }
        }
      `}</style>

      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === "success" ? "✅" : "⚠️"} {toast.message}
        </div>
      )}

      {/* Mobile drawer overlay */}
      <div
        className={`drawer-overlay ${sidebarOpen ? "open" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Mobile drawer */}
      <div className={`drawer ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-logo" style={{ padding: "20px 16px" }}>
          <div className="sidebar-logo-text">RedThread 🩸</div>
          <div className="sidebar-logo-sub">Donor Dashboard</div>
        </div>
        <div className="sidebar-nav">
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
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, minHeight: "100svh" }}>
        {/* Desktop Sidebar */}
        <div className="sidebar">
          <div className="sidebar-logo">
            <div className="sidebar-logo-text">RedThread 🩸</div>
            <div className="sidebar-logo-sub">Donor Dashboard</div>
          </div>
          <div className="sidebar-nav">
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
          <div className="sidebar-footer">
            <div className="sidebar-user">
              <div className="user-avatar">
                {profile?.name?.charAt(0)?.toUpperCase() || "D"}
              </div>
              <div>
                <div className="user-name">{profile?.name}</div>
                <div className="user-role">Blood Donor</div>
              </div>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        </div>

        {/* Main */}
        <div className="main-content">
          {/* Mobile topbar */}
          <div className="topbar">
            <div className="topbar-logo">RedThread 🩸</div>
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
          <div className="page-header">
            <div>
              <div className="page-title">
                {activeTab === "requests" && "Blood Requests"}
                {activeTab === "settings" && "Donor Settings"}
                {activeTab === "profile" && "My Profile"}
              </div>
              <div className="page-sub">
                {activeTab === "requests" &&
                  `${requests.length} active request${requests.length !== 1 ? "s" : ""} near you`}
                {activeTab === "settings" &&
                  "Update your blood type, availability and location"}
                {activeTab === "profile" && "Your personal information"}
              </div>
            </div>
            <div
              className={`status-pill ${donorProfile?.is_available ? "status-available" : "status-unavailable"}`}
            >
              <div
                className="status-dot"
                style={{
                  background: donorProfile?.is_available
                    ? "#22c55e"
                    : "#ef4444",
                }}
              />
              {donorProfile?.is_available ? "Available" : "Unavailable"}
            </div>
          </div>

          <div className="content-area">
            {/* Stats row (always visible) */}
            <div className="stats-row">
              <div className="stat-card">
                <div className="stat-val">
                  {donorProfile?.blood_type || "—"}
                </div>
                <div className="stat-lbl">Blood Type</div>
              </div>
              <div className="stat-card">
                <div className="stat-val">{requests.length}</div>
                <div className="stat-lbl">Active Requests</div>
              </div>
              <div className="stat-card">
                <div className="stat-val">{respondedRequests.length}</div>
                <div className="stat-lbl">Responded</div>
              </div>
            </div>

            {/* REQUESTS TAB */}
            {activeTab === "requests" &&
              (requests.length === 0 ? (
                <div className="card">
                  <div className="empty-state">
                    <div className="empty-icon">🩸</div>
                    <div className="empty-title">
                      No active requests right now
                    </div>
                    <div className="empty-sub">
                      You'll see urgent blood requests here when hospitals near
                      you post them.
                    </div>
                    {donorProfile && (!donorProfile.blood_type || !donorProfile.latitude) && (
                      <div className="empty-warning">
                        ⚠️ Complete your donor settings to start seeing
                        requests!
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="requests-list">
                  {requests.map((req, i) => {
                    const cfg =
                      urgencyConfig[req.urgency_level] || urgencyConfig.low;
                    return (
                      <div
                        key={req.id}
                        className="req-card"
                        style={{ animationDelay: `${i * 60}ms` }}
                      >
                        <div className="req-top">
                          <div>
                            <div className="req-blood">{req.blood_type}</div>
                            <div className="req-hospital">
                              🏥 {req.profiles?.name}
                            </div>
                          </div>
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
                        </div>
                        {req.message && (
                          <div className="req-msg">"{req.message}"</div>
                        )}
                        <div className="req-actions">
                          {respondedRequests.includes(req.id) ? (
                            <div className="responded-badge">
                              ✅ Already Responded
                            </div>
                          ) : (
                            <>
                              <button
                                className="btn-accept"
                                onClick={() => handleAccept(req.id)}
                              >
                                ✅ Accept
                              </button>
                              <button
                                className="btn-reject"
                                onClick={() => handleReject(req.id)}
                              >
                                ❌ Decline
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}

            {/* SETTINGS TAB */}
            {activeTab === "settings" && (
              <div className="card">
                <div className="card-header">
                  <div className="card-title">⚙️ Update Donor Settings</div>
                </div>
                <div className="card-body">
                  <form onSubmit={handleUpdateDonorProfile}>
                    <div className="settings-grid">
                      <div className="form-group">
                        <label className="form-label">Blood Type</label>
                        <select
                          className="form-select"
                          value={donorForm.blood_type}
                          onChange={(e) =>
                            setDonorForm({
                              ...donorForm,
                              blood_type: e.target.value,
                            })
                          }
                        >
                          {[
                            "A+",
                            "A-",
                            "B+",
                            "B-",
                            "AB+",
                            "AB-",
                            "O+",
                            "O-",
                          ].map((bt) => (
                            <option key={bt} value={bt}>
                              {bt}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Availability</label>
                        <select
                          className="form-select"
                          value={donorForm.is_available}
                          onChange={(e) =>
                            setDonorForm({
                              ...donorForm,
                              is_available: e.target.value === "true",
                            })
                          }
                        >
                          <option value="true">✅ Available</option>
                          <option value="false">❌ Not Available</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Location</label>
                      <button
                        type="button"
                        className="loc-btn"
                        onClick={handleGetLocation}
                      >
                        📍 Use My Current Location
                      </button>
                      {donorForm.latitude && (
                        <div className="loc-set">
                          ✅ Location set:{" "}
                          {Number(donorForm.latitude).toFixed(4)},{" "}
                          {Number(donorForm.longitude).toFixed(4)}
                        </div>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="save-btn"
                      disabled={updatingProfile}
                    >
                      {updatingProfile ? (
                        <>
                          <div className="spinner" /> Saving...
                        </>
                      ) : (
                        "💾 Save Settings"
                      )}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <div className="card">
                <div className="card-header">
                  <div className="card-title">👤 Your Profile</div>
                </div>
                <div className="card-body">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      marginBottom: 24,
                      padding: "16px 20px",
                      background: "linear-gradient(135deg,#fef2f2,#fff5f5)",
                      borderRadius: 14,
                      border: "1px solid #fecaca",
                    }}
                  >
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg,#B91C1C,#ef4444)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 22,
                        fontWeight: 800,
                        color: "white",
                        flexShrink: 0,
                      }}
                    >
                      {profile?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 18,
                          fontWeight: 800,
                          color: "#111",
                          letterSpacing: "-0.3px",
                        }}
                      >
                        {profile?.name}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          color: "#B91C1C",
                          fontWeight: 600,
                          marginTop: 3,
                        }}
                      >
                        🩸 Blood Donor · {donorProfile?.blood_type || "Not set"}
                      </div>
                    </div>
                  </div>
                  <div className="profile-grid">
                    {[
                      { label: "Full Name", value: profile?.name },
                      { label: "Email", value: profile?.email },
                      {
                        label: "Phone",
                        value: profile?.phone || "Not provided",
                      },
                      { label: "Role", value: "Donor" },
                      {
                        label: "Blood Type",
                        value: donorProfile?.blood_type || "Not set",
                      },
                      {
                        label: "Availability",
                        value: donorProfile?.is_available
                          ? "✅ Available"
                          : "❌ Unavailable",
                      },
                    ].map((f, i) => (
                      <div key={i} className="profile-field">
                        <div className="profile-field-label">{f.label}</div>
                        <div className="profile-field-value">{f.value}</div>
                      </div>
                    ))}
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

export default DonorDashboard;
