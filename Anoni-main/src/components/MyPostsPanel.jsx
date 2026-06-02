import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const BASE_URL = "http://localhost:5000/api";

export default function MyPostsPanel() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [posts, setPosts]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId]       = useState(null);
  const [editTitle, setEditTitle]       = useState("");
  const [editContent, setEditContent]   = useState("");

  // fetch this user's posts
  useEffect(() => {
    if (!currentUser) return;
    setLoading(true);
    fetch(`${BASE_URL}/posts?owner=${currentUser.username}`)
      .then((r) => r.json())
      .then((data) => setPosts(data.posts || []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [currentUser]);

  // ── delete ────────────────────────────────
  const handleDelete = async (postId) => {
    if (!confirm("Delete this post? This can't be undone.")) return;
    const res = await fetch(`${BASE_URL}/posts/${postId}`, { method: "DELETE" });
    if (res.ok) setPosts((prev) => prev.filter((p) => p._id !== postId));
  };

  // ── start editing ─────────────────────────
  const startEdit = (post) => {
    setEditingId(post._id);
    setEditTitle(post.title);
    setEditContent(post.content);
  };

  // ── save edit ─────────────────────────────
  const saveEdit = async (postId) => {
    const res = await fetch(`${BASE_URL}/posts/${postId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle, content: editContent }),
    });
    if (res.ok) {
      const updated = await res.json();
      setPosts((prev) => prev.map((p) => (p._id === postId ? updated : p)));
      setEditingId(null);
    }
  };

  if (!currentUser) return null; // hidden when logged out

  return (
    <div className="my-posts-panel">
      <h2 className="my-posts-heading">// MY POSTS</h2>

      {loading && <p className="loading">Loading your posts...</p>}

      {!loading && posts.length === 0 && (
        <p className="loading">You haven't posted anything yet.</p>
      )}

      {posts.map((post) => (
        <div key={post._id} className="my-post-item">
          {editingId === post._id ? (
            // ── edit mode ──────────────────────────
            <div className="my-post-edit">
              <input
                className="comment-input"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Title"
              />
              <textarea
                className="comment-input"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={4}
                placeholder="Content"
                style={{ width: "100%", marginTop: "6px", resize: "vertical" }}
              />
              <div style={{ marginTop: "6px", display: "flex", gap: "8px" }}>
                <button className="send-btn" onClick={() => saveEdit(post._id)}>SAVE</button>
                <button className="action-btn" onClick={() => setEditingId(null)}>CANCEL</button>
              </div>
            </div>
          ) : (
            // ── view mode ──────────────────────────
            <>
              <div
                className="my-post-title"
                onClick={() => navigate(`/post/${post._id}`)}
                style={{ cursor: "pointer" }}
              >
                <span className="post-author">[@{post.username}]</span>{" "}
                <span className="post-title">{post.title}</span>
              </div>
              <div className="my-post-actions">
                <button className="action-btn" onClick={() => startEdit(post)}>✏️ Edit</button>
                <button className="action-btn" onClick={() => handleDelete(post._id)}>🗑️ Delete</button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
