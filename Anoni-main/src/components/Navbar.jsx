import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="brand-link">
          Anonymous Storyboard (AnonBoard) 🦋
        </Link>
      </div>
      <div className="navbar-links">
        <Link to="/" className={`nav-btn ${isActive("/") ? "active" : ""}`}>
          Feed
        </Link>
        <Link to="/create" className={`nav-btn ${isActive("/create") ? "active" : ""}`}>
          Create Post
        </Link>
        <Link to="/auth" className={`nav-btn ${isActive("/auth") ? "active" : ""}`}>
          Authentication
        </Link>
        <Link to="/rules" className={`nav-btn ${isActive("/rules") ? "active" : ""}`}>
          Rules
        </Link>
        <Link to="/help" className={`nav-btn ${isActive("/help") ? "active" : ""}`}>
          Help
        </Link>
      </div>
      <div className="navbar-actions">
        <span className="bell-icon">🔔</span>
        {currentUser ? (
          <span className="user-pill">
            @{currentUser.username} ▾
          </span>
        ) : (
          <Link to="/auth" className="user-pill">Login ▾</Link>
        )}
      </div>
    </nav>
  );
}
