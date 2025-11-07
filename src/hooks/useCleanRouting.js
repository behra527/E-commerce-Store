import { useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const useCleanRouting = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Handle navigation with better error handling and production compatibility
  const navigateTo = useCallback((path, options = {}) => {
    try {
      // Add loading state if needed
      if (options.showLoader) {
        console.log('Navigating to:', path);
      }
      
      // Try React Router navigation first
      navigate(path, options);
      
      // Update URL for HashRouter compatibility in production
      setTimeout(() => {
        if (window.location.hash !== `#${path}`) {
          window.location.hash = path;
        }
      }, 100);
      
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback navigation for production mode
      try {
        window.location.hash = path;
      } catch (hashError) {
        console.error('Hash navigation also failed:', hashError);
        // Last resort - reload the page with new hash
        window.location.href = `#${path}`;
      }
    }
  }, [navigate]);

  // Handle direct URL access and hash changes with better production support
  useEffect(() => {
    const handleHashChange = () => {
      try {
        const hash = window.location.hash.slice(1); // Remove # symbol
        const currentPath = location.pathname;
        
        if (hash && hash !== currentPath) {
          // Sync hash with current route
          navigate(hash, { replace: true });
        }
      } catch (error) {
        console.error('Hash change handling error:', error);
        // Fallback: try to sync manually
        const hash = window.location.hash.slice(1);
        if (hash && hash !== location.pathname) {
          try {
            navigate(hash, { replace: true });
          } catch (navError) {
            console.error('Navigation sync failed:', navError);
          }
        }
      }
    };

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    // Initial check with delay for production stability
    setTimeout(handleHashChange, 100);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [location.pathname, navigate]);

  // Handle browser back/forward buttons with production fallbacks
  useEffect(() => {
    const handlePopState = () => {
      try {
        const hash = window.location.hash.slice(1);
        if (hash && hash !== location.pathname) {
          navigate(hash, { replace: true });
        }
      } catch (error) {
        console.error('PopState handling error:', error);
        // Fallback: force hash sync
        const hash = window.location.hash.slice(1);
        if (hash) {
          try {
            navigate(hash, { replace: true });
          } catch (navError) {
            console.error('PopState navigation failed:', navError);
          }
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [location.pathname, navigate]);

  // Additional production mode support
  useEffect(() => {
    // Ensure hash and route are in sync on mount
    const syncHashRoute = () => {
      try {
        const hash = window.location.hash.slice(1);
        if (hash && hash !== location.pathname) {
          navigate(hash, { replace: true });
        }
      } catch (error) {
        console.error('Initial sync error:', error);
      }
    };

    // Delay sync for production stability
    const timeoutId = setTimeout(syncHashRoute, 200);
    return () => clearTimeout(timeoutId);
  }, [location.pathname, navigate]);

  return { 
    navigateTo, 
    currentPath: location.pathname,
    currentHash: window.location.hash.slice(1)
  };
};
