const Post = require('../models/Post');

// ─────────────────────────────────────────────────────────────
// PATCH /api/posts/:id/vote
// Body: { voteType: "upvote" or "downvote" or "unvote" }
// Per-user vote tracking to prevent infinite voting
// ─────────────────────────────────────────────────────────────
exports.votePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { voteType } = req.body;

    const userId = req.user?.username || req.ip || 'anonymous';

    if (!['upvote', 'downvote', 'unvote'].includes(voteType)) {
      return res.status(400).json({
        error: 'Invalid vote type. Use "upvote", "downvote", or "unvote"'
      });
    }

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    if (!post.upvotedBy)   post.upvotedBy   = [];
    if (!post.downvotedBy) post.downvotedBy = [];

    const hasUpvoted   = post.upvotedBy.includes(userId);
    const hasDownvoted = post.downvotedBy.includes(userId);

    if (voteType === 'upvote') {
      if (hasUpvoted) {
        post.upvotedBy = post.upvotedBy.filter(u => u !== userId);
        post.votes -= 1;
      } else {
        post.upvotedBy.push(userId);
        post.votes += 1;
        if (hasDownvoted) {
          post.downvotedBy = post.downvotedBy.filter(u => u !== userId);
          post.votes += 1;
        }
      }
    } else if (voteType === 'downvote') {
      if (hasDownvoted) {
        post.downvotedBy = post.downvotedBy.filter(u => u !== userId);
        post.votes += 1;
      } else {
        post.downvotedBy.push(userId);
        post.votes -= 1;
        if (hasUpvoted) {
          post.upvotedBy = post.upvotedBy.filter(u => u !== userId);
          post.votes -= 1;
        }
      }
    } else if (voteType === 'unvote') {
      if (hasUpvoted) {
        post.upvotedBy = post.upvotedBy.filter(u => u !== userId);
        post.votes -= 1;
      }
      if (hasDownvoted) {
        post.downvotedBy = post.downvotedBy.filter(u => u !== userId);
        post.votes += 1;
      }
    }

    await post.save();

    res.json({
      votes: post.votes,
      userVote: post.upvotedBy.includes(userId) ? 'upvoted' :
                (post.downvotedBy.includes(userId) ? 'downvoted' : 'none'),
      upvoteCount:   post.upvotedBy.length,
      downvoteCount: post.downvotedBy.length,
    });

  } catch (err) {
    if (err.name === 'CastError') return res.status(400).json({ error: 'Invalid post ID' });
    console.error('[votePost]', err.message);
    res.status(500).json({ error: 'Failed to vote on post' });
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/posts/:id/votes
// Get vote statistics for a post
// ─────────────────────────────────────────────────────────────
exports.getPostVotes = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.username || req.ip || 'anonymous';

    const post = await Post.findById(id).select('votes upvotedBy downvotedBy');
    if (!post) return res.status(404).json({ error: 'Post not found' });

    res.json({
      votes:         post.votes,
      upvoteCount:   post.upvotedBy?.length   || 0,
      downvoteCount: post.downvotedBy?.length || 0,
      userVote: post.upvotedBy?.includes(userId)   ? 'upvoted' :
                post.downvotedBy?.includes(userId) ? 'downvoted' : 'none',
    });

  } catch (err) {
    if (err.name === 'CastError') return res.status(400).json({ error: 'Invalid post ID' });
    console.error('[getPostVotes]', err.message);
    res.status(500).json({ error: 'Failed to get vote stats' });
  }
};
