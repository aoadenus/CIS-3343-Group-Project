import { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
  pageTitle: string;
  userName?: string;
  userRole?: string;
}

export function DashboardLayout({
  children,
  pageTitle,
  userName = 'User',
  userRole = 'Staff'
}: DashboardLayoutProps) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="dashboard-v2-wrapper">
      {/* Header */}
      <header className="dashboard-v2-header">
        <div className="dashboard-v2-header-content">
          {/* Logo */}
          <div className="dashboard-v2-logo">
            <div className="dashboard-v2-logo-circle">
              <span className="dashboard-v2-logo-text">EB</span>
            </div>
            <span className="dashboard-v2-logo-name">Emily Bakes</span>
          </div>

          {/* Page Title */}
          <h1 className="dashboard-v2-page-title">{pageTitle}</h1>

          {/* User Badge */}
          <div className="dashboard-v2-user-badge">
            <div className="dashboard-v2-user-avatar">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="dashboard-v2-user-info">
              <div className="dashboard-v2-user-name">{userName}</div>
              <div className="dashboard-v2-user-role">{userRole}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="dashboard-v2-main">
        <div className="dashboard-v2-content">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="dashboard-v2-footer">
        <div className="dashboard-v2-footer-content">
          <div className="dashboard-v2-footer-left">
            <span className="dashboard-v2-footer-label">Last Updated:</span>
            <span className="dashboard-v2-footer-value">{currentDate}</span>
          </div>
          
          <div className="dashboard-v2-footer-center">
            <a href="/help" className="dashboard-v2-footer-link">
              Help Center
            </a>
            <span className="dashboard-v2-footer-separator">•</span>
            <a href="/support" className="dashboard-v2-footer-link">
              Support
            </a>
          </div>
          
          <div className="dashboard-v2-footer-right">
            <span className="dashboard-v2-footer-version">v2.0.0</span>
          </div>
        </div>
      </footer>

      <style jsx>{`
        /* ========================================
           LAYOUT WRAPPER
           ======================================== */
        
        .dashboard-v2-wrapper {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background: var(--db-color-cream);
        }

        /* ========================================
           HEADER
           ======================================== */
        
        .dashboard-v2-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: var(--db-header-height);
          background: var(--db-color-white);
          border-bottom: var(--db-border-width) solid var(--db-border-light);
          box-shadow: var(--db-shadow-sm);
          z-index: var(--db-z-sticky);
        }

        .dashboard-v2-header-content {
          max-width: var(--db-content-max-width);
          height: 100%;
          margin: 0 auto;
          padding: 0 var(--db-content-padding);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--db-space-6);
        }

        /* Logo */
        .dashboard-v2-logo {
          display: flex;
          align-items: center;
          gap: var(--db-space-3);
          flex-shrink: 0;
        }

        .dashboard-v2-logo-circle {
          width: 48px;
          height: 48px;
          border-radius: var(--db-radius-full);
          background: linear-gradient(135deg, var(--db-color-raspberry) 0%, var(--db-color-raspberry-hover) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--db-shadow-raspberry);
        }

        .dashboard-v2-logo-text {
          font-family: var(--db-font-display);
          font-size: 20px;
          font-weight: var(--db-weight-bold);
          color: var(--db-color-white);
        }

        .dashboard-v2-logo-name {
          font-family: var(--db-font-display);
          font-size: var(--db-text-h5);
          font-weight: var(--db-weight-bold);
          color: var(--db-color-charcoal);
          display: none;
        }

        /* Page Title */
        .dashboard-v2-page-title {
          font-family: var(--db-font-display);
          font-size: var(--db-text-h2);
          font-weight: var(--db-text-h2-weight);
          letter-spacing: var(--db-text-h2-spacing);
          color: var(--db-color-charcoal);
          margin: 0;
          flex: 1;
          text-align: center;
        }

        /* User Badge */
        .dashboard-v2-user-badge {
          display: flex;
          align-items: center;
          gap: var(--db-space-3);
          padding: var(--db-space-2) var(--db-space-4);
          background: var(--db-color-gray-50);
          border-radius: var(--db-radius-full);
          border: var(--db-border-width) solid var(--db-border-light);
          flex-shrink: 0;
          cursor: pointer;
          transition: all var(--db-transition-base);
        }

        .dashboard-v2-user-badge:hover {
          background: var(--db-color-gray-100);
          border-color: var(--db-border-raspberry);
          box-shadow: var(--db-shadow-sm);
        }

        .dashboard-v2-user-avatar {
          width: 40px;
          height: 40px;
          border-radius: var(--db-radius-full);
          background: linear-gradient(135deg, var(--db-color-raspberry) 0%, var(--db-color-raspberry-hover) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--db-font-sans);
          font-size: var(--db-text-base);
          font-weight: var(--db-weight-semibold);
          color: var(--db-color-white);
        }

        .dashboard-v2-user-info {
          display: none;
        }

        .dashboard-v2-user-name {
          font-family: var(--db-font-sans);
          font-size: var(--db-text-sm);
          font-weight: var(--db-weight-semibold);
          color: var(--db-color-charcoal);
          line-height: 1.2;
        }

        .dashboard-v2-user-role {
          font-family: var(--db-font-sans);
          font-size: var(--db-text-xs);
          font-weight: var(--db-weight-regular);
          color: var(--db-color-gray-500);
          line-height: 1.2;
        }

        /* ========================================
           MAIN CONTENT
           ======================================== */
        
        .dashboard-v2-main {
          flex: 1;
          margin-top: var(--db-header-height);
          margin-bottom: var(--db-footer-height);
          overflow-y: auto;
        }

        .dashboard-v2-content {
          max-width: var(--db-content-max-width);
          margin: 0 auto;
          padding: var(--db-content-padding);
          min-height: calc(100vh - var(--db-header-height) - var(--db-footer-height));
        }

        /* ========================================
           FOOTER
           ======================================== */
        
        .dashboard-v2-footer {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: var(--db-footer-height);
          background: var(--db-color-white);
          border-top: var(--db-border-width) solid var(--db-border-light);
          box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.05);
          z-index: var(--db-z-sticky);
        }

        .dashboard-v2-footer-content {
          max-width: var(--db-content-max-width);
          height: 100%;
          margin: 0 auto;
          padding: 0 var(--db-content-padding);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--db-space-4);
        }

        .dashboard-v2-footer-left,
        .dashboard-v2-footer-center,
        .dashboard-v2-footer-right {
          display: flex;
          align-items: center;
          gap: var(--db-space-2);
        }

        .dashboard-v2-footer-label {
          font-family: var(--db-font-sans);
          font-size: var(--db-text-xs);
          font-weight: var(--db-weight-medium);
          color: var(--db-color-gray-500);
        }

        .dashboard-v2-footer-value {
          font-family: var(--db-font-sans);
          font-size: var(--db-text-xs);
          font-weight: var(--db-weight-regular);
          color: var(--db-color-charcoal);
        }

        .dashboard-v2-footer-link {
          font-family: var(--db-font-sans);
          font-size: var(--db-text-xs);
          font-weight: var(--db-weight-medium);
          color: var(--db-color-raspberry);
          text-decoration: none;
          transition: color var(--db-transition-base);
        }

        .dashboard-v2-footer-link:hover {
          color: var(--db-color-raspberry-hover);
          text-decoration: underline;
        }

        .dashboard-v2-footer-separator {
          color: var(--db-color-gray-300);
          font-size: var(--db-text-xs);
        }

        .dashboard-v2-footer-version {
          font-family: var(--db-font-sans);
          font-size: var(--db-text-tiny);
          font-weight: var(--db-weight-medium);
          color: var(--db-color-gray-400);
          padding: var(--db-space-1) var(--db-space-3);
          background: var(--db-color-gray-50);
          border-radius: var(--db-radius-full);
        }

        /* ========================================
           RESPONSIVE DESIGN
           ======================================== */
        
        /* Tablet and up (640px+) */
        @media (min-width: 640px) {
          .dashboard-v2-logo-name {
            display: block;
          }

          .dashboard-v2-user-info {
            display: block;
          }
        }

        /* Mobile adjustments */
        @media (max-width: 639px) {
          .dashboard-v2-header-content,
          .dashboard-v2-footer-content {
            padding: 0 var(--db-content-padding-mobile);
          }

          .dashboard-v2-content {
            padding: var(--db-content-padding-mobile);
          }

          .dashboard-v2-page-title {
            font-size: var(--db-text-h4);
          }

          .dashboard-v2-footer-center {
            display: none;
          }
        }

        /* Grid System Utilities */
        .dashboard-v2-grid {
          display: grid;
          gap: var(--db-space-6);
        }

        .dashboard-v2-grid-2 {
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        }

        .dashboard-v2-grid-3 {
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        }

        .dashboard-v2-grid-4 {
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        }

        @media (max-width: 639px) {
          .dashboard-v2-grid-2,
          .dashboard-v2-grid-3,
          .dashboard-v2-grid-4 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
