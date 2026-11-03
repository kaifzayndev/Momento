import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import galleryData from "./data/galleryData";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import GalleryPage from "./pages/GalleryPage";
import DetailPage from "./pages/DetailPage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import MyCollectionPage from "./pages/MyCollectionPage";

function App() {
  // Photos state - stored in localStorage so Admin edits/additions persist
  const [photos, setPhotos] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("ff-photos-v2"));
      return Array.isArray(saved) && saved.length > 0 ? saved : galleryData;
    } catch {
      return galleryData;
    }
  });

  // Auth states
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem("ff-admin-auth") === "true";
  });
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(() => {
    return localStorage.getItem("ff-user-auth") === "true";
  });
  const [currentUser, setCurrentUser] = useState(() => {
    return localStorage.getItem("ff-user-email") || "";
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("ff-favs") || "[]");
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // User liked photos state (for My Collection)
  const [likedPhotos, setLikedPhotos] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("ff-user-likes"));
      if (Array.isArray(saved)) return saved;
      return [1, 2, 4]; // Default sample liked photos across Nature, Architecture, Animals
    } catch {
      return [1, 2, 4];
    }
  });

  // Persist photos when modified
  useEffect(() => {
    localStorage.setItem("ff-photos-v2", JSON.stringify(photos));
  }, [photos]);

  // Pure Dark Theme — locked exclusively to Dark Mode
  useEffect(() => {
    localStorage.setItem("ff-theme", "dark");
    document.documentElement.setAttribute("data-theme", "dark");
  }, []);

  // Persist favorites
  useEffect(() => {
    localStorage.setItem("ff-favs", JSON.stringify(favorites));
  }, [favorites]);

  // Persist liked photos
  useEffect(() => {
    localStorage.setItem("ff-user-likes", JSON.stringify(likedPhotos));
  }, [likedPhotos]);

  const toggleFavorite = (id) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  };

  const toggleLike = (id) => {
    setLikedPhotos((prev) => {
      const isLiked = prev.includes(id);
      const next = isLiked ? prev.filter((photoId) => photoId !== id) : [...prev, id];
      setPhotos((currentPhotos) =>
        currentPhotos.map((p) =>
          p.id === id ? { ...p, likes: Math.max(0, (p.likes || 0) + (isLiked ? -1 : 1)) } : p
        )
      );
      return next;
    });
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setActiveCategory("All");
    setShowFavoritesOnly(false);
  };

  const handleToggleShowFavorites = () => {
    setShowFavoritesOnly((prev) => !prev);
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setIsUserLoggedIn(false);
    setCurrentUser("");
    localStorage.removeItem("ff-admin-auth");
    localStorage.removeItem("ff-admin-email");
    localStorage.removeItem("ff-user-auth");
    localStorage.removeItem("ff-user-email");
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="app theme-dark">
        <Header
          favoritesCount={favorites.length}
          showFavoritesOnly={showFavoritesOnly}
          onToggleShowFavorites={handleToggleShowFavorites}
          onResetFilters={handleResetFilters}
          isAdminLoggedIn={isAdminLoggedIn}
          isUserLoggedIn={isUserLoggedIn}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
        <Routes>
          <Route
            path="/"
            element={
              !isAdminLoggedIn && !isUserLoggedIn ? (
                <LoginPage
                  setIsAdminLoggedIn={setIsAdminLoggedIn}
                  setIsUserLoggedIn={setIsUserLoggedIn}
                  setCurrentUser={setCurrentUser}
                  onResetFilters={handleResetFilters}
                  defaultRole="user"
                />
              ) : isAdminLoggedIn ? (
                <Navigate to="/admin" replace />
              ) : (
                <Navigate to="/gallery" replace />
              )
            }
          />
          <Route
            path="/gallery"
            element={
              !isAdminLoggedIn && !isUserLoggedIn ? (
                <LoginPage
                  setIsAdminLoggedIn={setIsAdminLoggedIn}
                  setIsUserLoggedIn={setIsUserLoggedIn}
                  setCurrentUser={setCurrentUser}
                  onResetFilters={handleResetFilters}
                  defaultRole="user"
                />
              ) : (
                <GalleryPage
                  photos={photos}
                  setPhotos={setPhotos}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  likedPhotos={likedPhotos}
                  onToggleLike={toggleLike}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                  showFavoritesOnly={showFavoritesOnly}
                  setShowFavoritesOnly={setShowFavoritesOnly}
                  isAdminLoggedIn={isAdminLoggedIn}
                />
              )
            }
          />
          <Route
            path="/collection"
            element={
              isAdminLoggedIn ? (
                <Navigate to="/admin" replace />
              ) : !isUserLoggedIn ? (
                <LoginPage
                  setIsAdminLoggedIn={setIsAdminLoggedIn}
                  setIsUserLoggedIn={setIsUserLoggedIn}
                  setCurrentUser={setCurrentUser}
                  onResetFilters={handleResetFilters}
                  defaultRole="user"
                />
              ) : (
                <MyCollectionPage
                  photos={photos}
                  likedPhotos={likedPhotos}
                  onToggleLike={toggleLike}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  currentUser={currentUser}
                />
              )
            }
          />
          <Route
            path="/photo/:id"
            element={
              !isAdminLoggedIn && !isUserLoggedIn ? (
                <LoginPage
                  setIsAdminLoggedIn={setIsAdminLoggedIn}
                  setIsUserLoggedIn={setIsUserLoggedIn}
                  setCurrentUser={setCurrentUser}
                  onResetFilters={handleResetFilters}
                  defaultRole="user"
                />
              ) : (
                <DetailPage
                  photos={photos}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  likedPhotos={likedPhotos}
                  onToggleLike={toggleLike}
                />
              )
            }
          />
          <Route
            path="/admin"
            element={
              <AdminPage
                photos={photos}
                setPhotos={setPhotos}
                favorites={favorites}
                isAdminLoggedIn={isAdminLoggedIn}
                setIsAdminLoggedIn={setIsAdminLoggedIn}
                setIsUserLoggedIn={setIsUserLoggedIn}
                setCurrentUser={setCurrentUser}
                onResetFilters={handleResetFilters}
              />
            }
          />
        </Routes>
        <Footer
          isAuthenticated={isAdminLoggedIn || isUserLoggedIn}
          onResetFilters={handleResetFilters}
        />
      </div>
    </Router>
  );
}

export default App;

