import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostById, addComment } from "../api/postService.js";
import { usePosts } from "../context/PostsContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import CommentItem from "../components/CommentItem.jsx";
import { formatTimestamp } from "../utils/formatTime.js";

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleVote } = usePosts();
  const { currentUser } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [commentUser, setCommentUser] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [commentsOpen, setCommentsOpen] = useState(true);

  useEffect(() => {
    setLoading(true);
    getPostById(id)
      .then(setPost)
      .catch(() => setError("Post not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSendComment = async () => {
    const username = currentUser?.username || commentUser.trim() || "anon";
    if (!commentText.trim()) return;
    setSending(true);
    try {
      const newComment = await addComment(id, { username, content: commentText.trim() });
      setPost((prev) => ({ ...prev, comments: [...prev.comments, newComment] }));
      setCommentText("");
      setCommentsOpen(true);
    } finally {
      setSending(false);
    }
  };

  const handleCommentDelete = (deletedId) => {
    setPost((prev) => ({
      ...prev,
      comments: prev.comments.filter((c) => c._id !== deletedId),
    }));
  };

  const handlePostVote = async (dir) => {
    if (!post) return;
    await handleVote(post._id, dir);
    setPost((prev) => ({ ...prev, votes: prev.votes + (dir === "up" ? 1 : -1) }));
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  if (loading) return <div className="page-layout"><div className="loading">Loading thread...</div></div>;
  if (error || !post) return <div className="page-layout"><div className="loading">{error || "Post not found"}</div></div>;

  return (
    <div className="page-layout detail-layout">
      <div className="detail-container">

        {/* ── Post card ── */}
        <div className="detail-box">
          <div className="post-card-header">
            <span className="post-author">@{post.username}:</span>
            <span className="post-title"> <em>{post.title}</em></span>
            <span className="post-time">{formatTimestamp(post.timestamp ?? post.createdAt)}</span>
            <span className="post-butterfly">🦋</span>
          </div>
          <div className="detail-content">{post.content}</div>
          <div className="post-card-footer">
            <button className="vote-btn up" onClick={() => handlePostVote("up")}>▲</button>
            <span className="vote-count"> {post.votes} </span>
            <button className="vote-btn down" onClick={() => handlePostVote("down")}>▼</button>
            <span className="footer-sep"> | </span>
            <button className="action-btn" onClick={handleCopyLink}>🔗 copy link</button>
            <span className="footer-sep"> | </span>
            <button className="action-btn">Save</button>
          </div>
        </div>

        {/* ── Comments section ── */}
        <div className="comments-section">
          <button
            className="comments-toggle"
            onClick={() => setCommentsOpen((o) => !o)}
          >
            <span className="comments-heading">
              COMMENTS ({post.comments.length})
            </span>
            <span className="toggle-arrow">{commentsOpen ? "▾" : "▸"}</span>
          </button>

          {commentsOpen && (
            <div className="comments-list">
              {post.comments.length === 0 ? (
                <div className="no-comments">No comments yet. Be the first!</div>
              ) : (
                post.comments.map((c) => (
                  <CommentItem
                    key={c._id}
                    comment={c}
                    postId={post._id}
                    onDelete={handleCommentDelete}
                  />
                ))
              )}
            </div>
          )}
        </div>

        {/* ── Add comment ── */}
        <div className="comment-input-row">
          {!currentUser && (
            <input
              className="comment-input"
              placeholder="Your username..."
              value={commentUser}
              onChange={(e) => setCommentUser(e.target.value)}
              style={{ width: "140px", marginRight: "8px" }}
            />
          )}
          <input
            className="comment-input"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendComment()}
          />
          <button className="send-btn" onClick={handleSendComment} disabled={sending}>
            {sending ? "..." : "SEND"}
          </button>
        </div>

      </div>
    </div>
  );
}
