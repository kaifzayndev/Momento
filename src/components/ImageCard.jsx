import React, { useState } from "react";
import { Link } from "react-router-dom";
import { downloadImage } from "../utils/downloadHelper";

// Reusable Image Card — Full-Bleed Edge-to-Edge Exhibition Masterpiece
function ImageCard({ photo, isFavorite, onToggleFavorite, isLiked, onToggleLike, index = 0, viewDensity = "editorial" }) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (downloading) return;
    setDownloading(true);
    try {
      await downloadImage(photo.src, photo.title);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2200);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <article className="card card-full-bleed">
      <div className="card-media-wrapper">
        <Link to={`/photo/${photo.id}`} className="card-image-link" aria-label={`View ${photo.title}`}>
          <img src={photo.src} alt={photo.title} loading="lazy" className="card-img" />
          <div className="card-overlay" />
          <span className="card-view-hint">Inspect Exhibit →</span>
        </Link>

        {/* Floating Top Classification & Quick Action Dock */}
        <div className="card-top-dock">
          <span className="card-badge" data-category={photo.category}>
            <span className="badge-bullet"></span>
            {photo.category}
          </span>

          <div className="card-actions">
            {/* Download Option Button */}
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              aria-label={`Download ${photo.title}`}
              title={downloading ? "Downloading..." : downloaded ? "Downloaded!" : "Download image"}
              className={`download-btn ${downloaded ? "downloaded" : ""} ${downloading ? "downloading" : ""}`}
            >
              {downloaded ? (
                <span className="download-status-icon">✓</span>
              ) : (
                <svg
                  className="download-icon"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              )}
            </button>

            {/* Favorite Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onToggleFavorite(photo.id);
              }}
              aria-label={isFavorite ? "Remove from favourites" : "Add to favourites"}
              title={isFavorite ? "Remove from favourites" : "Add to favourites"}
              className={`fav-btn ${isFavorite ? "fav-btn-active" : ""}`}
            >
              <span className="fav-heart-icon">{isFavorite ? "♥" : "♡"}</span>
            </button>
          </div>
        </div>

        {/* Bottom Floating Glass HUD */}
        <div className="card-body">
          <div className="card-index-indicator">
            <span className="exhibit-number">ARCHIVE № {String(index + 1).padStart(2, "0")}</span>
            <span className="exhibit-category-dim">{photo.category}</span>
          </div>

          <div className="card-title-row">
            <h3 className="card-title">
              <Link to={`/photo/${photo.id}`} className="card-title-link">
                {photo.title}
              </Link>
            </h3>
          </div>

          <p className="card-meta">
            <span className="card-photographer-avatar" aria-hidden="true">
              {photo.photographer ? photo.photographer.split(" ").map(n => n[0]).join("").slice(0, 2) : "PH"}
            </span>
            <span className="card-photographer">{photo.photographer}</span>
            <span className="dot">·</span>
            <span className="card-location">{photo.location}</span>
          </p>

          <div className="card-footer">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                if (onToggleLike) onToggleLike(photo.id);
              }}
              className={`card-like-btn ${isLiked ? "card-like-active" : ""}`}
              title={isLiked ? "Unlike photo (removes from My Collection)" : "Like photo (adds to My Collection)"}
            >
              <span className="like-emoji">👍</span>
              <span>{(photo.likes || 0).toLocaleString()}</span>
            </button>

            <Link to={`/photo/${photo.id}`} className="card-link">
              <span>Inspect</span>
              <span className="link-arrow">→</span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export default ImageCard;
