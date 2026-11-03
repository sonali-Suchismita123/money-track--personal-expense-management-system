import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getInitials, formatDate } from '../../utils/formatters';
import './Topbar.css';

/**
 * Topbar – fixed top navigation bar.
 * Shows page title, current datetime, and user avatar.
 */
export default function Topbar({ pageTitle, onMenuToggle }) {
  const { currentUser } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showUserMenu, setShowUserMenu] = useState(false);

  /** Update clock every second */
  useEffect(() => {
    const id = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const initials = getInitials(currentUser?.full_name || currentUser?.username || 'U');

  const formattedDate = currentTime.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const formattedTime = currentTime.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <header className="topbar">
      {/* Left: Menu toggle + Page title */}
      <div className="topbar__left">
        <button
          className="topbar__menu-btn"
          onClick={onMenuToggle}
          aria-label="Toggle sidebar"
        >
          <span />
          <span />
          <span />
        </button>
        <div className="topbar__title-wrap">
          <h1 className="topbar__title">{pageTitle}</h1>
          <p className="topbar__date">{formattedDate}</p>
        </div>
      </div>

      {/* Right: Time, notifications, user */}
      <div className="topbar__right">
        {/* Live Clock */}
        <div className="topbar__clock">
          <span className="topbar__clock-icon">🕐</span>
          <span className="topbar__clock-time">{formattedTime}</span>
        </div>

        {/* Notification Bell (decorative) */}
        <button className="topbar__icon-btn" aria-label="Notifications">
          <span className="topbar__bell">🔔</span>
          <span className="topbar__badge">3</span>
        </button>

        {/* User Avatar */}
        <div className="topbar__user" onClick={() => setShowUserMenu(p => !p)}>
          <div className="topbar__avatar" title={currentUser?.full_name || currentUser?.username}>
            {initials}
          </div>
          <div className="topbar__user-info">
            <span className="topbar__user-name">
              {currentUser?.full_name || currentUser?.username || 'User'}
            </span>
            <span className="topbar__user-role">Personal Account</span>
          </div>
          <span className="topbar__caret">▾</span>

          {/* Mini dropdown */}
          {showUserMenu && (
            <div className="topbar__dropdown" onClick={e => e.stopPropagation()}>
              <div className="topbar__dropdown-header">
                <strong>{currentUser?.full_name || currentUser?.username}</strong>
                <small>{currentUser?.email}</small>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
