import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { downloadImage } from "../utils/downloadHelper";

function DetailPage({ photos, favorites, onToggleFavorite, likedPhotos = [], onToggleLike }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const photo = photos.find((p) => String(p.id) === String(id));

  if (!photo) {
    return (
      <main className="main detail-main">
        <div className="empty-state">
          <h3>Photo not found</h3>
          <p>The image you’re looking for doesn’t exist.</p>
          <Link to="/" className="back-link">
            ← Back to gallery
          </Link>
        </div>
      </main>
    );
  }

  const isFav = favorites.includes(photo.id);
  const isLiked = likedPhotos.includes(photo.id);
  const related = photos.filter((p) => p.category === photo.category && p.id !== photo.id).slice(0, 3);

  const handleDownload = async () => {
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
    <main className="main detail-main">
      <button onClick={() => navigate(-1)} className="back-btn">
        ← Back
      </button>

      <article className="detail-card">
        <div className="detail-img-wrap">
          <img src={photo.src} alt={photo.title} className="detail-img" />
          <span className="card-badge detail-card-badge" data-category={photo.category}>
            <span className="badge-bullet"></span>
            {photo.category}
          </span>
        </div>

        <div className="detail-body">
          <div className="detail-header">
            <div>
              <h1 className="detail-title">{photo.title}</h1>
              <p className="detail-meta">
                by <strong>{photo.photographer}</strong> · {photo.location}
              </p>
            </div>
            <div className="detail-actions">
              <button
                type="button"
                onClick={() => onToggleLike && onToggleLike(photo.id)}
                className={`detail-action-btn detail-like-btn ${isLiked ? "detail-like-active" : ""}`}
                title={isLiked ? "Unlike photo (removes from My Collection)" : "Like photo (adds to My Collection)"}
              >
                <span className="detail-btn-icon">👍</span>
                <span>{isLiked ? "Liked" : "Like"}</span>
                <span className="detail-like-count">({(photo.likes || 0).toLocaleString()})</span>
              </button>

              <button
                type="button"
                onClick={handleDownload}
                disabled={downloading}
                className={`detail-action-btn detail-download-btn ${downloaded ? "detail-downloaded" : ""}`}
                title="Download photo"
              >
                {downloaded ? (
                  <>
                    <span className="detail-btn-icon detail-check-icon">✓</span>
                    <span>Downloaded!</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="detail-btn-icon"
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
                    <span>{downloading ? "Downloading..." : "Download"}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => onToggleFavorite(photo.id)}
                className={`detail-action-btn detail-fav-btn ${isFav ? "detail-fav-active" : ""}`}
                title={isFav ? "Remove from favourites" : "Add to favourites"}
              >
                <span className="detail-btn-icon detail-heart-icon">{isFav ? "♥" : "♡"}</span>
                <span>{isFav ? "Favourited" : "Add to favourites"}</span>
              </button>
            </div>
          </div>

          <p className="detail-desc">{photo.description}</p>

          <div className="detail-info-grid">
            <div className="info-item">
              <span className="info-label">Category</span>
              <span className="info-value">{photo.category}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Likes</span>
              <span className="info-value">♡ {photo.likes.toLocaleString()}</span>
            </div>
            <div className="info-item">
              <span className="info-label">ID</span>
              <span className="info-value">#{String(photo.id).padStart(3, "0")}</span>
            </div>
          </div>

          <div className="detail-actions">
            <a href={photo.src} target="_blank" rel="noreferrer" className="pill pill-active" style={{ textDecoration: "none" }}>
              Open full image
            </a>
            <Link to="/" className="pill" style={{ textDecoration: "none" }}>
              Explore gallery
            </Link>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="related">
          <h3 className="related-title">More in {photo.category}</h3>
          <div className="related-grid">
            {related.map((r) => (
              <Link key={r.id} to={`/photo/${r.id}`} className="related-card">
                <img src={r.src} alt={r.title} className="related-img" />
                <div className="related-overlay">
                  <span>{r.title}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

export default DetailPage;
