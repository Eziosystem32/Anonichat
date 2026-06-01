import { useEffect } from "react";
import { usePosts } from "../context/PostsContext.jsx";
import PostCard from "../components/PostCard.jsx";
import Sidebar from "../components/Sidebar.jsx";

export default function FeedPage() {
  const { getSortedPosts, loading, fetchPosts, sortBy, setSortBy } = usePosts();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const sorted = getSortedPosts();
  const col1 = sorted.filter((_, i) => i % 2 === 0);
  const col2 = sorted.filter((_, i) => i % 2 === 1);

  return (
    <div className="page-layout">
      <main className="feed-main">
        <div className="feed-header">
          <h2 className="feed-title">Main Feed</h2>
          <div className="sort-controls">
            <button
              className={`sort-btn ${sortBy === "newest" ? "active" : ""}`}
              onClick={() => setSortBy("newest")}
            >
              Newest
            </button>
            <button
              className={`sort-btn ${sortBy === "popular" ? "active" : ""}`}
              onClick={() => setSortBy("popular")}
            >
              Most Popular
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading feed...</div>
        ) : (
          <div className="feed-grid">
            <div className="feed-col">
              {col1.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            <div className="feed-col">
              {col2.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}
      </main>
      <Sidebar />
    </div>
  );
}
