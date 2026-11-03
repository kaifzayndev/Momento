import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Footer({ onResetFilters, isAuthenticated = false }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleMomentoClick = () => {
    // Reset filters to starting state
    if (onResetFilters) {
      onResetFilters();
    }

    // Smoothly scroll back to top from the footer
    if (typeof window !== "undefined" && typeof window.scrollTo === "function") {
      try {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      } catch {
        window.scrollTo(0, 0);
      }
    }

    // Navigate back to home / gallery if on another page
    const targetPath = isAuthenticated ? "/gallery" : "/";
    if (location.pathname !== targetPath) {
      navigate(targetPath);
    }
  };

  return (
    <footer className="footer">
      <div className="footer-inner">
        <p>
          © {new Date().getFullYear()}{" "}
          <span
            className="footer-brand-clickable"
            onClick={handleMomentoClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleMomentoClick();
              }
            }}
            title="Click to reload from start"
            aria-label="Momento - Reload starting view"
          >
            Momento
          </span>{" "}
          Gallery — Built with React, React Router & love for photography.
        </p>
        <p className="footer-sub">Sample images from Unsplash</p>
      </div>
    </footer>
  );
}

export default Footer;
