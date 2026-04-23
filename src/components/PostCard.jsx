import { useNavigate } from "react-router-dom";
import { usePosts } from "../context/PostsContext.jsx";
import { formatTimestamp } from "../utils/formatTime.js";

export default function PostCard({ post }) {
  const navigate = useNavigate();
  const { handleVote } = usePosts();

  const handleClick = () => navigate(`/post/${post.id}`);

  return (
    <div className="post-card">
      <div className="post-card-header" onClick={handleClick}>
        <span className="post-author">[@{post.username}]</span>
        <span className="post-title"> {post.title}</span>
        <span className="post-time">{formatTimestamp(post.timestamp)}</span>
        <span className="post-butterfly">🦋</span>
      </div>
      <div className="post-card-body" onClick={handleClick}>
        <p>{post.content}</p>
      </div>
      <div className="post-card-footer">
        <button
          className="vote-btn up"
          onClick={(e) => { e.stopPropagation(); handleVote(post.id, "up"); }}
        >
          ▲
        </button>
        <span className="vote-count"> {post.votes} </span>
        <button
          className="vote-btn down"
          onClick={(e) => { e.stopPropagation(); handleVote(post.id, "down"); }}
        >
          ▼
        </button>
        <span className="footer-sep"> | </span>
        <span className="comment-count">💬 {post.comments.length}</span>
        <span className="footer-sep"> | </span>
        <button className="action-btn" onClick={handleClick}>Reply</button>
        <span className="footer-sep"> | </span>
        <button className="action-btn">Save</button>
      </div>
    </div>
  );
}
