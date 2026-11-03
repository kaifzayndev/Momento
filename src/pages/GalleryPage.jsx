import React, { useState } from "react";
import { Link } from "react-router-dom";
import FilterBar from "../components/FilterBar";
import ImageCard from "../components/ImageCard";
import { categories } from "../data/galleryData";

function GalleryPage({
  photos,
  setPhotos,
  favorites,
  onToggleFavorite,
  likedPhotos = [],
  onToggleLike,
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
  showFavoritesOnly,
  setShowFavoritesOnly,
  isAdminLoggedIn,
}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [viewDensity, setViewDensity] = useState("editorial");

  const [formData, setFormData] = useState({
    title: "",
    category: "Nature",
    src: "",
    photographer: "",
    location: "",
    description: "",
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleAddPhoto = (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.title || !formData.src || !formData.photographer || !formData.location) {
      setFormError("Please fill out all required fields.");
      return;
    }

    const newPhoto = {
      id: Date.now(),
      ...formData,
      likes: 0,
    };

    setPhotos((prev) => [newPhoto, ...prev]);
    showToast(`Successfully added "${formData.title}" to gallery!`);

    // Reset form
    setFormData({
      title: "",
      category: "Nature",
      src: "",
      photographer: "",
      location: "",
      description: "",
    });
    setIsAddModalOpen(false);
  };

  // Combined filter: category + search + favorites
  const filtered = photos.filter((photo) => {
    const matchesCategory = activeCategory === "All" || photo.category === activeCategory;
    const matchesSearch =
      photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.photographer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFav = showFavoritesOnly ? favorites.includes(photo.id) : true;
    return matchesCategory && matchesSearch && matchesFav;
  });

  return (
    <main className="main">
      {toastMessage && <div className="admin-toast">{toastMessage}</div>}

      {/* Hero Exhibition Masthead — Split Dynamic Showcase */}
      <section className="hero">
        <div className="hero-card">
          <div className="hero-grid">
            {/* Left Column: Editorial Information & Actions */}
            <div className="hero-content-col">
              <div className="hero-kicker-row">
                <div className="hero-kicker">
                  <span className="hero-live-dot"></span>
                  <span>CURATED VISUAL ANTHOLOGY // SEASON 2026</span>
                </div>
                {isAdminLoggedIn && (
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="pill pill-active hero-add-btn"
                  >
                    + Add Photo
                  </button>
                )}
              </div>

              <h1 className="hero-title">
                Visual Stories, <span className="hero-accent-text">Captured in Light</span>
              </h1>

              <p className="hero-subtitle">
                An international curated exhibition of fine-art photography, high-dynamic landscapes, and urban perspectives. Curated daily, free for high-resolution inspection.
              </p>

              {/* Trending Disciplines Quick Jump */}
              <div className="hero-quick-genres">
                <span className="hero-genres-label">Trending Disciplines:</span>
                <div className="hero-genre-tags">
                  {["Astrophotography", "Ocean", "Street", "Minimalism", "Aerial"].map((genre) => (
                    <button
                      key={genre}
                      type="button"
                      className={`hero-genre-tag ${activeCategory === genre ? "active" : ""}`}
                      onClick={() => setActiveCategory(genre)}
                    >
                      #{genre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Exhibition Stats Strip */}
              <div className="hero-stats">
                <div className="hero-stat-pill">
                  <span className="stat-bullet">●</span>
                  <span><strong>{photos.length}</strong> Master Works</span>
                </div>
                {!isAdminLoggedIn && (
                  <div
                    className="hero-stat-pill hero-stat-clickable"
                    onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                    title="Click to toggle favourites"
                  >
                    <span className="stat-bullet stat-bullet-heart">♥</span>
                    <span><strong>{favorites.length}</strong> Favourites Saved</span>
                  </div>
                )}
                <div className="hero-stat-pill">
                  <span className="stat-bullet">✦</span>
                  <span>Direct 4K Export</span>
                </div>
                {isAdminLoggedIn && (
                  <div className="hero-stat-pill stat-admin-pill">
                    <span>⚙️ Studio Curator Active</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Layered 3D Photographic Showcase */}
            {photos.length > 0 && (
              <div className="hero-spotlight-col">
                <div className="hero-stack-container">
                  {/* Layer Card 2 */}
                  {photos[6] && (
                    <div
                      className="hero-layer-card hero-layer-card-2"
                      style={{ backgroundImage: `url(${photos[6].src})` }}
                      aria-hidden="true"
                    />
                  )}
                  {/* Layer Card 1 */}
                  {photos[2] && (
                    <div
                      className="hero-layer-card hero-layer-card-1"
                      style={{ backgroundImage: `url(${photos[2].src})` }}
                      aria-hidden="true"
                    />
                  )}

                  {/* Foreground Featured Spotlight Card */}
                  {photos[1] && (
                    <Link
                      to={`/photo/${photos[1].id}`}
                      className="hero-spotlight-card"
                      title={`View Featured Exhibit: ${photos[1].title}`}
                    >
                      <img
                        src={photos[1].src}
                        alt={photos[1].title}
                        className="hero-spotlight-img"
                      />
                      <div className="hero-spotlight-overlay" />

                      <div className="hero-spotlight-top">
                        <span className="hero-spotlight-badge">
                          <span className="spotlight-star">✦</span>
                          <span>FEATURED EXHIBIT</span>
                        </span>
                        <span className="hero-spotlight-tag">
                          {photos[1].category}
                        </span>
                      </div>

                      <div className="hero-spotlight-footer">
                        <div>
                          <h4 className="hero-spotlight-title">{photos[1].title}</h4>
                          <p className="hero-spotlight-artist">
                            by <strong>{photos[1].photographer}</strong> · {photos[1].location}
                          </p>
                        </div>
                        <span className="hero-spotlight-cta">
                          Inspect →
                        </span>
                      </div>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <FilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        showFavoritesOnly={showFavoritesOnly}
        setShowFavoritesOnly={setShowFavoritesOnly}
        resultCount={filtered.length}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* Exhibition Control Ribbon & Layout Density Toggle */}
      {filtered.length > 0 && (
        <div className="gallery-view-header">
          <div className="gallery-view-title-group">
            <div className="gallery-section-tag">
              <span className="live-dot" />
              <span>CURATED MASTERWORKS</span>
            </div>
            <p className="gallery-section-sub">
              Fine-Art Exhibition · High-Dynamic Range Collection
            </p>
          </div>

          <div className="gallery-layout-toggle" role="group" aria-label="Gallery view mode">
            <button
              type="button"
              className={`layout-toggle-btn ${viewDensity === "editorial" ? "active" : ""}`}
              onClick={() => setViewDensity("editorial")}
              title="Editorial 3-Column Exhibition"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="18" rx="1.5" />
                <rect x="14" y="3" width="7" height="18" rx="1.5" />
              </svg>
              <span>Editorial</span>
            </button>
            <button
              type="button"
              className={`layout-toggle-btn ${viewDensity === "compact" ? "active" : ""}`}
              onClick={() => setViewDensity("compact")}
              title="Compact 4-Column Grid"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="8" height="8" rx="1.5" />
                <rect x="13" y="3" width="8" height="8" rx="1.5" />
                <rect x="3" y="13" width="8" height="8" rx="1.5" />
                <rect x="13" y="13" width="8" height="8" rx="1.5" />
              </svg>
              <span>Compact</span>
            </button>
            <button
              type="button"
              className={`layout-toggle-btn ${viewDensity === "panoramic" ? "active" : ""}`}
              onClick={() => setViewDensity("panoramic")}
              title="Panoramic 2-Column Wide Display"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="7" rx="1.5" />
                <rect x="3" y="13" width="18" height="7" rx="1.5" />
              </svg>
              <span>Panoramic</span>
            </button>
          </div>
        </div>
      )}

      {/* Grid uses CSS Grid, responsive */}
      {filtered.length > 0 ? (
        <section className={`grid grid-${viewDensity}`}>
          {filtered.map((photo, idx) => (
            <ImageCard
              key={photo.id}
              photo={photo}
              index={idx}
              viewDensity={viewDensity}
              isFavorite={favorites.includes(photo.id)}
              onToggleFavorite={onToggleFavorite}
              isLiked={likedPhotos.includes(photo.id)}
              onToggleLike={onToggleLike}
            />
          ))}
        </section>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No photos found</h3>
          <p>Try adjusting your search or category filter. Your favourites are still safe!</p>
          <button
            className="pill pill-active"
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("All");
              setShowFavoritesOnly(false);
            }}
            style={{ marginTop: "12px" }}
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Add Photo Modal inside Gallery View */}
      {isAddModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Photo to Gallery</h2>
              <button className="modal-close-btn" onClick={() => setIsAddModalOpen(false)}>
                ×
              </button>
            </div>

            {formError && <div className="alert alert-error">⚠️ {formError}</div>}

            <form onSubmit={handleAddPhoto} className="admin-form">
              <div className="form-group">
                <label>Photo Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Sunset Over Horizon"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="form-input"
                  >
                    {categories
                      .filter((c) => c !== "All")
                      .map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Photographer *</label>
                  <input
                    type="text"
                    placeholder="e.g. Jane Smith"
                    value={formData.photographer}
                    onChange={(e) => setFormData({ ...formData, photographer: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Image URL *</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.src}
                  onChange={(e) => setFormData({ ...formData, src: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>Location *</label>
                <input
                  type="text"
                  placeholder="e.g. Tokyo, Japan"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="3"
                  placeholder="Brief description of the photo..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="pill"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="pill pill-active">
                  + Publish Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default GalleryPage;
