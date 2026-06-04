const Post = require('../models/Post');

// POST /api/posts/:postId/comments
const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { username, content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Comment content is required' });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const comment = { username: username?.trim() || 'anon', content: content.trim() };
    post.comments.push(comment);
    post.commentCount = (post.commentCount || 0) + 1;
    await post.save();

    const savedComment = post.comments[post.comments.length - 1];
    res.status(201).json(savedComment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/posts/:postId/comments/:commentId
const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    comment.deleteOne();
    post.commentCount = Math.max(0, (post.commentCount || 0) - 1);
    await post.save();
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/posts/:postId/comments/:commentId/vote
const voteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { dir } = req.body; // "up" | "down"

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    comment.votes += dir === 'up' ? 1 : -1;
    await post.save();
    res.json({ votes: comment.votes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addComment, deleteComment, voteComment };
