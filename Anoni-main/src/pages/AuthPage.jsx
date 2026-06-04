import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { loginUser, registerUser } from "../api/authService.js";
import { useNavigate } from "react-router-dom";
import MyPostsPanel from "../components/MyPostsPanel.jsx";

export default function AuthPage() {
  const { currentUser, login, logout } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const user = await loginUser({ email, password });
      login(user);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setError("");
    setLoading(true);
    try {
      const user = await registerUser({ username, email, password });
      login(user);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUsername("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="page-layout center-layout">
      <div className="auth-grid">
        <div className="auth-box">
          <div className="auth-section-title">AUTHENTICATION / PROFILE</div>
          <div className="auth-inner">

            {/* ── AUTH FORM ── */}
            <div className="auth-col">
              <div className="auth-subtitle">AUTHENTICATION</div>

              {/* toggle between login and register */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                <button
                  className={`action-btn ${!isRegister ? "active" : ""}`}
                  onClick={() => { setIsRegister(false); setError(""); }}
                >Login</button>
                <button
                  className={`action-btn ${isRegister ? "active" : ""}`}
                  onClick={() => { setIsRegister(true); setError(""); }}
                >Register</button>
              </div>

              {isRegister && (
                <input
                  className="form-input"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              )}
              <input
                className="form-input"
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="form-input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (isRegister ? handleRegister() : handleLogin())}
              />

              {error && <div className="form-error">{error}</div>}

              {!isRegister ? (
                <button className="auth-btn login" onClick={handleLogin} disabled={loading}>
                  {loading ? "..." : "LOGIN"}
                </button>
              ) : (
                <button className="auth-btn register" onClick={handleRegister} disabled={loading}>
                  {loading ? "..." : "REGISTER"}
                </button>
              )}
            </div>

            {/* ── PROFILE ── */}
            <div className="profile-col">
              <div className="auth-subtitle">PROFILE</div>
              <div className="avatar-circle">👤</div>
              <div className="profile-name">
                Avatar 🦋<br />
                @{currentUser?.username || "anon_user"}!
              </div>
              {currentUser && (
                <button className="logout-btn" onClick={handleLogout}>
                  Log Out
                </button>
              )}
            </div>
          </div>

          {/* ── MY POSTS (only when logged in) ── */}
          {currentUser && <MyPostsPanel />}

        </div>
      </div>
    </div>
  );
}
