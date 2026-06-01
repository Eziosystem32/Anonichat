const express = require('express');
const router  = express.Router();

const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} = require('../controllers/postController');

// ─── Yassir: drop your authMiddleware import here ──────────────
// const { protect } = require('../middleware/authMiddleware');
// Once it exists, swap the placeholder below for `protect`
// ──────────────────────────────────────────────────────────────────

// Temporary no-op so routes work locally before auth is wired up.
// DELETE this block once Yassir's middleware is merged.
const protect = (req, _res, next) => {
  // TODO: remove this stub and import Yassir's real middleware
  next();
};

// ─── Public routes ────────────────────────────────────────────────
router.get('/',    getAllPosts);   // GET  /api/posts
router.get('/:id', getPostById);  // GET  /api/posts/:id

// ─── Protected routes (require auth) ──────────────────────────────
router.post(  '/',    protect, createPost);  // POST   /api/posts
router.put(   '/:id', protect, updatePost);  // PUT    /api/posts/:id
router.delete('/:id', protect, deletePost);  // DELETE /api/posts/:id

// ─── Eyos: mount your comment router here ─────────────────────
// Example (once your file exists):
// const commentRouter = require('./comments');
// router.use('/:postId/comments', commentRouter);
// ──────────────────────────────────────────────────────────────────

module.exports = router;
