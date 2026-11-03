import React from "react";
import { categories } from "../data/galleryData";

// FilterBar handles search + category filter + favorites toggle
function FilterBar({
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
  showFavoritesOnly,
  setShowFavoritesOnly,
  resultCount,
  isAdminLoggedIn,
}) {
  return (
    <div className="filter-bar">
      {/* Top row: Search + Favorites toggle (users only) */}
      <div className="filter-top">
        <div className="search-wrap">
          <svg
            className="search-icon-svg"
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search photos, places, photographers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button className="clear-btn" onClick={() => setSearchQuery("")} aria-label="Clear search">
              ×
            </button>
          )}
        </div>

        {!isAdminLoggedIn && (
          <label className="fav-toggle">
            <input
              type="checkbox"
              checked={showFavoritesOnly}
              onChange={(e) => setShowFavoritesOnly(e.target.checked)}
            />
            <span className="fav-toggle-box" />
            <span>Only favourites</span>
            <span className="fav-heart" style={{ color: showFavoritesOnly ? "#ef4444" : "var(--muted)" }}>
              ♥
            </span>
          </label>
        )}
      </div>

      {/* Category pills - uses map() to render from JS array */}
      <div className="category-row">
        <div className="category-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`pill ${activeCategory === cat ? "pill-active" : ""}`}
            >
              <span className="pill-dot"></span>
              {cat}
            </button>
          ))}
        </div>
        <p className="result-count">
          <span className="result-count-indicator">●</span>
          <strong>{resultCount}</strong> {resultCount === 1 ? "exhibit" : "exhibits"}
        </p>
      </div>
    </div>
  );
}

export default FilterBar;
