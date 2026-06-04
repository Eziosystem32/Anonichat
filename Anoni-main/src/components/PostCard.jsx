import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePosts } from "../context/PostsContext.jsx";
import { formatTimestamp } from "../utils/formatTime.js";

export default function PostCard({ post }) {
  const navigate = useNavigate();
  const { handleVote } = usePosts();

  const [userVote, setUserVote] = useState("none"); // "upvoted" | "downvoted" | "none"
  const [votes, setVotes]       = useState(post.votes ?? 0);

  const handleClick = () => navigate(`/post/${post._id}`);

  const onVote = async (e, direction) => {
    e.stopPropagation();
    try {
      const result = await handleVote(post._id, direction);
      if (result) {
        setVotes(result.votes);
        setUserVote(result.userVote); // "upvoted" | "downvoted" | "none"
      }
    } catch (_) {}
  };

  return (
    <div className="post-card">
      <div className="post-card-header" onClick={handleClick}>
        <span className="post-author">[@{post.username}]</span>
        <span className="post-title"> {post.title}</span>
        <span className="post-time">{formatTimestamp(post.createdAt)}</span>
        <span className="post-butterfly">🦋</span>
      </div>
      <div className="post-card-body" onClick={handleClick}>
        <p>{post.content}</p>
      </div>
      <div className="post-card-footer">
        <button
          className={`vote-btn up ${userVote === "upvoted" ? "active" : ""}`}
          onClick={(e) => onVote(e, "up")}
          disabled={userVote === "upvoted"}
          title={userVote === "upvoted" ? "Already upvoted" : "Upvote"}
        >
          ▲
        </button>
        <span className="vote-count"> {votes} </span>
        <button
          className={`vote-btn down ${userVote === "downvoted" ? "active" : ""}`}
          onClick={(e) => onVote(e, "down")}
          disabled={userVote === "downvoted"}
          title={userVote === "downvoted" ? "Already downvoted" : "Downvote"}
        >
          ▼
        </button>
        <span className="footer-sep"> | </span>
        <span className="comment-count">💬 {post.commentCount ?? 0}</span>
        <span className="footer-sep"> | </span>
        <button className="action-btn" onClick={handleClick}>Reply</button>
        <span className="footer-sep"> | </span>
        <button className="action-btn">Save</button>
      </div>
    </div>
  );
}
