const express = require('express');
const router  = express.Router();

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

// ─── Protected post routes ────────────────────────────────────────
router.post(  '/',    protect, createPost);
router.put(   '/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);

// ─── Comment routes ───────────────────────────────────────────────
router.post(  '/:postId/comments',                protect, addComment);
router.delete('/:postId/comments/:commentId',     protect, deleteComment);
router.put(   '/:postId/comments/:commentId/vote',         voteComment);

module.exports = router;
