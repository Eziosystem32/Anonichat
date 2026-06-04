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

<<<<<<< HEAD

=======
const { addComment, deleteComment, voteComment } = require('../controllers/commentController');

const protect = (req, _res, next) => {
 // import Yassir's real middleware
  next();
};
>>>>>>> f51d8b7d13b0dbed6d3fa5ef3cb38f122ecf086c

// ─── Public routes ────────────────────────────────────────────────
router.get('/',    getAllPosts);
router.get('/:id', getPostById);

<<<<<<< HEAD
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
=======
// ─── Protected post routes ────────────────────────────────────────
router.post(  '/',    protect, createPost);
router.put(   '/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);

// ─── Comment routes ───────────────────────────────────────────────
router.post(  '/:postId/comments',                protect, addComment);
router.delete('/:postId/comments/:commentId',     protect, deleteComment);
router.put(   '/:postId/comments/:commentId/vote',         voteComment);
>>>>>>> f51d8b7d13b0dbed6d3fa5ef3cb38f122ecf086c

module.exports = router;
