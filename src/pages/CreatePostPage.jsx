import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../api/postService.js";
import { usePosts } from "../context/PostsContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const MAX_CONTENT = 1000;

export default function CreatePostPage() {
  const navigate = useNavigate();
  const { fetchPosts } = usePosts();
  const { currentUser } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [username, setUsername] = useState(currentUser?.username || "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const post = await createPost({
        title: title.trim(),
        content: content.trim(),
        username: username.trim() || "anon",
      });
      await fetchPosts();
      navigate(`/post/${post.id}`);
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-layout center-layout">
      <div className="create-box">
        <div className="create-header">
          CREATE POST | @{currentUser?.username || "anon_user"}
        </div>

        {!currentUser && (
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              className="form-input"
              placeholder="Your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Title</label>
          <input
            className="form-input"
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Content</label>
          <textarea
            className="form-textarea"
            placeholder="Type your story here..."
            value={content}
            maxLength={MAX_CONTENT}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="char-count">
            <span>✓</span>
            <span>{content.length}/{MAX_CONTENT}</span>
          </div>
        </div>

        {error && <div className="form-error">{error}</div>}

        <button
          className="post-submit-btn"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "POSTING..." : "POST"}
        </button>
      </div>
    </div>
  );
}
