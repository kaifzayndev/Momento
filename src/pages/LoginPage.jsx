import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage({
  setIsAdminLoggedIn,
  setIsUserLoggedIn,
  setCurrentUser,
  onResetFilters,
  defaultRole = "user",
}) {
  const navigate = useNavigate();
  const [role, setRole] = useState(defaultRole); // "user" or "admin"
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleRoleChange = (newRole) => {
    if (newRole !== role) {
      setRole(newRole);
      setError("");
      setPassword("");
      setIdentifier("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!identifier.trim() || !password) {
      setError("Please fill in both fields to proceed.");
      return;
    }

    if (password.length < 4) {
      setError("Password must be at least 4 characters long.");
      return;
    }

    if (role === "admin") {
      // Admin authentication
      const isAdminUser =
        identifier.trim().toLowerCase() === "admin@bwu.edu" ||
        identifier.trim().toLowerCase() === "admin";

      if (!isAdminUser || password !== "admin123") {
        setError("Invalid admin credentials. Use admin@bwu.edu / admin123");
        return;
      }

      setIsAdminLoggedIn(true);
      localStorage.setItem("ff-admin-auth", "true");
      localStorage.setItem("ff-admin-email", identifier.trim());
      if (onResetFilters) {
        onResetFilters();
      }
      navigate("/admin");
    } else {
      // User authentication
      setIsUserLoggedIn(true);
      const userEmail = identifier.trim();
      const userDisplay = userEmail.includes("@")
        ? userEmail.split("@")[0]
        : userEmail;
      setCurrentUser(userDisplay);
      localStorage.setItem("ff-user-auth", "true");
      localStorage.setItem("ff-user-email", userEmail);

      // Track registered user for admin visibility & future database synchronization
      try {
        const storedUsers = JSON.parse(localStorage.getItem("ff-registered-users") || "[]");
        const existingIdx = storedUsers.findIndex(
          (u) => (typeof u === "string" ? u : u.email).toLowerCase() === userEmail.toLowerCase()
        );
        const userEntry = {
          email: userEmail,
          role: "User",
          lastLogin: "Just now",
          status: "Active",
        };
        let updatedUsers;
        if (existingIdx >= 0) {
          updatedUsers = [...storedUsers];
          updatedUsers[existingIdx] = { ...updatedUsers[existingIdx], ...userEntry };
        } else {
          updatedUsers = [userEntry, ...storedUsers];
        }
        localStorage.setItem("ff-registered-users", JSON.stringify(updatedUsers));
      } catch (e) {
        console.error("Error saving registered user:", e);
      }

      if (onResetFilters) {
        onResetFilters();
      }
      navigate("/gallery");
    }
  };

  return (
    <main className="main admin-login-container">
      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <div className="admin-badge-icon">
            {role === "admin" ? "🛡️" : "📸"}
          </div>
          <h2>Momento Login</h2>
          <p className="login-subtitle">Please select your account type to proceed</p>
        </div>

        {/* Account Type Selector Tabs */}
        <div className="login-type-switch" role="tablist" aria-label="Account Type">
          <button
            type="button"
            role="tab"
            aria-selected={role === "user"}
            className={`login-type-btn ${role === "user" ? "active" : ""}`}
            onClick={() => handleRoleChange("user")}
          >
            <span className="tab-icon">👤</span>
            <span>User Login</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={role === "admin"}
            className={`login-type-btn ${role === "admin" ? "active" : ""}`}
            onClick={() => handleRoleChange("admin")}
          >
            <span className="tab-icon">🛡️</span>
            <span>Admin Login</span>
          </button>
        </div>

        {/* Role Access Callout Banner */}
        {role === "admin" ? (
          <div className="login-role-banner admin-banner">
            <strong>Admin Access:</strong> Full administrative privileges including uploading new photos, editing details, and deleting entries.
          </div>
        ) : (
          <div className="login-role-banner user-banner">
            <strong>User Access:</strong> Explore curated photography, search & filter categories, view high-res details, and save your favourites.
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="alert alert-error">
            <span>⚠️ {error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="login-identifier">
              {role === "admin" ? "Admin Username / Email" : "Username / Email"}
            </label>
            <div className="input-with-icon">
              <span className="input-icon">{role === "admin" ? "🛡️" : "✉"}</span>
              <input
                id="login-identifier"
                type="text"
                placeholder={role === "admin" ? "admin@bwu.edu or admin" : "user@bwu.edu or username"}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="form-input"
                required
                autoFocus
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="login-password">
              {role === "admin" ? "Admin Password" : "Password"}
            </label>
            <div className="input-with-icon">
              <span className="input-icon">🔑</span>
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide password" : "Show password"}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          <button type="submit" className="pill pill-active submit-login-btn">
            {role === "admin" ? "Enter as Administrator →" : "Enter as User →"}
          </button>
        </form>

        {/* Demo Credentials Box */}
        <div className="demo-credentials">
          <p>💡 <strong>Demo {role === "admin" ? "Admin" : "User"} Credentials:</strong></p>
          {role === "admin" ? (
            <>
              <code>Email: admin@bwu.edu (or admin)</code>
              <code>Password: admin123</code>
            </>
          ) : (
            <>
              <code>Email / Username: user@bwu.edu</code>
              <code>Password: user123</code>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default LoginPage;

