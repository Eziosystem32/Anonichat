import { mockPosts } from "./mockData.js";

// In-memory store (replace with fetch() calls when backend is ready)
let posts = [...mockPosts];
let nextPostId = posts.length + 1;
let nextCommentId = 100;

// Simulate network latency
const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms));

export const getPosts = async () => {
  await delay();
  return [...posts];
};

export const getPostById = async (id) => {
  await delay();
  const post = posts.find((p) => p.id === Number(id));
  if (!post) throw new Error("Post not found");
  return { ...post, comments: [...post.comments] };
};

export const createPost = async (data) => {
  await delay();
  const newPost = {
    id: nextPostId++,
    title: data.title,
    content: data.content,
    username: data.username,
    timestamp: new Date().toISOString(),
    votes: 0,
    comments: [],
  };
  posts = [newPost, ...posts];
  return newPost;
};

export const addComment = async (postId, comment) => {
  await delay();
  const post = posts.find((p) => p.id === Number(postId));
  if (!post) throw new Error("Post not found");
  const newComment = {
    id: nextCommentId++,
    username: comment.username,
    content: comment.content,
    timestamp: new Date().toISOString(),
    votes: 0,
  };
  post.comments = [...post.comments, newComment];
  return newComment;
};

export const votePost = async (postId, direction) => {
  await delay(100);
  const post = posts.find((p) => p.id === Number(postId));
  if (!post) throw new Error("Post not found");
  post.votes += direction === "up" ? 1 : -1;
  return post.votes;
};

export const voteComment = async (postId, commentId, direction) => {
  await delay(100);
  const post = posts.find((p) => p.id === Number(postId));
  if (!post) throw new Error("Post not found");
  const comment = post.comments.find((c) => c.id === Number(commentId));
  if (!comment) throw new Error("Comment not found");
  comment.votes += direction === "up" ? 1 : -1;
  return comment.votes;
};
