import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { categories } from "../data/galleryData";
import LoginPage from "./LoginPage";

function AdminPage({
  photos,
  setPhotos,
  favorites,
  isAdminLoggedIn,
  setIsAdminLoggedIn,
  setIsUserLoggedIn,
  setCurrentUser,
  onResetFilters,
}) {

  // Search, Filter & Sort state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("auto"); // "auto", "table", "cards"

  // Registered Users state (for Our Users modal)
  const [isUsersModalOpen, setIsUsersModalOpen] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [registeredUsers] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("ff-registered-users"));
      if (Array.isArray(stored) && stored.length > 0) return stored;
    } catch {}

    const currentStoredEmail = localStorage.getItem("ff-user-email");
    const initial = [
      { email: "user@bwu.edu", role: "User", lastLogin: "Today, 10:45 AM", status: "Active" },
      { email: "contactar2@gmail.com", role: "User", lastLogin: "Yesterday, 04:20 PM", status: "Active" },
      { email: "alex.dev@gmail.com", role: "User", lastLogin: "2 days ago", status: "Active" },
    ];
    if (
      currentStoredEmail &&
      !initial.some((u) => (typeof u === "string" ? u : u.email).toLowerCase() === currentStoredEmail.toLowerCase())
    ) {
      initial.unshift({
        email: currentStoredEmail,
        role: "User",
        lastLogin: "Active session",
        status: "Active",
      });
    }
    return initial;
  });

  const filteredUsers = useMemo(() => {
    if (!userSearchTerm.trim()) return registeredUsers;
    const term = userSearchTerm.trim().toLowerCase();
    return registeredUsers.filter((u) => {
      const email = typeof u === "string" ? u : u.email;
      return email.toLowerCase().includes(term);
    });
  }, [registeredUsers, userSearchTerm]);

  // Photographers Modal state & photo grouping
  const [isPhotographersModalOpen, setIsPhotographersModalOpen] = useState(false);
  const [photographerSearchTerm, setPhotographerSearchTerm] = useState("");

  const photographersList = useMemo(() => {
    const map = new Map();
    photos.forEach((photo) => {
      const name = photo.photographer ? photo.photographer.trim() : "Unknown";
      if (!map.has(name)) {
        map.set(name, {
          name,
          photos: [],
          locations: new Set(),
          categories: new Set(),
          totalLikes: 0,
        });
      }
      const item = map.get(name);
      item.photos.push(photo);
      if (photo.location) item.locations.add(photo.location);
      if (photo.category) item.categories.add(photo.category);
      item.totalLikes += photo.likes || 0;
    });
    return Array.from(map.values()).sort((a, b) => b.photos.length - a.photos.length);
  }, [photos]);

  const filteredPhotographers = useMemo(() => {
    if (!photographerSearchTerm.trim()) return photographersList;
    const term = photographerSearchTerm.trim().toLowerCase();
    return photographersList.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        Array.from(p.locations).some((loc) => loc.toLowerCase().includes(term)) ||
        Array.from(p.categories).some((cat) => cat.toLowerCase().includes(term))
    );
  }, [photographersList, photographerSearchTerm]);

  // New / Edit Photo Form state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [imageLoadError, setImageLoadError] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "Nature",
    src: "",
    photographer: "",
    location: "",
    description: "",
  });

  const [formError, setFormError] = useState("");
  const [notification, setNotification] = useState("");

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3500);
  };

  // Open Add modal with clean state
  const openAddModal = () => {
    setEditingPhoto(null);
    setImageLoadError(false);
    setFormError("");
    setFormData({
      title: "",
      category: "Nature",
      src: "",
      photographer: "",
      location: "",
      description: "",
    });
    setIsAddModalOpen(true);
  };

  // Open Edit modal with photo data
  const startEdit = (photo) => {
    setEditingPhoto(photo);
    setImageLoadError(false);
    setFormError("");
    setFormData({
      title: photo.title,
      category: photo.category,
      src: photo.src,
      photographer: photo.photographer,
      location: photo.location,
      description: photo.description || "",
    });
    setIsAddModalOpen(true);
  };

  // Handle Save (Add or Edit Photo)
  const handleSavePhoto = (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.title || !formData.src || !formData.photographer || !formData.location) {
      setFormError("Please fill out all required fields.");
      return;
    }

    if (editingPhoto) {
      // Edit existing photo
      setPhotos((prev) =>
        prev.map((p) => (p.id === editingPhoto.id ? { ...p, ...formData } : p))
      );
      showToast(`Updated "${formData.title}" successfully!`);
    } else {
      // Add new photo
      const newPhoto = {
        id: Date.now(),
        ...formData,
        likes: 0,
      };
      setPhotos((prev) => [newPhoto, ...prev]);
      showToast(`Added "${formData.title}" to gallery!`);
    }

    setIsAddModalOpen(false);
  };

  // Delete Photo
  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      setPhotos((prev) => prev.filter((p) => p.id !== id));
      showToast(`Deleted "${title}".`);
    }
  };

  // Filter & Sort Logic
  const filteredPhotos = useMemo(() => {
    return photos
      .filter((photo) => {
        const matchesCategory = filterCategory === "All" || photo.category === filterCategory;
        const term = searchTerm.trim().toLowerCase();
        const matchesSearch =
          !term ||
          photo.title.toLowerCase().includes(term) ||
          photo.photographer.toLowerCase().includes(term) ||
          photo.location.toLowerCase().includes(term) ||
          (photo.description && photo.description.toLowerCase().includes(term));
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "newest":
            return Number(b.id) - Number(a.id);
          case "oldest":
            return Number(a.id) - Number(b.id);
          case "likes-desc":
            return (b.likes || 0) - (a.likes || 0);
          case "likes-asc":
            return (a.likes || 0) - (b.likes || 0);
          case "title-asc":
            return a.title.localeCompare(b.title);
          case "title-desc":
            return b.title.localeCompare(a.title);
          default:
            return 0;
        }
      });
  }, [photos, searchTerm, filterCategory, sortBy]);

  // Toggle sort from table headers
  const handleSortHeader = (type) => {
    if (type === "title") {
      setSortBy((prev) => (prev === "title-asc" ? "title-desc" : "title-asc"));
    } else if (type === "likes") {
      setSortBy((prev) => (prev === "likes-desc" ? "likes-asc" : "likes-desc"));
    } else if (type === "id") {
      setSortBy((prev) => (prev === "newest" ? "oldest" : "newest"));
    }
  };

  const hasActiveFilters = searchTerm.trim() !== "" || filterCategory !== "All";

  const resetFilters = () => {
    setSearchTerm("");
    setFilterCategory("All");
  };

  const adminEmail = localStorage.getItem("ff-admin-email") || "admin@bwu.edu";

  // Render Login Form if not authenticated
  if (!isAdminLoggedIn) {
    return (
      <LoginPage
        setIsAdminLoggedIn={setIsAdminLoggedIn}
        setIsUserLoggedIn={setIsUserLoggedIn}
        setCurrentUser={setCurrentUser}
        onResetFilters={onResetFilters}
        defaultRole="admin"
      />
    );
  }

  return (
    <main className="main admin-dashboard">
      {notification && <div className="admin-toast">{notification}</div>}

      {/* Topbar */}
      <div className="admin-topbar">
        <div>
          <h1 className="admin-title">Admin Dashboard</h1>
          <p className="admin-sub">
            Logged in as <strong style={{ color: "var(--accent)" }}>{adminEmail}</strong>
          </p>
        </div>

        <div className="admin-actions-top">
          <button onClick={openAddModal} className="pill pill-active">
            + Add New Photo
          </button>
        </div>
      </div>

      {/* Admin Stats Cards */}
      <div className="admin-stats-grid">
        <div className="stat-card">
          <span className="stat-icon">📷</span>
          <div>
            <span className="stat-val">{photos.length}</span>
            <span className="stat-label">Total Gallery Photos</span>
          </div>
        </div>
        <div
          className="stat-card stat-card-clickable"
          onClick={() => setIsUsersModalOpen(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setIsUsersModalOpen(true)}
          title="Click to view all registered users"
          aria-label="Click to view all registered users"
        >
          <span className="stat-icon">👥</span>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span className="stat-val">{registeredUsers.length}</span>
              <span className="stat-badge-pill">View ↗</span>
            </div>
            <span className="stat-label">Our Users</span>
          </div>
        </div>
        <div
          className="stat-card stat-card-clickable"
          onClick={() => setIsPhotographersModalOpen(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setIsPhotographersModalOpen(true)}
          title="Click to view all photographers and their pictures"
          aria-label="Click to view all photographers and their pictures"
        >
          <span className="stat-icon">📸</span>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span className="stat-val">{photographersList.length}</span>
              <span className="stat-badge-pill">View ↗</span>
            </div>
            <span className="stat-label">Photographers</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">👍</span>
          <div>
            <span className="stat-val">
              {photos.reduce((sum, p) => sum + (p.likes || 0), 0).toLocaleString()}
            </span>
            <span className="stat-label">Total Likes</span>
          </div>
        </div>
      </div>

      {/* Photo Management Section */}
      <section className="admin-table-section">
        <div className="admin-section-header">
          <div>
            <h2 className="section-subtitle">Manage Photos</h2>
            <p className="admin-section-hint">
              Showing <strong>{filteredPhotos.length}</strong> of <strong>{photos.length}</strong> total photos
            </p>
          </div>

          {/* View Mode Toggle for Mobile & Desktop */}
          <div className="admin-view-switcher">
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === "auto" ? "active" : ""}`}
              onClick={() => setViewMode("auto")}
              title="Responsive View (Table on Desktop, Cards on Mobile)"
            >
              🔄 Auto
            </button>
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === "table" ? "active" : ""}`}
              onClick={() => setViewMode("table")}
              title="Table View"
            >
              📋 Table
            </button>
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === "cards" ? "active" : ""}`}
              onClick={() => setViewMode("cards")}
              title="Card View"
            >
              🗂️ Cards
            </button>
          </div>
        </div>

        {/* 1. Real-time Search, Category Filter & Sorting Toolbar */}
        <div className="admin-toolbar">
          {/* Search Bar */}
          <div className="admin-search-wrap">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by title, photographer, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-search-input"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="admin-search-clear"
                title="Clear search"
              >
                ×
              </button>
            )}
          </div>

          {/* Category Filter Dropdown */}
          <div className="admin-filter-group">
            <label className="toolbar-label" htmlFor="admin-cat-filter">Category:</label>
            <select
              id="admin-cat-filter"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="admin-select"
            >
              <option value="All">All Categories ({photos.length})</option>
              {categories
                .filter((c) => c !== "All")
                .map((cat) => {
                  const count = photos.filter((p) => p.category === cat).length;
                  return (
                    <option key={cat} value={cat}>
                      {cat} ({count})
                    </option>
                  );
                })}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="admin-filter-group">
            <label className="toolbar-label" htmlFor="admin-sort-select">Sort by:</label>
            <select
              id="admin-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="admin-select"
            >
              <option value="newest">🕒 Newest Added</option>
              <option value="oldest">⏳ Oldest First</option>
              <option value="likes-desc">👍 Most Liked</option>
              <option value="likes-asc">👎 Least Liked</option>
              <option value="title-asc">🔤 Title (A → Z)</option>
              <option value="title-desc">🔤 Title (Z → A)</option>
            </select>
          </div>

          {/* Reset Filters Pill */}
          {hasActiveFilters && (
            <button type="button" onClick={resetFilters} className="admin-reset-btn" title="Reset all filters">
              ✕ Reset Filters
            </button>
          )}
        </div>

        {/* Empty State when filters yield 0 results */}
        {filteredPhotos.length === 0 ? (
          <div className="admin-empty-state">
            <span className="empty-icon">🔍</span>
            <h3>No photos match your filter</h3>
            <p>Try searching for a different keyword or resetting your category filter.</p>
            <button type="button" onClick={resetFilters} className="pill pill-active" style={{ marginTop: "12px" }}>
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            {/* Desktop / Responsive Table View */}
            <div className={`table-wrap ${viewMode === "cards" ? "hidden-view" : ""} ${viewMode === "auto" ? "desktop-only-table" : ""}`}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Thumbnail</th>
                    <th onClick={() => handleSortHeader("title")} className="sortable-th" title="Click to sort by title">
                      Title {sortBy === "title-asc" ? "▲" : sortBy === "title-desc" ? "▼" : "⇅"}
                    </th>
                    <th>Category</th>
                    <th>Photographer</th>
                    <th>Location</th>
                    <th onClick={() => handleSortHeader("likes")} className="sortable-th" title="Click to sort by likes">
                      Likes {sortBy === "likes-desc" ? "▼" : sortBy === "likes-asc" ? "▲" : "⇅"}
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPhotos.map((photo) => (
                    <tr key={photo.id}>
                      <td>
                        <Link to={`/photo/${photo.id}`} target="_blank" rel="noopener noreferrer" title="View photo details">
                          <img src={photo.src} alt={photo.title} className="table-thumb" />
                        </Link>
                      </td>
                      <td>
                        <strong className="table-title">{photo.title}</strong>
                        <div className="table-subid">Photo ID: #{photo.id}</div>
                      </td>
                      <td>
                        <span
                          className="table-badge"
                          style={{
                            background:
                              photo.category === "Nature"
                                ? "rgba(16,185,129,0.12)"
                                : photo.category === "Architecture"
                                ? "rgba(59,130,246,0.12)"
                                : photo.category === "Animals"
                                ? "rgba(245,158,11,0.12)"
                                : photo.category === "People"
                                ? "rgba(236,72,153,0.12)"
                                : "rgba(139,92,246,0.12)",
                            borderColor:
                              photo.category === "Nature"
                                ? "rgba(16,185,129,0.3)"
                                : photo.category === "Architecture"
                                ? "rgba(59,130,246,0.3)"
                                : photo.category === "Animals"
                                ? "rgba(245,158,11,0.3)"
                                : photo.category === "People"
                                ? "rgba(236,72,153,0.3)"
                                : "rgba(139,92,246,0.3)",
                            color: "var(--text)",
                          }}
                        >
                          {photo.category}
                        </span>
                      </td>
                      <td>{photo.photographer}</td>
                      <td>{photo.location}</td>
                      <td>
                        <span className="table-likes">
                          👍 {(photo.likes || 0).toLocaleString()}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          {/* 3. Quick "View in Gallery" Action */}
                          <Link
                            to={`/photo/${photo.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="table-btn view-btn"
                            title="View photo on live page"
                          >
                            👁️ View
                          </Link>

                          {/* Edit Action */}
                          <button
                            className="table-btn edit-btn"
                            onClick={() => startEdit(photo)}
                            title="Edit Photo"
                          >
                            ✏️ Edit
                          </button>

                          {/* Delete Action */}
                          <button
                            className="table-btn delete-btn"
                            onClick={() => handleDelete(photo.id, photo.title)}
                            title="Delete Photo"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 4. Responsive Mobile / Card View */}
            <div className={`admin-cards-grid ${viewMode === "table" ? "hidden-view" : ""} ${viewMode === "auto" ? "mobile-only-cards" : ""}`}>
              {filteredPhotos.map((photo) => (
                <div key={photo.id} className="admin-card-item">
                  <div className="admin-card-top">
                    <Link to={`/photo/${photo.id}`} target="_blank" rel="noopener noreferrer">
                      <img src={photo.src} alt={photo.title} className="admin-card-img" />
                    </Link>
                    <span className="admin-card-badge">{photo.category}</span>
                  </div>

                  <div className="admin-card-content">
                    <div className="admin-card-title-row">
                      <h4 className="admin-card-title">{photo.title}</h4>
                      <span className="admin-card-likes">👍 {(photo.likes || 0).toLocaleString()}</span>
                    </div>

                    <p className="admin-card-sub">
                      <span>👤 {photo.photographer}</span> · <span>📍 {photo.location}</span>
                    </p>

                    <div className="admin-card-meta-id">Photo ID: #{photo.id}</div>

                    <div className="admin-card-footer">
                      <Link
                        to={`/photo/${photo.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="table-btn view-btn"
                        title="View photo on live page"
                      >
                        👁️ View
                      </Link>
                      <button
                        className="table-btn edit-btn"
                        onClick={() => startEdit(photo)}
                        title="Edit Photo"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="table-btn delete-btn"
                        onClick={() => handleDelete(photo.id, photo.title)}
                        title="Delete Photo"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* 2. Modal for Add / Edit Photo with Live Image Preview */}
      {isAddModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingPhoto ? "Edit Photo Details" : "Add New Photo"}</h2>
              <button className="modal-close-btn" onClick={() => setIsAddModalOpen(false)}>
                ×
              </button>
            </div>

            {formError && <div className="alert alert-error">⚠️ {formError}</div>}

            <form onSubmit={handleSavePhoto} className="admin-form">
              <div className="form-group">
                <label>Photo Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Autumn Forest Sunlight"
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
                    placeholder="e.g. John Doe"
                    value={formData.photographer}
                    onChange={(e) => setFormData({ ...formData, photographer: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              {/* Image URL input with Live Preview */}
              <div className="form-group">
                <label>Image URL *</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.src}
                  onChange={(e) => {
                    setFormData({ ...formData, src: e.target.value });
                    setImageLoadError(false);
                  }}
                  className="form-input"
                  required
                />
              </div>

              {/* Live Image Preview Container */}
              <div className="admin-preview-wrap">
                <div className="admin-preview-header">
                  <span className="admin-preview-label">Live Preview:</span>
                  {formData.src && !imageLoadError && (
                    <span className="admin-preview-status valid">✓ Valid Image URL</span>
                  )}
                  {formData.src && imageLoadError && (
                    <span className="admin-preview-status invalid">⚠️ Invalid / Unreachable URL</span>
                  )}
                </div>

                {formData.src ? (
                  <div className="admin-preview-box">
                    <img
                      src={formData.src}
                      alt="Live Preview"
                      className="admin-preview-image"
                      onLoad={() => setImageLoadError(false)}
                      onError={() => setImageLoadError(true)}
                    />
                    {imageLoadError && (
                      <div className="admin-preview-error">
                        <span>Failed to load image. Check the URL link and ensure it ends with an image format or Unsplash URL.</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="admin-preview-empty">
                    <span>🖼️ Enter or paste an image URL above to preview it live before publishing.</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Location *</label>
                <input
                  type="text"
                  placeholder="e.g. Yosemite National Park, USA"
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
                  placeholder="Brief story or technical details about the photo..."
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
                  {editingPhoto ? "Save Changes" : "Publish Photo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Our Users Modal */}
      {isUsersModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsUsersModalOpen(false)}>
          <div
            className="modal-content admin-users-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "24px" }}>👥</span>
                <div>
                  <h2 style={{ margin: 0, fontSize: "1.25rem" }}>Our Users</h2>
                  <p style={{ margin: "2px 0 0 0", fontSize: "0.82rem", color: "var(--muted)" }}>
                    Registered users who logged in and use Momento ({registeredUsers.length})
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsUsersModalOpen(false)}
                aria-label="Close user list modal"
              >
                ×
              </button>
            </div>

            <div className="admin-users-modal-body">
              {/* Search user emails */}
              <div className="admin-search-wrapper" style={{ margin: "16px 0 14px 0" }}>
                <span className="admin-search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Filter users by email..."
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  className="admin-search-input"
                />
                {userSearchTerm && (
                  <button
                    className="admin-clear-search"
                    onClick={() => setUserSearchTerm("")}
                    type="button"
                    aria-label="Clear user search"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Users list / table */}
              <div className="admin-users-table-wrap">
                <table className="admin-users-table">
                  <thead>
                    <tr>
                      <th>User Account</th>
                      <th>Role</th>
                      <th>Last Active</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="4" style={{ textAlign: "center", padding: "24px", color: "var(--muted)" }}>
                          No users found matching "{userSearchTerm}".
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u, idx) => {
                        const email = typeof u === "string" ? u : u.email;
                        const role = typeof u === "string" ? "User" : u.role || "User";
                        const lastLogin = typeof u === "string" ? "Active" : u.lastLogin || "Active session";
                        const status = typeof u === "string" ? "Active" : u.status || "Active";

                        return (
                          <tr key={idx}>
                            <td>
                              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <span className="admin-user-avatar">👤</span>
                                <div>
                                  <strong style={{ color: "var(--foreground)", fontSize: "0.92rem", display: "block" }}>
                                    {email}
                                  </strong>
                                  <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                                    ID: user_{idx + 101}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="user-role-badge">{role}</span>
                            </td>
                            <td style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
                              {lastLogin}
                            </td>
                            <td>
                              <span className="user-status-active">● {status}</span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div
              className="modal-footer"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "16px",
                paddingTop: "12px",
                borderTop: "1px solid var(--border)",
              }}
            >
              <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
                ⚡ Ready for backend API & database sync in next phase
              </span>
              <button
                type="button"
                className="pill pill-active"
                onClick={() => setIsUsersModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Our Photographers Modal */}
      {isPhotographersModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsPhotographersModalOpen(false)}>
          <div
            className="modal-content admin-photographers-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "24px" }}>📸</span>
                <div>
                  <h2 style={{ margin: 0, fontSize: "1.25rem" }}>Our Photographers</h2>
                  <p style={{ margin: "2px 0 0 0", fontSize: "0.82rem", color: "var(--muted)" }}>
                    {photographersList.length} photographers contributed to the Momento gallery
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsPhotographersModalOpen(false)}
                aria-label="Close photographers modal"
              >
                ×
              </button>
            </div>

            <div className="admin-photographers-modal-body">
              {/* Search photographers */}
              <div className="admin-search-wrapper" style={{ margin: "16px 0 14px 0" }}>
                <span className="admin-search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Filter by photographer, location, or category..."
                  value={photographerSearchTerm}
                  onChange={(e) => setPhotographerSearchTerm(e.target.value)}
                  className="admin-search-input"
                />
                {photographerSearchTerm && (
                  <button
                    className="admin-clear-search"
                    onClick={() => setPhotographerSearchTerm("")}
                    type="button"
                    aria-label="Clear photographer search"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Photographers list */}
              <div className="photographers-list-container">
                {filteredPhotographers.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "32px", color: "var(--muted)" }}>
                    No photographers found matching "{photographerSearchTerm}".
                  </div>
                ) : (
                  filteredPhotographers.map((p) => (
                    <div key={p.name} className="photographer-card">
                      <div className="photographer-header">
                        <div className="photographer-info">
                          <span className="photographer-avatar">📷</span>
                          <div>
                            <h3 className="photographer-name">{p.name}</h3>
                            <div className="photographer-meta">
                              {p.locations.size > 0 && (
                                <span>📍 {Array.from(p.locations).slice(0, 2).join(", ")}</span>
                              )}
                              <span>•</span>
                              <span>📷 {p.photos.length} {p.photos.length === 1 ? "photo" : "photos"}</span>
                              <span>•</span>
                              <span>👍 {p.totalLikes.toLocaleString()} likes</span>
                            </div>
                          </div>
                        </div>

                        <div className="photographer-tags">
                          {Array.from(p.categories).map((cat) => (
                            <span key={cat} className="photographer-cat-pill">
                              {cat}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Pictures strip */}
                      <div className="photographer-pictures-strip">
                        {p.photos.map((photo) => (
                          <Link
                            key={photo.id}
                            to={`/photo/${photo.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="photographer-thumb-wrap"
                            title={`${photo.title} (Click to view full photo)`}
                          >
                            <img
                              src={photo.src}
                              alt={photo.title}
                              className="photographer-thumb-img"
                              loading="lazy"
                            />
                            <div className="photographer-thumb-overlay">
                              <span className="thumb-title">{photo.title}</span>
                              <span className="thumb-likes">❤️ {photo.likes || 0}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div
              className="modal-footer"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "16px",
                paddingTop: "12px",
                borderTop: "1px solid var(--border)",
              }}
            >
              <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
                Total {photos.length} photos published across {photographersList.length} photographers
              </span>
              <button
                type="button"
                className="pill pill-active"
                onClick={() => setIsPhotographersModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default AdminPage;
