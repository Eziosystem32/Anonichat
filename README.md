# AnonBoard 🦋
### *an anonymous storyboard. post freely. own your posts. vibe.*

> built in like 3 days with mild panic and a lot of curl commands

---

## 🧠 WHAT IS THIS THING

AnonBoard is an anonymous posting platform. Think Reddit but you don't have to use your real name. You can:

- post with ANY username you want (fake, silly, whatever)
- browse and read posts without signing in
- sign up with a real account if you want to manage your posts later
- upvote / downvote posts and comments
- comment on posts anonymously or as yourself
- log in and see/edit/delete only YOUR posts

the whole point is: **anonymous by default, accountable if you want to be.**

---

## 👥 WHO BUILT WHAT

| Person | Role | Files |
|--------|------|-------|
| **Yassir (Person A)** | Posts + Project Glue | `models/Post.js`, `controllers/postController.js`, `routes/posts.js`, `app.js`, `postService.js`, `PostCard.jsx`, `PostsContext.jsx` |
| **Eyos (Person B)** | Comments | `controllers/commentController.js` |
| **Yassir (Person C)** | Auth + Middleware | `models/User.js`, `controllers/authController.js`, `middleware/authMiddleware.js`, `routes/auth.js`, `config/db.js`, `authService.js`, `AuthContext.jsx` |
| **Abraham (Person D)** | Votes | `controllers/voteController.js` (also updated `Post.js`) |

---

## 🏃 HOW TO RUN THIS

### you need:
- Node.js v18+
- MongoDB running locally (just start it, it runs on port 27017 by default)

### backend:
```bash
cd Anoni-Backend
npm install
cp .env.example .env   # then fill in your JWT_SECRET
npm run dev
```

should say:
```
✅ MongoDB Connected: 127.0.0.1
🚀 Server listening on http://localhost:5000
```

### frontend:
```bash
cd Anoni-main
npm install
npm run dev
```

goes to `http://localhost:5173`

> both need to be running at the same time or nothing works lol

---

## 📁 PROJECT STRUCTURE

```
Anonichat/
│
├── Anoni-Backend/                  ← Express + MongoDB API
│   ├── server.js                   ← starts the server, connects to DB
│   ├── app.js                      ← express setup, middleware, routes
│   │
│   ├── config/
│   │   └── db.js                   ← MongoDB connection (mongoose)
│   │
│   ├── middleware/
│   │   └── authMiddleware.js       ← requireAuth + optionalAuth
│   │
│   ├── models/
│   │   ├── Post.js                 ← Post + embedded Comment schema
│   │   └── User.js                 ← User schema (bcrypt hashed passwords)
│   │
│   ├── controllers/
│   │   ├── authController.js       ← register, login, getMe
│   │   ├── postController.js       ← CRUD for posts
│   │   ├── commentController.js    ← add/delete/vote comments
│   │   └── voteController.js       ← upvote/downvote posts
│   │
│   └── routes/
│       ├── auth.js                 ← /api/auth/*
│       └── posts.js                ← /api/posts/* (includes comments + votes)
│
└── Anoni-main/                     ← React + Vite frontend
    └── src/
        ├── api/
        │   ├── authService.js      ← login, register, token management
        │   ├── postService.js      ← all API calls for posts/comments/votes
        │   └── mockData.js         ← old mock data (not used anymore, left for ref)
        │
        ├── context/
        │   ├── AuthContext.jsx     ← currentUser state, login/logout
        │   └── PostsContext.jsx    ← posts state, fetchPosts, handleVote
        │
        ├── components/
        │   ├── Navbar.jsx          ← top navigation bar
        │   ├── PostCard.jsx        ← single post card in the feed
        │   ├── CommentItem.jsx     ← single comment in the thread
        │   ├── MyPostsPanel.jsx    ← logged-in user's posts with edit/delete
        │   └── Sidebar.jsx        ← feed sidebar
        │
        └── pages/
            ├── FeedPage.jsx        ← main feed with sorting (newest/popular)
            ├── PostDetailPage.jsx  ← single post view with comments
            ├── CreatePostPage.jsx  ← create a new post
            ├── AuthPage.jsx        ← login / register / profile
            ├── RulesPage.jsx       ← rules
            └── HelpPage.jsx        ← help
```

---

## 🔌 API ENDPOINTS

### Auth — `/api/auth`

| Method | Endpoint | What it does | Protected |
|--------|----------|--------------|-----------|
| POST | `/api/auth/register` | create account (username, email, password) | no |
| POST | `/api/auth/login` | login, returns JWT token | no |
| GET | `/api/auth/me` | get current user from token | yes |

### Posts — `/api/posts`

