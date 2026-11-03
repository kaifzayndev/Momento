import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { categories } from "../data/galleryData";

function MyCollectionPage({
  photos = [],
  likedPhotos = [],
  onToggleLike,
  favorites = [],
  onToggleFavorite,
  currentUser,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") === "favorites" ? "favorites" : "liked";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedCategory("All");
    setSearchParams(tab === "favorites" ? { tab: "favorites" } : {});
  };

  // Filter photos based on active tab
  const currentCollection =
    activeTab === "favorites"
      ? photos.filter((photo) => favorites.includes(photo.id))
      : photos.filter((photo) => likedPhotos.includes(photo.id));

  // Category list excluding "All"
  const distinctCategories = categories.filter((c) => c !== "All");

  // Filtered by category tab if user picks one
  const displayCategories =
    selectedCategory === "All"
      ? distinctCategories
      : distinctCategories.filter((c) => c === selectedCategory);

  return (
    <main className="main collection-page">
      <div className="collection-header">
        <div className="collection-title-wrap">
          <h1>
            <span>📁</span> My Collection
          </h1>
          <p className="collection-sub">
            {activeTab === "favorites" ? (
              <>
                Favourites saved by <strong>{currentUser || "User"}</strong>
              </>
            ) : (
              <>
                Photos liked by <strong>{currentUser || "User"}</strong>
              </>
            )}
          </p>

          {/* Interactive Collection Filter Tabs */}
          <div className="collection-stats-bar">
            <button
              type="button"
              onClick={() => handleTabChange("liked")}
              className={`collection-stat-pill ${activeTab === "liked" ? "stat-active-liked" : ""}`}
              title="Click to view liked photos"
            >
              <span>👍</span>
              <strong>{likedPhotos.length}</strong> Total Liked Photos
            </button>

            <button
              type="button"
              onClick={() => handleTabChange("favorites")}
              className={`collection-stat-pill ${activeTab === "favorites" ? "stat-active-fav" : ""}`}
              title="Click to view saved favourites"
            >
              <span>❤️</span>
              <strong>{favorites.length}</strong> Favourites Saved
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Pills for My Collection */}
      <div className="category-row" style={{ marginBottom: "28px" }}>
        <div className="category-pills">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`pill ${selectedCategory === "All" ? "pill-active" : ""}`}
            style={
              selectedCategory === "All"
                ? {
                    background: activeTab === "favorites" ? "#ef4444" : "var(--accent)",
                    color: "#fff",
                    borderColor: activeTab === "favorites" ? "#ef4444" : "var(--accent)",
                    boxShadow:
                      activeTab === "favorites"
                        ? "0 4px 14px rgba(239,68,68,0.35)"
                        : "0 4px 14px var(--accent-glow)",
                  }
                : {}
            }
          >
            All Categories ({currentCollection.length})
          </button>
          {distinctCategories.map((cat) => {
            const count = currentCollection.filter((p) => p.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`pill ${selectedCategory === cat ? "pill-active" : ""}`}
                style={
                  selectedCategory === cat
                    ? {
                        background: activeTab === "favorites" ? "#ef4444" : "var(--accent)",
                        color: "#fff",
                        borderColor: activeTab === "favorites" ? "#ef4444" : "var(--accent)",
                        boxShadow:
                          activeTab === "favorites"
                            ? "0 4px 14px rgba(239,68,68,0.35)"
                            : "0 4px 14px var(--accent-glow)",
                      }
                    : {}
                }
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* When user has no items in the active collection */}
      {currentCollection.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">{activeTab === "favorites" ? "❤️" : "📁"}</div>
          <h3>{activeTab === "favorites" ? "No Favourites Saved Yet" : "Your Liked Collection is Empty"}</h3>
          <p>
            {activeTab === "favorites"
              ? "You haven't added any favourites yet. Browse the gallery and click the ♥ icon on any photo to save it here!"
              : "You haven't liked any photos yet. Browse the gallery and click the 👍 button on photos to add them to your collection!"}
          </p>
          <br />
          <Link to="/gallery" className="pill pill-active" style={{ textDecoration: "none", marginTop: "14px" }}>
            Explore Gallery →
          </Link>
        </div>
      ) : (
        /* Render Each Category Separately */
        displayCategories.map((cat) => {
          const categoryPhotos = currentCollection.filter((photo) => photo.category === cat);

          return (
            <section key={cat} className="collection-category-section">
              <div className="collection-category-header">
                <h2 className="collection-category-title">
                  {cat === "Nature" && "🌿"}
                  {cat === "Architecture" && "🏛️"}
                  {cat === "Animals" && "🐾"}
                  {cat === "People" && "👥"}
                  {cat === "Travel" && "✈️"}{" "}
                  {cat}
                </h2>
                <span className="collection-category-badge">
                  {categoryPhotos.length} {categoryPhotos.length === 1 ? "Photo" : "Photos"}
                </span>
              </div>

              {categoryPhotos.length > 0 ? (
                <div className="collection-grid">
                  {categoryPhotos.map((photo) => {
                    const isPhotoFav = favorites.includes(photo.id);
                    const isPhotoLiked = likedPhotos.includes(photo.id);

                    return (
                      <article key={photo.id} className="collection-card">
                        <div className="collection-card-img-wrap">
                          <Link to={`/photo/${photo.id}`}>
                            <img src={photo.src} alt={photo.title} className="collection-card-img" />
                          </Link>
                          {/* Photo ID Prominently Displayed */}
                          <span className="collection-id-tag">Photo ID: #{photo.id}</span>
                        </div>

                        <div className="collection-card-body">
                          <h3 className="collection-card-title">{photo.title}</h3>
                          <p className="collection-card-meta">
                            <span>{photo.photographer}</span> · <span>{photo.location}</span>
                          </p>

                          <div className="collection-card-footer">
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <button
                                type="button"
                                onClick={() => onToggleLike && onToggleLike(photo.id)}
                                className={`card-like-btn ${isPhotoLiked ? "card-like-active" : ""}`}
                                title={isPhotoLiked ? "Unlike photo" : "Like photo"}
                              >
                                <span>👍</span>
                                <span>{isPhotoLiked ? "Liked" : "Like"}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => onToggleFavorite && onToggleFavorite(photo.id)}
                                className={`fav-btn ${isPhotoFav ? "fav-btn-active" : ""}`}
                                title={isPhotoFav ? "Remove from favourites" : "Add to favourites"}
                                aria-label={isPhotoFav ? "Remove from favourites" : "Add to favourites"}
                              >
                                <span className="fav-heart-icon">{isPhotoFav ? "♥" : "♡"}</span>
                              </button>
                            </div>

                            <Link to={`/photo/${photo.id}`} className="card-link">
                              Details →
                            </Link>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="collection-empty-cat">
                  No {activeTab === "favorites" ? "favourite" : "liked"} photos in {cat} yet. Browse the gallery to {activeTab === "favorites" ? "favourite" : "like"} photos in this category.
                </div>
              )}
            </section>
          );
        })
      )}
    </main>
  );
}

export default MyCollectionPage;
