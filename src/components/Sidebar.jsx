import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePosts } from "../context/PostsContext.jsx";

export default function Sidebar() {
  const [search, setSearch] = useState("");
  const { getSortedPosts } = usePosts();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    // future: navigate to search results
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-box">
        <div className="sidebar-row welcome">
          <span className="welcome-avatar">👤</span>
          <div>
            <div className="welcome-text">Welcome back,</div>
            <div className="welcome-user">@anon_user!</div>
          </div>
        </div>
      </div>

      <div className="sidebar-box">
        <div className="sidebar-label">Search AnonBoard:</div>
        <form onSubmit={handleSearch} className="search-row">
          <input
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
          />
          <button type="submit" className="search-btn">🔍</button>
        </form>
      </div>

      <div className="sidebar-box">
        <div className="sidebar-label">Trending Boards:</div>
        <ul className="board-list">
          <li>e.g., E-ink Devs</li>
          <li>Anonymous Stories</li>
          <li>Paperless World</li>
        </ul>
      </div>

      <button className="create-post-btn" onClick={() => navigate("/create")}>
        ✏️ Create a Post
      </button>

      <div className="sidebar-box stats-box">
        <div className="stats-row">
          <div className="stat">
            <div className="stat-num">2.5k</div>
            <div className="stat-label">Members</div>
          </div>
          <div className="stat">
            <div className="stat-num">10</div>
            <div className="stat-label">Online</div>
          </div>
        </div>
      </div>

      <div className="sidebar-box">
        <select className="board-select">
          <option>Board Rules</option>
          <option>No spam</option>
          <option>Stay anonymous</option>
          <option>Be civil</option>
        </select>
      </div>
    </aside>
  );
}
