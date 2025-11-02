import { ReactNode, useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: ReactNode;
  activePage: string;
  onNavigate: (page: string) => void;
}

export function Layout({ children, activePage, onNavigate }: LayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cream">
      <Header onMenuClick={() => setMobileMenuOpen(true)} />
      <Sidebar 
        activePage={activePage} 
        onNavigate={onNavigate}
        onCollapsedChange={setIsSidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      <main 
        className="p-4 sm:p-6 lg:p-8 pt-4 sm:pt-5 lg:pt-6 transition-all duration-300" 
        style={{ 
          minHeight: 'calc(100vh - 88px)',
          marginTop: '88px',
          marginLeft: window.innerWidth >= 1024 ? (isSidebarCollapsed ? '80px' : '240px') : '0',
        }}
      >
        {children}
      </main>
      <footer 
        className="border-t py-4 px-4 sm:px-6 lg:px-8 text-center text-sm transition-all duration-300"
        style={{
          marginLeft: window.innerWidth >= 1024 ? (isSidebarCollapsed ? '80px' : '240px') : '0',
          borderColor: 'rgba(90, 56, 37, 0.15)',
          color: '#5A3825',
          opacity: 0.8,
          fontFamily: 'Open Sans',
        }}
      >
        © 2025 Emily Bakes Cakes
      </footer>
    </div>
  );
}
