const mongoose = require('mongoose');

// -----------------------------------------------------------
// Comment sub-schema
// Abraham: add voteCount fields here when you integrate votes
// Eyos: match this shape when you wire up comment routes
// -----------------------------------------------------------
const CommentSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: [2000, 'Comment cannot exceed 2000 characters'],
    },
    votes: {
      type: Number,
      default: 0,
    },
    // Abraham: add upvotes / downvotes arrays here for per-user tracking
    // upvotedBy:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    // downvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

// -----------------------------------------------------------
// Post schema
// Abraham: voteCount / upvotedBy / downvotedBy stubs below
// -----------------------------------------------------------
const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
      maxlength: [10000, 'Content cannot exceed 10,000 characters'],
    },

    // display name — can be anything, fake or real, anonymous posting
    username: {
      type: String,
      required: true,
      trim: true,
    },

    // real owner — used for edit/delete auth
    // stored as username for now (mock auth)
    // Yassir: swap this to { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    // when real auth is ready
    ownerId: {
      type: String,
      required: true,
      trim: true,
    },

    // --- Votes (Abraham owns this block) --------------------
    votes: {
      type: Number,
      default: 0,
    },

    commentCount: {
  type: Number,
  default: 0,
},
    // Abraham: uncomment and expand when implementing per-user vote tracking
    // upvotedBy:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    // downvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    // ---------------------------------------------------------

    // --- Comments (Eyos owns this block) -----------------
    // Eyos: you can embed comments here OR use a ref to your
    // own Comment collection. If you use a separate collection,
    // replace this with:
    //   comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
    comments: [CommentSchema],
    // ---------------------------------------------------------
  },
  {
    timestamps: true, // adds createdAt + updatedAt automatically
  }
);

// Indexes
PostSchema.index({ createdAt: -1 });
PostSchema.index({ ownerId: 1 }); // for GET /api/posts?owner=username

module.exports = mongoose.model('Post', PostSchema);


