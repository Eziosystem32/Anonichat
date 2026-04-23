import { createContext, useContext, useState, useCallback } from "react";
import { getPosts, votePost } from "../api/postService.js";

const PostsContext = createContext(null);

export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("newest");

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPosts();
      setPosts(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleVote = async (postId, direction) => {
    const newVotes = await votePost(postId, direction);
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, votes: newVotes } : p))
    );
  };

  const getSortedPosts = () => {
    const copy = [...posts];
    if (sortBy === "newest") {
      return copy.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }
    return copy.sort((a, b) => b.votes - a.votes);
  };

  return (
    <PostsContext.Provider
      value={{ posts, loading, fetchPosts, handleVote, sortBy, setSortBy, getSortedPosts }}
    >
      {children}
    </PostsContext.Provider>
  );
};

export const usePosts = () => {
  const ctx = useContext(PostsContext);
  if (!ctx) throw new Error("usePosts must be used within PostsProvider");
  return ctx;
};
