import { useState } from "react";
import { deleteComment, voteComment } from "../api/postService.js";
import { useAuth } from "../context/AuthContext.jsx";
import { formatTimestamp } from "../utils/formatTime.js";

export default function CommentItem({ comment, postId, onDelete }) {
  const { currentUser } = useAuth();
  const [votes, setVotes] = useState(comment.votes ?? 0);
  const [deleted, setDeleted] = useState(false);
  const [voting, setVoting] = useState(false);

  if (deleted) return null;

  const handleVote = async (dir) => {
    if (voting) return;
    setVoting(true);
    try {
      const data = await voteComment(postId, comment._id, dir);
      setVotes(data.votes);
    } finally {
      setVoting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await deleteComment(postId, comment._id);
      setDeleted(true);
      onDelete?.(comment._id);
    } catch {
      alert("Could not delete comment.");
    }
  };

  const isOwner = currentUser?.username === comment.username;

  return (
    <div className="comment-item">
      <div className="comment-header">
        <span className="comment-author">@{comment.username}</span>
        <span className="comment-time">{formatTimestamp(comment.createdAt)}</span>
        {isOwner && (
          <button className="comment-delete-btn" onClick={handleDelete} title="Delete comment">
            ✕
          </button>
        )}
      </div>
      <div className="comment-body">{comment.content}</div>
      <div className="comment-footer">
        <button className="vote-btn up" onClick={() => handleVote("up")} disabled={voting}>▲</button>
        <span className="vote-count">{votes}</span>
        <button className="vote-btn down" onClick={() => handleVote("down")} disabled={voting}>▼</button>
      </div>
    </div>
  );
}
