import { mockUsers } from "./mockData.js";

let users = [...mockUsers];
let nextUserId = users.length + 1;

const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms));

export const loginUser = async (credentials) => {
  await delay();
  const user = users.find(
    (u) =>
      u.username === credentials.username &&
      u.password === credentials.password
  );
  if (!user) throw new Error("Invalid username or password");
  const { password, ...safeUser } = user;
  return safeUser;
};

export const registerUser = async (data) => {
  await delay();
  const exists = users.find((u) => u.username === data.username);
  if (exists) throw new Error("Username already taken");
  const newUser = {
    id: nextUserId++,
    username: data.username,
    password: data.password,
    postsCreated: 0,
    commentsLeft: 0,
  };
  users = [...users, newUser];
  const { password, ...safeUser } = newUser;
  return safeUser;
};

export const getUserPosts = async (username, getPosts) => {
  await delay(100);
  const allPosts = await getPosts();
  return allPosts.filter((p) => p.username === username);
};
