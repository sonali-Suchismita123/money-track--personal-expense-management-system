import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/formatters';
import { NAV_ITEMS } from '../../utils/constants';
import './Sidebar.css';

/**
 * Sidebar – fixed left navigation panel.
 * Collapses on mobile and when toggle is pressed.
 */
export default function Sidebar({ isOpen, onToggle }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      navigate('/login');
    } catch {
      setLoggingOut(false);
    }
  };

  const initials = getInitials(currentUser?.full_name || currentUser?.username || 'User');

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={onToggle} />}

      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        {/* Logo / Brand */}
        <div className="sidebar__brand">
          <div className="sidebar__logo">
            <span className="sidebar__logo-icon">💰</span>
            <div className="sidebar__logo-text">
              <span className="sidebar__logo-name">MoneyTrack</span>
              <span className="sidebar__logo-tagline">Smart Finance</span>
            </div>
          </div>
          <button className="sidebar__close-btn" onClick={onToggle} aria-label="Close sidebar">
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar__nav" aria-label="Main navigation">
          <ul className="sidebar__nav-list">
            {NAV_ITEMS.map(({ path, label, icon }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  className={({ isActive }) =>
                    `sidebar__nav-link ${isActive ? 'sidebar__nav-link--active' : ''}`
                  }
                  onClick={() => { if (window.innerWidth < 768) onToggle(); }}
                >
                  <span className="sidebar__nav-icon">{icon}</span>
                  <span className="sidebar__nav-label">{label}</span>
                  <span className="sidebar__nav-arrow">›</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom – User info + Logout */}
        <div className="sidebar__footer">
          <div className="sidebar__user">
            <div className="sidebar__user-avatar">{initials}</div>
            <div className="sidebar__user-info">
              <span className="sidebar__user-name">
                {currentUser?.full_name || currentUser?.username || 'User'}
              </span>
              <span className="sidebar__user-email">
                {currentUser?.email || ''}
              </span>
            </div>
          </div>
          <button
            className="sidebar__logout-btn"
            onClick={handleLogout}
            disabled={loggingOut}
            aria-label="Logout"
          >
            {loggingOut ? '...' : '🚪'}
            <span>{loggingOut ? 'Logging out' : 'Logout'}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
