import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabase";
import AuthLoader from "../components/AuthLoader";
const API = import.meta.env.VITE_API_URL;

const AuthCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Verifying your account...");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setStatus("Connecting to Google...");
        const { data, error } = await supabase.auth.getSession();

        if (error || !data.session) {
          navigate("/login");
          return;
        }

        const token = data.session.access_token;
        localStorage.setItem("token", token);

        setStatus("Loading your profile...");
        const profileResponse = await fetch(`${API}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const profileData = await profileResponse.json();

        if (profileData.user && profileData.user.role) {
          setStatus("Welcome back! Redirecting...");
          localStorage.setItem("role", profileData.user.role);
          setTimeout(() => {
            if (profileData.user.role === "donor") navigate("/donor/dashboard");
            else navigate("/hospital/dashboard");
          }, 600);
        } else {
          setStatus("Almost there! Setting up your profile...");
          setTimeout(() => navigate("/complete-profile"), 600);
        }
      } catch (e) {
        navigate("/login");
      }
    };

    handleCallback();
  }, []);

  return <AuthLoader status={status} />;
};

export default AuthCallback;
