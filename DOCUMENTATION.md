# AnonBoard — Full Code Documentation 📖
### *the "what does this line even do" book*

> written for the defense. read this. understand it. survive.

---

# TABLE OF CONTENTS

1. [How the whole app fits together](#1-how-the-whole-app-fits-together)
2. [Backend Entry Points — server.js + app.js](#2-backend-entry-points)
3. [Database Connection — config/db.js](#3-database-connection)
4. [Auth Middleware — middleware/authMiddleware.js](#4-auth-middleware)
5. [Models — Post.js + User.js](#5-models)
6. [Routes — posts.js + auth.js](#6-routes)
7. [Controllers — auth, post, comment, vote](#7-controllers)
8. [Frontend — Services (authService, postService)](#8-frontend-services)
9. [Frontend — Context (AuthContext, PostsContext)](#9-frontend-context)
10. [Frontend — Pages and Components](#10-frontend-pages-and-components)

---

# 1. HOW THE WHOLE APP FITS TOGETHER

```
BROWSER (React)
    │
    │  HTTP requests (fetch)
    ▼
EXPRESS SERVER (Node.js) — port 5000
    │
    │  Mongoose queries
    ▼
MONGODB — port 27017
```

When a user does something in the browser (like clicking "Post"):

1. React calls a function in `postService.js`
2. That function sends an HTTP request to `localhost:5000`
3. Express receives it, runs it through middleware (cors, json parsing, auth check)
4. The right controller function handles it
5. The controller talks to MongoDB through Mongoose
6. MongoDB sends back data
7. Controller sends JSON back to the browser
8. React updates the UI

That's literally the whole thing. Every feature follows this exact flow.

---

# 2. BACKEND ENTRY POINTS

## server.js
```javascript
const app = require('./app');
```
> imports the express app we configured in app.js. `require` is Node's way of importing files. `./app` means "app.js in the same folder"

```javascript
const connectDB = require('./config/db');
```
> imports the function that connects to MongoDB. it lives in config/db.js

```javascript
const PORT = process.env.PORT || 5000;
```
> `process.env.PORT` reads the PORT variable from your `.env` file. The `|| 5000` means "if PORT isn't set, use 5000". this is so you can change the port without touching code.

```javascript
connectDB().then(() => {
```
> calls connectDB() which returns a Promise. `.then()` means "when that's done successfully, do this". we wait for DB to connect BEFORE starting the server — otherwise the server would be running but couldn't talk to the database.

```javascript
  app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
  });
```
> `app.listen()` actually starts the HTTP server. it opens port 5000 and waits for requests. the callback (the arrow function) just logs a message so you know it worked.

```javascript
}).catch(err => {
  console.error('Failed to connect to database:', err);
  process.exit(1);
});
```
> if `connectDB()` fails (like MongoDB isn't running), we log the error and call `process.exit(1)`. exit code 1 means "something went wrong". this prevents the server from running in a broken state.

---

## app.js
```javascript
require('dotenv').config();
```
> loads your `.env` file and puts all the variables into `process.env`. this MUST be the first line so everything below can read those variables. if this isn't called first, `process.env.JWT_SECRET` would be undefined.

```javascript
const express = require('express');
const cors    = require('cors');
```
> `express` is the web framework. `cors` is Cross-Origin Resource Sharing — it lets the frontend (port 5173) talk to the backend (port 5000). without cors, browsers block requests between different ports.

```javascript
const app = express();
```
> creates the express application. think of `app` as the server object. everything gets configured on it.

```javascript
app.use(cors());
```
> tells express to allow requests from any origin. `app.use()` registers middleware — code that runs on EVERY request before it reaches a route handler.

```javascript
app.use(express.json());
```
> tells express to automatically parse JSON request bodies. without this, `req.body` would be undefined when someone sends JSON. this is what lets `postController.js` do `const { title, content } = req.body`.

```javascript
app.use(express.urlencoded({ extended: false }));
```
> parses URL-encoded form data (like old HTML forms). `extended: false` means use the basic parser. we include this for compatibility even though our app mostly uses JSON.

```javascript
app.use('/api/posts', postRoutes);
app.use('/api/auth',  authRoutes);
```
> mounts routers. when a request comes in to `/api/posts/anything`, express passes it to `postRoutes`. when it comes to `/api/auth/anything`, it goes to `authRoutes`. this is how we organize routes into separate files.

```javascript
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
```
> health check endpoint. the `_req` with underscore means "I know there's a request parameter but I'm not using it". returns `{ status: 'ok' }` so we can quickly test if the server is alive.

```javascript
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));
```
> 404 catch-all. this runs when NO other route matched. the order matters — this HAS to be after all the real routes.

```javascript
app.use((err, _req, res, _next) => {
  console.error('[Unhandled error]', err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});
```
> global error handler. express knows this is an error handler because it has FOUR parameters (err, req, res, next). if any route throws an unhandled error, express catches it here instead of crashing. `err.stack` includes the full error traceback for debugging.

```javascript
module.exports = app;
```
> exports the app so server.js can import it. without this line, `require('./app')` in server.js would get nothing.

---

# 3. DATABASE CONNECTION

## config/db.js
```javascript
const mongoose = require('mongoose');
```
> Mongoose is the library we use to talk to MongoDB. it's called an ODM (Object Document Mapper) — it lets us define schemas and models instead of writing raw MongoDB queries.

```javascript
const connectDB = async () => {
```
> `async` means this function can use `await` inside it. we export this function so server.js can call it.

```javascript
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/anonichat');
```
> `await` pauses execution until the connection is established. `process.env.MONGO_URI` reads the database URL from `.env`. the fallback `mongodb://127.0.0.1:27017/anonichat` connects to local MongoDB and creates (or uses) a database called `anonichat`. `127.0.0.1` is just another way to write `localhost`.

```javascript
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
```
> `conn.connection.host` is the hostname we connected to (127.0.0.1 in development). the backtick string with `${}` is a template literal — JavaScript's way of putting variables inside strings.

```javascript
  } catch (error) {
    console.error(`❌ Database Connection Error: ${error.message}`);
    process.exit(1);
  }
```
> if mongoose.connect() throws an error (MongoDB not running, wrong URL, etc.), we catch it, log it, and exit. `process.exit(1)` stops the Node process entirely.

---

# 4. AUTH MIDDLEWARE

## middleware/authMiddleware.js

This file exports two functions: `requireAuth` and `optionalAuth`. Both are **middleware** — functions that run between receiving a request and sending a response.

### requireAuth
```javascript
const requireAuth = async (req, res, next) => {
```
> middleware functions always take `(req, res, next)`. `req` is the request, `res` is the response, `next` is a function to call to pass control to the next middleware or route handler.

```javascript
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
```
> we look for the token in the `Authorization` header. the format is `Bearer eyJhbGci...`. `?.startsWith` uses optional chaining — if `authorization` is undefined, it doesn't crash, just returns undefined. `.split(' ')[1]` splits `"Bearer TOKEN"` by space and takes the second part (index 1) which is the actual token.

```javascript
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
```
> 401 means "Unauthorized". if there's no token, we stop here and return an error. `return` is important — without it, the code would keep running after sending the response which causes crashes.

```javascript
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
```
> `jwt.verify()` does two things: checks the token's signature (proves it was made by us, not faked) and decodes the payload. if the token is expired or tampered with, this throws an error. the payload contains the user's `id` that we put in when creating the token.

```javascript
  req.user = await User.findById(decoded.id);
```
> we take the user ID from the token, look them up in the database, and attach the full user object to `req.user`. this is how controllers like `postController.js` know WHO is making the request — they just read `req.user`.

```javascript
  if (!req.user) {
    return res.status(401).json({ message: 'User not found' });
  }
  next();
```
> if the user was deleted from the DB after the token was issued, we reject the request. otherwise `next()` passes control to the actual route handler.

### optionalAuth
```javascript
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
    }
  } catch (_) {}
  next();
```
> same as requireAuth but we ALWAYS call `next()` at the end regardless. if there's no token, `req.user` stays undefined and the request continues as anonymous. the `catch (_) {}` swallows errors silently — if the token is invalid, we just treat it as unauthenticated instead of blocking the request. this is used for routes that work both logged in AND anonymous (like creating a post).

---

# 5. MODELS

Models define the shape of data in MongoDB. Mongoose enforces these rules before saving anything.

## models/Post.js

### CommentSchema (embedded inside Post)
```javascript
const CommentSchema = new mongoose.Schema({
```
> `mongoose.Schema` defines the shape and rules for a document. `CommentSchema` is not a full collection — it's embedded inside PostSchema. this means comments are stored INSIDE the post document, not in a separate collection.

```javascript
  username: { type: String, required: true, trim: true },
```
> `type: String` — must be text. `required: true` — can't be empty. `trim: true` — automatically removes leading/trailing spaces before saving. so `"  anon  "` becomes `"anon"`.

```javascript
  content: { type: String, required: true, trim: true, maxlength: [2000, 'Comment cannot exceed 2000 characters'] },
```
> `maxlength: [2000, 'message']` — array format lets you provide a custom error message. if content is over 2000 chars, Mongoose throws a ValidationError with that message.

```javascript
  votes: { type: Number, default: 0 },
```
> `default: 0` means if you create a comment without specifying votes, it automatically starts at 0.

```javascript
}, { timestamps: true });
```
> `{ timestamps: true }` tells Mongoose to automatically add `createdAt` and `updatedAt` fields. Mongoose manages these — you never set them manually.

### PostSchema
```javascript
  username: { type: String, required: true, trim: true },
```
> the DISPLAY name. can be "anon", "batman42", whatever the user typed. this is shown publicly.

```javascript
  ownerId: { type: String, required: true, trim: true },
```
> the REAL owner. stores the logged-in user's username. used to check if someone is allowed to edit/delete a post. separate from `username` because the display name can be fake but we need to track real ownership.

```javascript
  votes: { type: Number, default: 0 },
```
> current vote score. incremented/decremented by voteController.

```javascript
  commentCount: { type: Number, default: 0 },
```
> cached count of comments. we update this manually in commentController when comments are added/deleted. this way the feed can show comment counts without loading ALL comment data.

```javascript
  comments: [CommentSchema],
```
> an array of embedded comment documents. `[CommentSchema]` means "array where each item matches CommentSchema". MongoDB stores these inside the post document itself.

```javascript
PostSchema.index({ createdAt: -1 });
PostSchema.index({ ownerId: 1 });
```
> database indexes. without indexes, MongoDB scans every document to find matches (slow). with indexes, it uses a lookup table (fast). `-1` means descending (newest first for the feed). `1` means ascending. indexes speed up `find()` and `sort()` operations.

---

## models/User.js
```javascript
const bcrypt = require('bcryptjs');
```
> bcrypt is a password hashing library. NEVER store plain text passwords. bcrypt turns `"mypassword"` into something like `"$2a$12$xyz..."` that can't be reversed.

```javascript
  password: { type: String, required: true, minlength: 6, select: false },
```
> `select: false` means this field is EXCLUDED from query results by default. so when you do `User.findById(id)`, the password hash is NOT included. you have to explicitly ask for it with `.select('+password')`. this prevents accidentally leaking passwords in API responses.

```javascript
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
```
> `.pre('save')` is a Mongoose hook — it runs BEFORE every save operation. `this` refers to the document being saved. `this.isModified('password')` checks if the password field changed — we don't want to re-hash an already hashed password. `bcrypt.hash(password, 12)` hashes with 12 "salt rounds" — higher = more secure but slower. 12 is the industry standard.

```javascript
userSchema.methods.comparePasswords = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
```
> adds a custom method to every User document. `bcrypt.compare()` hashes the candidate password and compares it to the stored hash. returns true/false. we use this in `authController.login` to verify the password.

---

# 6. ROUTES

Routes are just URL → function mappings. They don't contain logic — they just say "when this URL is hit, call this function".

## routes/posts.js

```javascript
const { requireAuth, optionalAuth } = require('../middleware/authMiddleware');
```
> destructuring import. grabs `requireAuth` and `optionalAuth` from the exports of authMiddleware.js. `../` means go up one folder.

```javascript
router.get('/', getAllPosts);
```
> when GET `/api/posts` is received, call `getAllPosts`. no middleware — anyone can see the feed.

```javascript
router.post('/', optionalAuth, createPost);
```
> when POST `/api/posts` is received, FIRST run `optionalAuth` (which sets `req.user` if there's a token), THEN run `createPost`. middleware runs left to right.

```javascript
router.put('/:id', requireAuth, updatePost);
router.delete('/:id', requireAuth, deletePost);
```
> `:id` is a URL parameter — it matches anything and puts the value in `req.params.id`. `requireAuth` blocks anonymous users. you must be logged in to edit or delete.

```javascript
router.patch('/:id/vote', optionalAuth, votePost);
```
> PATCH is for partial updates (just changing the vote count). optional auth so both logged-in and anonymous users can vote. anonymous votes are tracked by IP address.

```javascript
router.post('/:postId/comments', optionalAuth, addComment);
router.delete('/:postId/comments/:commentId', requireAuth, deleteComment);
router.put('/:postId/comments/:commentId/vote', optionalAuth, voteComment);
```
> nested routes. `:postId` is the post's ID, `:commentId` is the comment's ID. both are available in `req.params`. delete requires auth, vote and add are optional.

---

## routes/auth.js
```javascript
router.post('/register', register);
router.post('/login',    login);
router.get('/me',        requireAuth, getMe);
```
> `/register` and `/login` are public (no middleware). `/me` requires a valid token — it's used to restore the user's session when they refresh the page.

---

# 7. CONTROLLERS

Controllers contain the actual logic. They read from `req`, talk to the database, and send back `res`.

## controllers/authController.js

### signToken (helper)
```javascript
const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
```
> creates a JWT token. `jwt.sign(payload, secret, options)`. the payload `{ id: userId }` is what gets encoded into the token. `JWT_SECRET` is the private key — only our server knows it. `expiresIn: '7d'` means the token expires in 7 days. after that, the user has to log in again.

### register
```javascript
const existing = await User.findOne({ $or: [{ email }, { username }] });
if (existing) {
  return res.status(400).json({ message: 'Username or email already taken' });
}
```
> `$or` is a MongoDB operator — finds documents where email matches OR username matches. this prevents duplicate accounts. 400 means "Bad Request" — the client sent invalid data.

```javascript
const user  = await User.create({ username, email, password });
const token = signToken(user._id);
res.status(201).json({
  token,
  user: { id: user._id, username: user.username, email: user.email },
});
```
> `User.create()` creates and saves the document in one step. The `pre('save')` hook automatically hashes the password. 201 means "Created". we return the token immediately so the user is logged in right after registering. note we do NOT include the password in the response.

### login
```javascript
const user = await User.findOne({ email }).select('+password');
```
> `.select('+password')` explicitly includes the password field (which is excluded by default). we need it here to compare with what the user typed.

```javascript
const isMatch = await user.comparePasswords(password);
if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
```
> calls our custom bcrypt method. we say "Invalid credentials" instead of "Wrong password" — this prevents attackers from knowing whether the email or password was wrong (security best practice).

---

## controllers/postController.js

### getAllPosts
```javascript
const page  = Math.max(1, parseInt(req.query.page)  || 1);
const limit = Math.min(50, parseInt(req.query.limit) || 10);
const skip  = (page - 1) * limit;
```
> `req.query` contains URL query parameters (the stuff after `?`). `parseInt` converts the string `"2"` to the number `2`. `Math.max(1, ...)` prevents page 0 or negative pages. `Math.min(50, ...)` caps the limit at 50 so someone can't request 10,000 posts at once. `skip` is how many documents to skip — page 2 with limit 10 skips the first 10.

```javascript
const filter = req.query.owner ? { ownerId: req.query.owner } : {};
```
> ternary operator: if `?owner=username` is in the URL, filter posts by that owner. otherwise empty object `{}` means no filter (get all posts). this powers the "My Posts" panel.

```javascript
const [posts, total] = await Promise.all([
  Post.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).select('-comments'),
  Post.countDocuments(filter),
]);
```
> `Promise.all([...])` runs both database queries AT THE SAME TIME instead of one after the other. faster. `.sort({ createdAt: -1 })` sorts newest first. `.select('-comments')` excludes the comments array — the feed doesn't need full comment content, just the count. `-` before a field name means exclude.

### createPost
```javascript
const displayName = username?.trim() || 'anon';
const ownerId = req.user?.username || displayName;
```
> `?.` is optional chaining — if `username` is undefined, don't crash, just return undefined. `|| 'anon'` means fall back to 'anon'. for ownerId: if logged in (`req.user` exists), use their real username. if anonymous, use the display name they typed. this is the core of the "anonymous but ownable" design.

### updatePost / deletePost
```javascript
const requestingUser = req.user?.username;
if (post.ownerId !== requestingUser) {
  return res.status(403).json({ error: 'Not authorised to edit this post' });
}
```
> 403 means "Forbidden" — you're authenticated but not allowed. we compare the stored `ownerId` against the logged-in user. if they don't match, you can't edit/delete. this is the ownership check.

---

## controllers/commentController.js

### addComment
```javascript
const comment = { username: username?.trim() || 'anon', content: content.trim() };
post.comments.push(comment);
post.commentCount = (post.commentCount || 0) + 1;
await post.save();
```
> we push the new comment into the `post.comments` array in memory, then increment `commentCount`, then `post.save()` saves the whole post document (including the new comment) back to MongoDB. Mongoose detects what changed and only updates those fields.

```javascript
const savedComment = post.comments[post.comments.length - 1];
res.status(201).json(savedComment);
```
> after saving, Mongoose has assigned a `_id` to the new comment. we get it by reading the last element of the array. we return this so the frontend can display the new comment immediately without refetching.

### deleteComment
```javascript
const comment = post.comments.id(commentId);
```
> `.id()` is a Mongoose method on embedded document arrays — it finds a subdocument by its `_id`. much cleaner than doing `.find()` manually.

```javascript
comment.deleteOne();
post.commentCount = Math.max(0, (post.commentCount || 0) - 1);
await post.save();
```
> `.deleteOne()` removes the comment from the array in memory. `Math.max(0, ...)` prevents the count going negative. then save.

---

## controllers/voteController.js

### votePost
```javascript
const userId = req.user?.username || req.ip || 'anonymous';
```
> for logged-in users, use their username. for anonymous users, use their IP address. this is how we prevent the same person from voting twice even without an account. `req.ip` is provided by Express automatically.

```javascript
const hasUpvoted   = post.upvotedBy.includes(userId);
const hasDownvoted = post.downvotedBy.includes(userId);
```
> checks if this user already voted by looking for their ID in the arrays.

```javascript
if (voteType === 'upvote') {
  if (hasUpvoted) {
    // toggle off — remove the upvote
    post.upvotedBy = post.upvotedBy.filter(u => u !== userId);
    post.votes -= 1;
  } else {
    // add upvote
    post.upvotedBy.push(userId);
    post.votes += 1;
    if (hasDownvoted) {
      // also remove the downvote if they had one
      post.downvotedBy = post.downvotedBy.filter(u => u !== userId);
      post.votes += 1;
    }
  }
}
```
> toggle logic: clicking upvote when already upvoted removes it. clicking upvote when downvoted switches the vote (removes downvote, adds upvote, adjusts count by +2 total). `.filter(u => u !== userId)` creates a new array without that user — this is how you remove an item from an array in JavaScript.

---

# 8. FRONTEND SERVICES

## src/api/authService.js

```javascript
const BASE_URL = 'http://localhost:5000/api';
```
> the backend URL. all API calls prepend this. in production you'd change this to your real domain.

```javascript
export const loginUser = async (credentials) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: credentials.email || credentials.username, password: credentials.password }),
  });
```
> `fetch` is the browser's built-in HTTP client. `method: 'POST'` sends data. `Content-Type: application/json` tells the server what format we're sending. `JSON.stringify()` converts the JavaScript object to a JSON string. `credentials.email || credentials.username` means "use email if provided, otherwise try username field" — handles both cases.

```javascript
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  localStorage.setItem('token', data.token);
  return data.user;
};
```
> `res.json()` parses the JSON response body. `res.ok` is true if status code is 200-299. if it's 400 or 401, we throw an error with the server's message. `localStorage.setItem` saves the token in the browser's storage — it persists even after closing the tab.

```javascript
export const getToken = () => localStorage.getItem('token');
```
> reads the saved token. called by `postService.js` to attach to requests.

```javascript
export const getCurrentUser = async () => {
  const token = getToken();
  if (!token) return null;
  const res = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    localStorage.removeItem('token');
    return null;
  }
  const data = await res.json();
  return data.user;
};
```
> called on page load to restore the session. if token exists, verify it with the server. if server says it's invalid (expired, tampered), remove it from localStorage and return null (logged out state).

---

## src/api/postService.js

```javascript
export const createPost = async (data) => {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
```
> only adds the Authorization header if a token exists. if not logged in, the request goes through without it — `optionalAuth` on the backend handles that.

```javascript
export const votePost = async (postId, direction) => {
  const voteType = direction === 'up' ? 'upvote' : 'downvote';
  const res = await fetch(`${BASE_URL}/posts/${postId}/vote`, {
    method: 'PATCH',
    ...
    body: JSON.stringify({ voteType }),
  });
```
> converts `"up"` → `"upvote"` because the backend expects the full word. PATCH is used for partial updates (we're only changing votes, not the whole post).

---

# 9. FRONTEND CONTEXT

Context is React's way of sharing state between components without passing props through every level.

## src/context/AuthContext.jsx

```javascript
const AuthContext = createContext(null);
```
> creates a React context. `null` is the default value when used outside a Provider.

```javascript
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
```
> `useState` creates state variables. `currentUser` starts as null (not logged in). `authLoading` starts true so the app knows we're still checking if the user is logged in.

```javascript
  useEffect(() => {
    getCurrentUser()
      .then((user) => setCurrentUser(user))
      .finally(() => setAuthLoading(false));
  }, []);
```
> `useEffect` with empty array `[]` runs ONCE when the component mounts (page loads). calls `getCurrentUser()` from authService which hits `/api/auth/me` with the saved token. if valid, sets the user. `finally` runs regardless of success/failure and marks loading as done.

```javascript
  return (
    <AuthContext.Provider value={{ currentUser, login, logout, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
```
> makes `currentUser`, `login`, `logout`, and `authLoading` available to ANY component wrapped in `AuthProvider`. in App.jsx, the whole app is wrapped so every component can access auth state.

```javascript
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
```
> custom hook. instead of importing `useContext` and `AuthContext` everywhere, components just call `const { currentUser } = useAuth()`. the error check prevents confusing bugs if someone forgets to wrap with the Provider.

---

## src/context/PostsContext.jsx

```javascript
const fetchPosts = useCallback(async () => {
  setLoading(true);
  try {
    const data = await getPosts();
    setPosts(data);
  } finally {
    setLoading(false);
  }
}, []);
```
> `useCallback` memoizes the function — it doesn't get recreated on every render. this matters because `FeedPage.jsx` uses it in a `useEffect` dependency array. without `useCallback`, it would cause an infinite re-render loop.

```javascript
const handleVote = async (postId, direction) => {
  const result = await votePost(postId, direction);
  setPosts((prev) =>
    prev.map((p) => (p._id === postId ? { ...p, votes: result.votes } : p))
  );
  return result;
};
```
> calls the API, then updates the local posts state with the new vote count. `prev.map()` creates a NEW array (React requires immutable updates). the spread `{ ...p, votes: result.votes }` creates a new object with all old fields plus the updated votes. returns `result` so `PostCard` can update `userVote` state.

---

# 10. FRONTEND PAGES AND COMPONENTS

## src/pages/FeedPage.jsx

```javascript
useEffect(() => {
  fetchPosts();
}, [fetchPosts]);
```
> fetches posts when the page loads. `[fetchPosts]` in the dependency array means "re-run if fetchPosts changes" — but since fetchPosts is memoized with useCallback, it never changes, so this runs exactly once.

```javascript
const col1 = sorted.filter((_, i) => i % 2 === 0);
const col2 = sorted.filter((_, i) => i % 2 === 1);
```
> splits posts into two columns for the masonry-style layout. even-indexed posts go to column 1, odd-indexed go to column 2. `_` is the post value which we don't use, `i` is the index.

---

## src/pages/PostDetailPage.jsx

```javascript
const { id } = useParams();
```
> `useParams()` reads URL parameters. for the route `/post/:id`, this gives us whatever is in the URL as `id`.

```javascript
useEffect(() => {
  setLoading(true);
  getPostById(id)
    .then(setPost)
    .catch(() => setError("Post not found"))
    .finally(() => setLoading(false));
}, [id]);
```
> fetches the full post (including comments) when the page loads or when `id` changes.

```javascript
const handleCommentDelete = (deletedId) => {
  setPost((prev) => ({
    ...prev,
    comments: prev.comments.filter((c) => c._id !== deletedId),
  }));
};
```
> when a comment is deleted, update the local state without re-fetching the whole post. `filter` creates a new array without the deleted comment.

---

## src/components/PostCard.jsx

```javascript
const [userVote, setUserVote] = useState("none");
const [votes, setVotes]       = useState(post.votes ?? 0);
```
> local state per card. `userVote` tracks whether this user has voted. `post.votes ?? 0` uses nullish coalescing — if `post.votes` is null or undefined, use 0.

```javascript
const onVote = async (e, direction) => {
  e.stopPropagation();
```
> `e.stopPropagation()` prevents the click from bubbling up to the parent `div` which would navigate to the post detail page. without this, clicking the vote button would also open the post.

```javascript
  const result = await handleVote(post._id, direction);
  if (result) {
    setVotes(result.votes);
    setUserVote(result.userVote);
  }
```
> updates local vote count and state from the server response. `result.userVote` is `"upvoted"`, `"downvoted"`, or `"none"`.

```javascript
disabled={userVote === "upvoted"}
```
> disables the upvote button if already upvoted. prevents spam clicking.

---

## src/components/MyPostsPanel.jsx

```javascript
useEffect(() => {
  if (!currentUser) return;
  fetch(`${BASE_URL}/posts?owner=${currentUser.username}`)
    .then((r) => r.json())
    .then((data) => setPosts(data.posts || []))
```
> only fetches if logged in. uses the `?owner=` filter we built in `postController.getAllPosts`. `data.posts || []` handles the case where posts is undefined.

```javascript
const handleDelete = async (postId) => {
  if (!confirm("Delete this post? This can't be undone.")) return;
```
> browser's built-in confirm dialog. returns true if user clicked OK, false if Cancel. simple but effective.

---

