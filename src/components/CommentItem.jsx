import { formatTimestamp } from "../utils/formatTime.js";
import { voteComment } from "../api/postService.js";
import { useState } from "react";

export default function CommentItem({ comment, postId, onVoteUpdate }) {
  const [votes, setVotes] = useState(comment.votes);

  const handleVote = async (dir) => {
    const newVotes = await voteComment(postId, comment.id, dir);
    setVotes(newVotes);
    if (onVoteUpdate) onVoteUpdate(comment.id, newVotes);
  };

  return (
    <div className="comment-item">
      <div className="comment-header">
        <span className="comment-author">@{comment.username}:</span>
        <span className="comment-time">{formatTimestamp(comment.timestamp)}</span>
        <span className="post-butterfly">🦋</span>
      </div>
      <div className="comment-body">{comment.content}</div>
      <div className="comment-footer">
        <button className="vote-btn up" onClick={() => handleVote("up")}>▲</button>
        <span className="vote-count"> {votes} </span>
        <button className="vote-btn down" onClick={() => handleVote("down")}>▼</button>
        <span className="footer-sep"> | </span>
        <button className="action-btn">🔗 copy link</button>
        <span className="footer-sep"> | </span>
        <button className="action-btn">↩ Reply</button>
        <span className="footer-sep"> | </span>
        <button className="action-btn">Save</button>
      </div>
    </div>
  );
}
