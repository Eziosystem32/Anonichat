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

const protect = (req, _res, next) => {
 // import Yassir's real middleware
  next();
};

// ─── Public routes ────────────────────────────────────────────────
router.get('/',    getAllPosts);
router.get('/:id', getPostById);

// ─── Protected routes ─────────────────────────────────────────────
router.post('/', optionalAuth, createPost); // optional auth
router.put('/:id', requireAuth, updatePost); // still required
router.delete('/:id', requireAuth, deletePost); // still required

// ─── Comment routes ───────────────────────────────────────────────
router.post(  '/:postId/comments',                protect, addComment);
router.delete('/:postId/comments/:commentId',     protect, deleteComment);
router.put(   '/:postId/comments/:commentId/vote',         voteComment);

// ─── Abraham: uncomment when vote routes are ready ───────────────
// const voteRouter = require('./votes');
// router.use('/:id/vote', voteRouter);
// Also add: GET /:id/vote-status for frontend to check if user voted

module.exports = router;
