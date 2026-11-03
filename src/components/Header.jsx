import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Header({
  theme,
  toggleTheme,
  favoritesCount,
  showFavoritesOnly,
  onToggleShowFavorites,
  onResetFilters,
  isAdminLoggedIn,
  isUserLoggedIn,
  currentUser,
  onLogout,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const isAuthenticated = isAdminLoggedIn || isUserLoggedIn;

  const handleLogoClick = (e) => {
    if (onResetFilters) {
      onResetFilters();
    }
    if (typeof window !== "undefined" && typeof window.scrollTo === "function") {
      try {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      } catch {
        window.scrollTo(0, 0);
      }
    }

    const targetPath = isAuthenticated ? "/gallery" : "/";
    if (location.pathname === targetPath) {
      if (e && e.preventDefault) e.preventDefault();
      if (typeof window !== "undefined" && typeof window.scrollTo === "function") {
        try {
          window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        } catch {
          window.scrollTo(0, 0);
        }
      }
    } else {
      navigate(targetPath);
    }
  };

  const handleFavClick = () => {
    if (location.pathname !== "/gallery" && location.pathname !== "/") {
      navigate("/gallery");
    }
    if (onToggleShowFavorites) {
      onToggleShowFavorites();
    }
  };

  return (
    <header className="header">
      <div className="header-inner">
        {/* Logo / Brand */}
        <Link
          to={isAuthenticated ? "/gallery" : "/"}
          onClick={handleLogoClick}
          className="logo"
          title="Momento Gallery - Return to start & refresh"
          aria-label="Momento Home"
        >
          <span className="logo-icon">
            <svg
              className="logo-aperture-svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="9" />
              <circle cx="12" cy="12" r="3.5" />
              <path d="m14.5 9.5 5-2" />
              <path d="m14.5 14.5 2 5" />
              <path d="m9.5 14.5-5 2" />
              <path d="m9.5 9.5-2-5" />
            </svg>
          </span>
          <div className="logo-text-group">
            <span className="logo-text">
              MOMENTO<span className="logo-accent-dot">.</span>
            </span>
            <span className="logo-sub">ATELIER // ARCHIVE</span>
          </div>
        </Link>

        {/* Navigation + Actions */}
        <nav className="nav-actions">
          {isAuthenticated && (
            <>
              {/* Interactive Favourites Badge - Only for regular users */}
              {!isAdminLoggedIn && (
                <button
                  type="button"
                  onClick={handleFavClick}
                  className={`fav-badge-btn ${showFavoritesOnly ? "fav-badge-active" : ""}`}
                  title="Click to view favourites"
                  aria-label="Toggle favourites filter"
                >
                  <span className="heart">♥</span>
                  <span className="fav-count">{favoritesCount}</span>
                  <span className="fav-label">{showFavoritesOnly ? "Showing Favourites" : "Favourites"}</span>
                </button>
              )}

              {/* Admin Dashboard Nav Link */}
              {isAdminLoggedIn && (
                <Link
                  to="/admin"
                  className={`nav-link admin-nav-link ${location.pathname === "/admin" ? "active-nav" : ""}`}
                >
                  ⚙️ Dashboard
                </Link>
              )}

              {/* User Dropdown with My Collection & Logout */}
              <div
                className="user-dropdown-wrapper"
                onMouseEnter={() => setIsUserMenuOpen(true)}
                onMouseLeave={() => setIsUserMenuOpen(false)}
              >
                <button
                  type="button"
                  className={`user-dropdown-btn ${isUserMenuOpen ? "active" : ""}`}
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="true"
                >
                  <span className="user-dropdown-avatar">
                    {isAdminLoggedIn ? "🛡️" : "👤"}
                  </span>
                  <span className="user-dropdown-name">
                    {currentUser || (isAdminLoggedIn ? "Administrator" : "User")}
                  </span>
                  <span className="user-dropdown-arrow">▾</span>
                </button>

                <div className={`user-dropdown-menu ${isUserMenuOpen ? "show" : ""}`}>
                  <div className="user-dropdown-header">
                    <span className="user-dropdown-label">Signed in as</span>
                    <span className="user-dropdown-email">
                      {currentUser || (isAdminLoggedIn ? "admin@bwu.edu" : "user@bwu.edu")}
                    </span>
                  </div>

                  {/* 1. My Collection - Regular user only */}
                  {!isAdminLoggedIn && (
                    <button
                      type="button"
                      className={`user-dropdown-item ${location.pathname === "/collection" ? "item-active" : ""}`}
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        navigate("/collection");
                      }}
                    >
                      <span className="user-dropdown-icon">📁</span>
                      <div className="user-dropdown-text">
                        <strong>My Collection</strong>
                        <small>Liked photos</small>
                      </div>
                    </button>
                  )}

                  {/* Logout */}
                  <div style={{ borderTop: "1px solid var(--border)", margin: "4px 0" }} />
                  <button
                    type="button"
                    className="user-dropdown-item user-dropdown-logout"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onLogout();
                    }}
                  >
                    <span className="user-dropdown-icon">🔒</span>
                    <div className="user-dropdown-text">
                      <strong style={{ color: "#ef4444" }}>Logout</strong>
                      <small>Sign out of session</small>
                    </div>
                  </button>
                </div>
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;

