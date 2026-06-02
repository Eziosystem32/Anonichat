const BASE_URL = 'http://localhost:5000/api';

export const getPosts = async () => {
  const res = await fetch(`${BASE_URL}/posts`);
  if (!res.ok) throw new Error('Failed to fetch posts');
  const data = await res.json();
  return data.posts; // backend wraps in { posts, pagination }
};

export const getPostById = async (id) => {
  const res = await fetch(`${BASE_URL}/posts/${id}`);
  if (!res.ok) throw new Error('Post not found');
  return res.json();
};

export const createPost = async (data) => {
  const res = await fetch(`${BASE_URL}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create post');
  return res.json();
};

export const votePost = async (postId, direction) => {
  const res = await fetch(`${BASE_URL}/posts/${postId}/vote`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ direction }),
  });
  if (!res.ok) throw new Error('Failed to vote');
  return res.json();
};

// Eyos's comment endpoints (uncomment when ready)
// export const addComment = async (postId, data) => { ... }
// export const voteComment = async (postId, commentId, direction) => { ... }

//temp

// ─── Comments ─────────────────────────────────────────────────────

export const addComment = async (postId, { username, content }) => {
  const res = await fetch(`${BASE_URL}/posts/${postId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, content }),
  });
  if (!res.ok) throw new Error('Failed to add comment');
  return res.json();
};

export const deleteComment = async (postId, commentId) => {
  const res = await fetch(`${BASE_URL}/posts/${postId}/comments/${commentId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete comment');
  return res.json();
};

export const voteComment = async (postId, commentId, dir) => {
  const res = await fetch(`${BASE_URL}/posts/${postId}/comments/${commentId}/vote`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dir }),
  });
  if (!res.ok) throw new Error('Failed to vote on comment');
  return res.json();
};
