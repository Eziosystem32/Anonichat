export const mockUsers = [
  { id: 1, username: "anon123", password: "pass123", postsCreated: 4, commentsLeft: 8 },
  { id: 2, username: "anon456", password: "pass456", postsCreated: 5, commentsLeft: 12 },
  { id: 3, username: "ghost_user", password: "ghost999", postsCreated: 2, commentsLeft: 3 },
];

export const mockPosts = [
  {
    id: 1,
    title: "Late night thoughts",
    content: "Why does 2AM feel like a different universe? Everything gets quieter and your mind just... expands. Anyone else feel this? Like time slows down and you become a different person after midnight.",
    username: "anon123",
    timestamp: "2026-04-23T02:14:00",
    votes: 5,
    comments: [
      { id: 1, username: "reader1", content: "Because it is.", timestamp: "2026-04-23T02:20:00", votes: 9 },
      { id: 2, username: "anon_user", content: "Nice!", timestamp: "2026-04-23T10:05:00", votes: 9 },
    ],
  },
  {
    id: 2,
    title: "My e-ink setup",
    content: "Just got a rink monitor. The geye strain bet. Best purchase I've made this year. Running it at 85Hz with custom refresh rates. Anyone else on the e-ink life?",
    username: "anon456",
    timestamp: "2026-04-23T11:29:00",
    votes: 12,
    comments: [
      { id: 1, username: "reader1", content: "Nice!", timestamp: "2026-04-23T11:29:00", votes: 9 },
      { id: 2, username: "anon_user", content: "Where did you get the monitor?", timestamp: "2026-04-23T14:00:00", votes: 2 },
      { id: 3, username: "reader2", content: "Love this thread!", timestamp: "2026-04-23T14:00:00", votes: 1 },
      { id: 4, username: "reader3", content: "My setup is similar.", timestamp: "2026-04-23T14:00:00", votes: 1 },
      { id: 5, username: "ghost_user", content: "Which model did you get?", timestamp: "2026-04-23T15:00:00", votes: 3 },
      { id: 6, username: "anon123", content: "The dasung isn't bad either.", timestamp: "2026-04-23T16:00:00", votes: 0 },
    ],
  },
  {
    id: 3,
    title: "The simulation",
    content: "Are we in a simulation? My airtime is 0.00. This is evidence. The devs forgot to top me up.",
    username: "user789",
    timestamp: "2026-09-08T08:00:00",
    votes: -2,
    comments: [
      { id: 1, username: "logician", content: "Simulation confirmed.", timestamp: "2026-09-08T09:00:00", votes: 4 },
    ],
  },
  {
    id: 4,
    title: "E-Ink and Productivity",
    content: "How e-ink changes my workflow... honestly it slows everything down in a good way. You stop doom scrolling. You start reading. Highly recommend.",
    username: "anon101",
    timestamp: "2026-04-22T09:00:00",
    votes: 9,
    comments: [
      { id: 1, username: "workerbot", content: "This is the way.", timestamp: "2026-04-22T10:00:00", votes: 5 },
      { id: 2, username: "anon456", content: "Agreed 100%", timestamp: "2026-04-22T11:00:00", votes: 3 },
    ],
  },
  {
    id: 5,
    title: "Anonymous Storylers on E-Ink",
    content: "Looking for a theme for VS Code on e-ink. Something that respects the low contrast nature of e-paper but still works for coding. Any recs?",
    username: "anon736",
    timestamp: "2026-04-23T16:03:00",
    votes: 15,
    comments: [
      { id: 1, username: "devghost", content: "Try 'Ink' theme on marketplace.", timestamp: "2026-04-23T16:30:00", votes: 7 },
    ],
  },
  {
    id: 6,
    title: "Coding on E-Ink",
    content: "Looking for a theme for VS Code on e-ink. The default themes are too harsh for the matte screen. Need something purpose-built.",
    username: "anon736",
    timestamp: "2026-04-23T23:07:00",
    votes: 15,
    comments: [
      { id: 1, username: "anon101", content: "There's a great one called Paper.", timestamp: "2026-04-23T23:30:00", votes: 2 },
    ],
  },
  {
    id: 7,
    title: "E-ink Screen Ghosting",
    content: "A question about ghosting effects on e-ink when scrolling fast. Is there a way to minimize this or is it just the nature of the technology?",
    username: "anon456",
    timestamp: "2026-04-23T10:00:00",
    votes: 9,
    comments: [],
  },
  {
    id: 8,
    title: "Anonymous Stories",
    content: "Rry not out gant wacks on your VBOR land commanwd without existing, your needt a command. Share your anonymous e-ink stories here.",
    username: "anon170",
    timestamp: "2026-04-23T08:00:00",
    votes: -2,
    comments: [],
  },
];
