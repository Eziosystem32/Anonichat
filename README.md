# AnonBoard — Backend 🖥️

> yes we finally have a real backend, no more fake data lmao

![node](https://img.shields.io/badge/node-%3E%3D18-ff69b4)
![express](https://img.shields.io/badge/express-4.x-brightgreen)
![mongodb](https://img.shields.io/badge/mongodb-local-green)
![status](https://img.shields.io/badge/status-it%20actually%20works-brightgreen)

---

## 🏃 HOW TO RUN THIS THING

### stuff u need:
- Node.js v18 or higher
- MongoDB running locally (just start it ok)
- npm (comes with node probably)

### steps:

1. **get in the folder**
   ```bash
   cd Anoni-Backend
   ```

2. **install the bloat**
   ```bash
   npm install
   ```

3. **make your .env file** (copy the example one)
   ```bash
   cp .env.example .env
   ```
   the defaults should just work locally, don't touch it unless u know what ur doing

4. **start it**
   ```bash
   npm run dev
   ```

5. **check it's alive**
   ```
   http://localhost:5000/api/health
   ```
   should say `{ "status": "ok" }` — if not, cry

> [!NOTE]
> backend runs on port **5000**, frontend runs on port **5173**. keep both running at the same time or nothing works lol

---

## 📁 WHERE STUFF LIVES

```
Anoni-Backend/
├── app.js                  # main server file, start here
├── .env.example            # copy this to .env
│
├── models/
│   └── Post.js             # post + comment schema (mongodb)
│
├── controllers/
│   └── postController.js   # all the logic for post endpoints
│
└── routes/
    └── posts.js            # url routing, middleware goes here
```

---

## 🔌 ENDPOINTS (what exists rn)

| Method | Endpoint | What it does | Protected? |
|--------|----------|--------------|------------|
| GET | `/api/posts` | get all posts (paginated) | nope |
| GET | `/api/posts/:id` | get one post + its comments | nope |
| POST | `/api/posts` | create a new post | yes* |
| PUT | `/api/posts/:id` | edit a post | yes* |
| DELETE | `/api/posts/:id` | delete a post | yes* |
| GET | `/api/health` | check if server is alive | nope |

> *auth middleware is stubbed rn — it lets everything through until Person C wires up the real JWT stuff

### pagination on GET /api/posts:
```
/api/posts?page=1&limit=10
```
returns `{ posts: [...], pagination: { page, limit, total, totalPages, hasNext, hasPrev } }`

---

## 👥 WHO NEEDS TO DO WHAT

### Yassir (auth):
- build `middleware/authMiddleware.js`
- in `routes/posts.js` replace this:
  ```javascript
  // TODO: remove this stub and import yassir's real middleware
  const protect = (req, _res, next) => { next(); };
  ```
  with:
  ```javascript
  const { protect } = require('../middleware/authMiddleware');
  ```
- add your JWT_SECRET to `.env`
- `req.user.username` is what the controllers read — make sure ur middleware sets that

### Eyos (comments):
- your comment routes go in `routes/comments.js`
- in `routes/posts.js` uncomment this block:
  ```javascript
  // const commentRouter = require('./comments');
  // router.use('/:postId/comments', commentRouter);
  ```
- check `models/Post.js` — comments are embedded in the post schema rn
  if u want a separate collection just change the comments field to refs, up to u
- endpoints the frontend already expects:
  - `POST /api/posts/:postId/comments`
  - `PATCH /api/posts/:postId/comments/:commentId/vote`

### Abraham (votes):
- vote logic stubs are in `models/Post.js` (look for the Abraham comments)
- add a `PATCH /api/posts/:id/vote` endpoint
- if u want per-user vote tracking, uncomment the `upvotedBy`/`downvotedBy` arrays in the Post model
- right now people can vote infinite times lmao fix that

---

## ⚠️ IMPORTANT STUFF DON'T IGNORE

> [!IMPORTANT]
> MongoDB must be running before you start the server or it crashes immediately. like it won't wait for u.

> [!WARNING]
> don't commit your `.env` file. ever. it's in `.gitignore` already but just don't.

> [!CAUTION]
> the `_id` field from MongoDB is NOT the same as the `id` field from the old mock data. if something says "post not found" or "undefined" somewhere, that's probably why. use `_id` everywhere.

> [!NOTE]
> the frontend's `/src/api/postService.js` is the only file that talks to us. if something's broken between frontend and backend, start there.

---

## 🧪 TESTING WITHOUT THE FRONTEND

```bash
# health check
curl http://localhost:5000/api/health

# get all posts
curl http://localhost:5000/api/posts

# create a post
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title": "test", "content": "hello world"}'

# get single post (replace ID with a real one)
curl http://localhost:5000/api/posts/REAL_ID_HERE
```

---

## 🤷 KNOWN STUFF / ASSUMPTIONS

1. **votes aren't per-user yet** — Abraham is handling this
2. **comments aren't done yet** — Eyos is handling this  
3. **auth is stubbed** — Yassir is handling this
4. **use `_id` not `id`** — mongodb thing, don't forget or u will suffer
5. **timestamps are `createdAt` not `timestamp`** — again, mongodb thing

---

*built with express, mongoose, and mild panic*
