import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { loginUser, registerUser, getUserPosts } from "../api/authService.js";
import { getPosts } from "../api/postService.js";
import { useNavigate } from "react-router-dom";
import MyPostsPanel from "../components/MyPostsPanel.jsx";

export default function AuthPage() {
  const { currentUser, login, logout } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userPosts, setUserPosts] = useState([]);

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const user = await loginUser({ username, password });
      login(user);
      <MyPostsPanel />
      const posts = await getUserPosts(user.username, getPosts);
      setUserPosts(posts);
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
      const user = await registerUser({ username, password });
      login(user);
      setUserPosts([]);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUsername("");
    setPassword("");
    setUserPosts([]);
  };

  return (
    <div className="page-layout center-layout">
      <div className="auth-grid">
        {/* AUTH PANEL */}
        <div className="auth-box">
          <div className="auth-section-title">AUTHENTICATION / PROFILE</div>
          <div className="auth-inner">
            <div className="auth-col">
              <div className="auth-subtitle">AUTHENTICATION</div>
              <input
                className="form-input"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                className="form-input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              {error && <div className="form-error">{error}</div>}
              <button
                className="auth-btn login"
                onClick={handleLogin}
                disabled={loading}
              >
                LOGIN
              </button>
              <button
                className="auth-btn register"
                onClick={handleRegister}
                disabled={loading}
              >
                REGISTER
              </button>
            </div>

            {/* PROFILE PANEL */}
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
              {currentUser && (
                <div className="profile-stats">
                  <div>Posts Created: {currentUser.postsCreated}</div>
                  <div>Comments Left: {currentUser.commentsLeft}</div>
                </div>
              )}
            </div>
          </div>

          {currentUser && userPosts.length > 0 && (
            <div className="my-posts-section">
              <div className="my-posts-title">My Posts</div>
              {userPosts.slice(0, 5).map((p) => (
                <div
                  key={p.id}
                  className="my-post-link"
                  onClick={() => navigate(`/post/${p._id}`)}
                >
                  @{p.username} {p.title}...
                </div>
                
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
