# AnonBoard — Anonymous Storyboard Frontend

> just trying to be professional eh XD

![bruh](https://img.shields.io/badge/status-it%20works%20somehow-brightgreen)
![node](https://img.shields.io/badge/node-%3E%3D18-ff69b4)
![license](https://img.shields.io/badge/license-idk%20lol-blue)

---

## 🏃 HOW TO RUN THE DAMN THING

### stuff u need:
- Node.js v18 or higher (just install it ok)
- npm v9 or higher (comes with node probably)

### steps (follow or else):

1. **get in the folder**
   ```bash
   cd anonboard
   ```

2. **install the bloat**
   ```bash
   npm install
   ```

3. **start the chaos**
   ```bash
   npm run dev
   ```

4. **open browser here u nerd**
   ```
   http://localhost:5173
   ```

### for ✨production✨ (if u really want to)
```bash
npm run build
npm run preview
```

> [!NOTE]
> yeah it's just vite nothing fancy

> [!TIP]
> if it doesn't work try turning it off and on again (or cry idc)

---

## 🧠 ARCHITECTURE EXPLANATION (aka where stuff lives)

the app kinda follows a clean separation of concerns... ish

```
/src
├── api/
│   ├── mockData.js       # fake data (posts, users) - don't judge
│   ├── postService.js    # post stuff goes brrr
│   └── authService.js    # login/register nonsense
│
├── components/
│   ├── Navbar.jsx        # top bar thingy
│   ├── PostCard.jsx      # each post in the feed
│   ├── CommentItem.jsx   # each comment (wow)
│   └── Sidebar.jsx       # right side thing (search, stats, boards)
│
├── context/
│   ├── AuthContext.jsx   # who is logged in? nobody knows
│   └── PostsContext.jsx  # all posts + sorting magic
│
├── pages/
│   ├── FeedPage.jsx      # / route: the main feed
│   ├── PostDetailPage.jsx    # /post/:id: full thread with comments
│   ├── CreatePostPage.jsx    # /create: make new post
│   ├── AuthPage.jsx      # /auth: login/register/profile
│   ├── RulesPage.jsx     # /rules: don't be a jerk
│   └── HelpPage.jsx      # /help: figure it out yourself
│
├── utils/
│   └── formatTime.js     # turns timestamps into words
│
├── styles/
│   └── global.css        # e-ink design system (looks like old newspaper)
│
├── App.jsx               # root component, router setup
└── main.jsx              # react goes brrr here
```

> [!IMPORTANT]
> UI components **CANNOT** import mockData directly. like ever. data goes through /api/ only. yes this is important.

> [!TIP]
> the e-ink thing is just gray colors lol don't overthink it

---

## 🔌 SERVICE / API LAYER (boring but necessary)

### postService.js does this:

| Function | What it does |
|----------|--------------|
| `getPosts()` | returns all posts (async cuz why not) |
| `getPostById(id)` | returns one post with its comments |
| `createPost(data)` | makes a new post |
| `addComment(postId, data)` | adds comment to post |
| `votePost(id, dir)` | up/downvote a post |
| `voteComment(pid, cid, dir)` | votes on comment |

### authService.js does this:

| Function | What it does |
|----------|--------------|
| `loginUser(credentials)` | logs you in if you're not lying |
| `registerUser(data)` | creates new user |
| `getUserPosts(username)` | returns posts by some user |

> [!NOTE]
> all functions have a fake 300ms delay to pretend they're doing real work

---

## 🔄 BACKEND INTEGRATION PLAN (for later, maybe never)

when backend exists (lmao), **ONLY CHANGE /api/ FILES**. ui stays same.

### example:

```javascript
// BEFORE (fake)
export const getPosts = async () => {
  await delay();
  return [...posts];
};

// AFTER (real - needs actual backend)
export const getPosts = async () => {
  const res = await fetch('/api/posts');
  if (!res.ok) throw new Error('failed lol');
  return res.json();
};
```

### auth tokens thingy:
add headers to fetch calls. store jwt in memory or cookie.

> [!WARNING]
> don't use localStorage for tokens unless u want to get hacked lol

### endpoints you should make (if u ever do backend):

```
GET    /api/posts
GET    /api/posts/:id
POST   /api/posts
POST   /api/posts/:id/comments
PATCH  /api/posts/:id/vote
POST   /api/auth/login
POST   /api/auth/register
```

---

## 🤷 ASSUMPTIONS (aka things we're pretending are fine)

1. **usernames are unique** — frontend checks but backend should too (not our problem yet)

2. **votes aren't tracked per user** — so people can vote multiple times lmao  

   > [!WARNING]
   > 
   > backend should fix this... maybe... if we care enough 😅

3. **passwords are plain text in mockData.js**  

   > [!CAUTION]
   > 
   > for demo only!!! real backend MUST hash passwords or ur getting hacked

4. **no localStorage for auth** — auth lives in react context only (in memory)  

   > [!NOTE]
   > 
   so if u refresh the page, ur logged out. not a bug, it's a feature ™️

5. **no images or file uploads** — cuz who needs that anyway

---

## 📝 final notes

this is just for our final project, don't take it too seriously lol

if it breaks... skill issue 😎

---

*built with stress, caffeine, and last-minute panic*
