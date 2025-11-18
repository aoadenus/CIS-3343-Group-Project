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
    </div>
  );
}
