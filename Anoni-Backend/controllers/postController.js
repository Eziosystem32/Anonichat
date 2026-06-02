const Post = require('../models/Post');

// ─────────────────────────────────────────────
// GET /api/posts
// Feed with pagination (?page=1&limit=10)
// Optional: ?owner=username to get a user's posts
// ─────────────────────────────────────────────
exports.getAllPosts = async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const skip  = (page - 1) * limit;

    // if ?owner=username is passed, filter by that owner
    const filter = req.query.owner ? { ownerId: req.query.owner } : {};

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-comments'),
      Post.countDocuments(filter),
    ]);

    res.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (err) {
    console.error('[getAllPosts]', err.message);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

// ─────────────────────────────────────────────
// GET /api/posts/:id
// Single post — comments included
// ─────────────────────────────────────────────
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    if (err.name === 'CastError') return res.status(400).json({ error: 'Invalid post ID' });
    console.error('[getPostById]', err.message);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
};

// ─────────────────────────────────────────────
// POST /api/posts
// Create a new post
// username = fake display name (can be anything)
// ownerId  = real logged in user (for managing posts later)
// ─────────────────────────────────────────────
exports.createPost = async (req, res) => {
  try {
    const { title, content, username } = req.body;

    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    // display name: use what they typed, fall back to anon
    const displayName = username?.trim() || 'anon';

    // owner: real logged in user from auth middleware
    // Person C: req.user will be set by your middleware
    // falls back to displayName for now (mock auth)
    const ownerId = req.user?.username || displayName;

    const post = await Post.create({
      title: title.trim(),
      content: content.trim(),
      username: displayName,
      ownerId,
    });

    res.status(201).json(post);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    console.error('[createPost]', err.message);
    res.status(500).json({ error: 'Failed to create post' });
  }
};

// ─────────────────────────────────────────────
// PUT /api/posts/:id
// Edit a post — only the owner can do this
// ─────────────────────────────────────────────
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const requestingUser = req.user?.username;
    if (post.ownerId !== requestingUser) {
      return res.status(403).json({ error: 'Not authorised to edit this post' });
    }

    const { title, content } = req.body;
    if (title?.trim())   post.title   = title.trim();
    if (content?.trim()) post.content = content.trim();

    await post.save();
    res.json(post);
  } catch (err) {
    if (err.name === 'CastError')       return res.status(400).json({ error: 'Invalid post ID' });
    if (err.name === 'ValidationError') return res.status(400).json({ error: err.message });
    console.error('[updatePost]', err.message);
    res.status(500).json({ error: 'Failed to update post' });
  }
};

// ─────────────────────────────────────────────
// DELETE /api/posts/:id
// Delete a post — only the owner can do this
// ─────────────────────────────────────────────
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const requestingUser = req.user?.username;
    if (post.ownerId !== requestingUser) {
      return res.status(403).json({ error: 'Not authorised to delete this post' });
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (err) {
    if (err.name === 'CastError') return res.status(400).json({ error: 'Invalid post ID' });
    console.error('[deletePost]', err.message);
    res.status(500).json({ error: 'Failed to delete post' });
  }
};
