import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { PostsProvider } from "./context/PostsContext.jsx";
import Navbar from "./components/Navbar.jsx";
import FeedPage from "./pages/FeedPage.jsx";
import PostDetailPage from "./pages/PostDetailPage.jsx";
import CreatePostPage from "./pages/CreatePostPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import RulesPage from "./pages/RulesPage.jsx";
import HelpPage from "./pages/HelpPage.jsx";
import "./styles/global.css";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PostsProvider>
          <div className="app-root">
            <Navbar />
            <Routes>
              <Route path="/" element={<FeedPage />} />
              <Route path="/post/:id" element={<PostDetailPage />} />
              <Route path="/create" element={<CreatePostPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/rules" element={<RulesPage />} />
              <Route path="/help" element={<HelpPage />} />
            </Routes>
          </div>
        </PostsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
