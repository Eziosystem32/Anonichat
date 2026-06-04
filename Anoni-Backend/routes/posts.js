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



// ─── Public routes ────────────────────────────────────────────────
router.get('/',    getAllPosts);
router.get('/:id', getPostById);

// ─── Protected routes ─────────────────────────────────────────────
router.post('/', optionalAuth, createPost); // optional auth
router.put('/:id', requireAuth, updatePost); // still required
router.delete('/:id', requireAuth, deletePost); // still required

// ─── Eyos: uncomment when comment routes are ready ────────────
// const commentRouter = require('./comments');
// router.use('/:postId/comments', commentRouter);

// ─── Abraham: uncomment when vote routes are ready ───────────────
// const voteRouter = require('./votes');
// router.use('/:id/vote', voteRouter);
// Also add: GET /:id/vote-status for frontend to check if user voted

module.exports = router;
