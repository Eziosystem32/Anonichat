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
      const newComment = await addComment(id, {
        username,
        content: commentText.trim(),
      });
      setPost((prev) => ({ ...prev, comments: [...prev.comments, newComment] }));
      setCommentText("");
    } finally {
      setSending(false);
    }
  };

  const handlePostVote = async (dir) => {
    if (!post) return;
    const newVotes = await handleVote(post._id, dir);
    setPost((prev) => ({ ...prev, votes: prev.votes + (dir === "up" ? 1 : -1) }));
  };

  if (loading) return <div className="page-layout"><div className="loading">Loading thread...</div></div>;
  if (error || !post) return <div className="page-layout"><div className="loading">{error || "Post not found"}</div></div>;

  return (
    <div className="page-layout detail-layout">
      <div className="detail-container">
        <div className="detail-box">
          <div className="post-card-header">
            <span className="post-author">@{post.username}:</span>
            <span className="post-title"> <em>{post.title}</em></span>
            <span className="post-time">{formatTimestamp(post.timestamp)}</span>
            <span className="post-butterfly">🦋</span>
          </div>
          <div className="detail-content">{post.content}</div>
          <div className="post-card-footer">
            <button className="vote-btn up" onClick={() => handlePostVote("up")}>▲</button>
            <span className="vote-count"> {post.votes} </span>
            <button className="vote-btn down" onClick={() => handlePostVote("down")}>▼</button>
            <span className="footer-sep"> | </span>
            <button className="action-btn">🔗 copy link</button>
            <span className="footer-sep"> | </span>
            <button className="action-btn">Save</button>
          </div>
        </div>

        <div className="comments-section">
          <h3 className="comments-heading">COMMENTS ({post.comments.length})</h3>
          {post.comments.map((c) => (
            <CommentItem key={c.id} comment={c} postId={post._id} />
          ))}
        </div>

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
          <button
            className="send-btn"
            onClick={handleSendComment}
            disabled={sending}
          >
            SEND
          </button>
        </div>
      </div>
    </div>
  );
}