| Method | Endpoint | What it does | Protected |
|--------|----------|--------------|-----------|
| GET | `/api/posts` | get all posts (paginated) | no |
| GET | `/api/posts?owner=username` | get posts by a specific owner | no |
| GET | `/api/posts/:id` | get single post with comments | no |
| POST | `/api/posts` | create post | optional* |
| PUT | `/api/posts/:id` | edit post (owner only) | yes |
| DELETE | `/api/posts/:id` | delete post (owner only) | yes |

### Votes

| Method | Endpoint | What it does | Protected |
|--------|----------|--------------|-----------|
| PATCH | `/api/posts/:id/vote` | upvote/downvote/unvote a post | optional* |
| GET | `/api/posts/:id/votes` | get vote stats for a post | no |

### Comments

| Method | Endpoint | What it does | Protected |
|--------|----------|--------------|-----------|
| POST | `/api/posts/:postId/comments` | add a comment | optional* |
| DELETE | `/api/posts/:postId/comments/:commentId` | delete comment | yes |
| PUT | `/api/posts/:postId/comments/:commentId/vote` | vote on comment | optional* |

> *optional = works without auth (anonymous), but if you're logged in it uses your real account

---

## 🗄️ DATABASE SCHEMA

### Post document
```json
{
  "_id": "mongodb objectid",
  "title": "string (required, max 200 chars)",
  "content": "string (required, max 10000 chars)",
  "username": "string — fake display name, can be anything",
  "ownerId": "string — real logged-in username (for edit/delete)",
  "votes": "number — current vote count",
  "commentCount": "number — cached comment count for the feed",
  "upvotedBy": ["username1", "username2"],
  "downvotedBy": ["username3"],
  "comments": [
    {
      "_id": "objectid",
      "username": "display name",
      "content": "string",
      "votes": "number",
      "createdAt": "date",
      "updatedAt": "date"
    }
  ],
  "createdAt": "date",
  "updatedAt": "date"
}
```

### User document
```json
{
  "_id": "mongodb objectid",
  "username": "string (unique, 3-30 chars)",
  "email": "string (unique, lowercase)",
  "password": "string (bcrypt hashed, never returned in responses)",
  "createdAt": "date",
  "updatedAt": "date"
}
```

> Comments are **embedded** inside Post documents, not a separate collection. This means fetching a post automatically includes its comments — no extra query needed.

---

## 🔐 HOW AUTH WORKS

```
1. User registers → backend hashes password with bcrypt, saves to DB, returns JWT token
2. Frontend saves token to localStorage
3. Every protected request sends:  Authorization: Bearer <token>
4. authMiddleware verifies token → attaches req.user to the request
5. optionalAuth does the same but doesn't block anonymous users
6. On page refresh → AuthContext calls /api/auth/me to restore session
7. On logout → token removed from localStorage
```

**The anonymous posting trick:**
- `username` = whatever fake name you type (shown publicly)
- `ownerId` = your real account username (stored in DB, used for ownership checks)
- If you're not logged in, `ownerId` defaults to your display name
- This means anonymous posts can't be claimed/edited later — by design

---

## 🧩 HOW THE FRONTEND CONNECTS

```
AuthContext.jsx
  └── stores currentUser in React state
  └── restores session on refresh via /api/auth/me
  └── provides login() and logout() to all components

PostsContext.jsx
  └── stores posts array in React state
  └── fetchPosts() → GET /api/posts → updates state
  └── handleVote() → PATCH /api/posts/:id/vote → updates state + returns result

postService.js
  └── all fetch() calls to the backend
  └── automatically attaches token to POST/PUT/PATCH/DELETE requests
  └── getToken() reads from localStorage

authService.js
  └── login/register/logout
  └── saves/removes JWT from localStorage
  └── getCurrentUser() → used by AuthContext on page load
```

---

## ⚠️ KNOWN STUFF / FUTURE IMPROVEMENTS

1. **Vote persistence across page refresh** — votes reset visually when you refresh (the DB is correct, just the frontend state resets). Fix: call `/api/posts/:id/votes` on load to get `userVote` status
2. **Comment vote anti-spam** — comment votes don't have per-user tracking yet (post votes do)
3. **ownerId is a string** — currently stores username not a proper MongoDB ObjectId reference. When you have more time, swap to `{ type: ObjectId, ref: 'User' }` for proper relational integrity
4. **No image uploads** — text only for now
5. **Save button** — it's there in the UI but doesn't do anything yet 😅

---

## 🧪 QUICK TEST WITHOUT THE FRONTEND

```bash
# health check
curl http://localhost:5000/api/health

# register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@test.com","password":"123456"}'

# create post (paste token from register above)
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"title":"hello world","content":"it works","username":"myfakename"}'

# get all posts
curl http://localhost:5000/api/posts

# vote on a post
curl -X PATCH http://localhost:5000/api/posts/POST_ID_HERE/vote \
  -H "Content-Type: application/json" \
  -d '{"voteType":"upvote"}'
```

---

*built with express, mongoose, react, vite, jwt, bcrypt, and the will to pass this class*  
*🦋*
