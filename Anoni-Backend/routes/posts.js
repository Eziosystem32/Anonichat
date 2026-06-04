const express = require('express');
const router  = express.Router();

const { requireAuth, optionalAuth } = require('../middleware/authMiddleware');

const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} = require('../controllers/postController');

const { addComment, deleteComment, voteComment } = require('../controllers/commentController');
const { votePost, getPostVotes }                 = require('../controllers/voteController');

// ─── Public routes ────────────────────────────────────────────────
router.get('/',          getAllPosts);
router.get('/:id',       getPostById);
router.get('/:id/votes', getPostVotes);

// ─── Post routes ──────────────────────────────────────────────────
router.post(  '/',    optionalAuth, createPost);
router.put(   '/:id', requireAuth,  updatePost);
router.delete('/:id', requireAuth,  deletePost);

// ─── Vote routes ──────────────────────────────────────────────────
router.patch('/:id/vote', optionalAuth, votePost);

// ─── Comment routes ───────────────────────────────────────────────
router.post(  '/:postId/comments',                 optionalAuth, addComment);
router.delete('/:postId/comments/:commentId',      requireAuth,  deleteComment);
router.put(   '/:postId/comments/:commentId/vote', optionalAuth, voteComment);

module.exports = router;
