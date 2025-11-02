import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Scroll to Top Component
 * Automatically scrolls to top on route change
 * Ensures all pages load from Y: 0
 */

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top with smooth behavior
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return null;
}
