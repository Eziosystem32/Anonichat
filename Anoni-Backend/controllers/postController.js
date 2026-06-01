const Post = require('../models/Post');

// ─────────────────────────────────────────────
// GET /api/posts
// Feed with pagination (?page=1&limit=10)
// ─────────────────────────────────────────────
exports.getAllPosts = async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10); // cap at 50
    const skip  = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit), // strip comments from feed; load them on detail view
      Post.countDocuments(),
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
    // Mongoose throws CastError when :id isn't a valid ObjectId
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid post ID' });
    }
    console.error('[getPostById]', err.message);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
};

// ─────────────────────────────────────────────
// POST /api/posts
// Create a new post (protected — needs auth)
// Yassir: authMiddleware attaches req.user
// ─────────────────────────────────────────────
exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    // req.user is set by Yassir's authMiddleware
    // Falls back to 'anon' so the route still works during local dev
    // without auth wired up yet
    const username = req.user?.username || 'anon';

    const post = await Post.create({ title: title.trim(), content: content.trim(), username });

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
// Edit a post (protected — must be author)
// ─────────────────────────────────────────────
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    // Only the author can edit
    const requestingUser = req.user?.username;
    if (post.username !== requestingUser) {
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
// Delete a post (protected — must be author)
// ─────────────────────────────────────────────
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const requestingUser = req.user?.username;
    if (post.username !== requestingUser) {
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
