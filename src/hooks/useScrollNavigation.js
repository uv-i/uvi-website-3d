import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const useScrollNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isNavigating = useRef(false);

  useEffect(() => {
    // Define the sequence of your pages
    const routes = ['/', '/games', '/lab', '/contact'];
    const currentIdx = routes.indexOf(location.pathname);

    const handleWheel = (e) => {
      // Prevent double-firing if already navigating
      if (isNavigating.current) return;

      // 1. Detect if we are at the very bottom of the page
      // We use Math.ceil because sometimes zoom levels cause decimal pixel values
      const isAtBottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight;
      
      // 2. Detect if we are at the very top of the page
      const isAtTop = window.scrollY === 0;

      // SCROLL DOWN -> Go to Next Page
      if (e.deltaY > 0 && isAtBottom) {
        if (currentIdx < routes.length - 1) {
          isNavigating.current = true;
          navigate(routes[currentIdx + 1]);
          // Add a small cooldown to prevent jumping 2 pages at once
          setTimeout(() => isNavigating.current = false, 1000);
        }
      } 
      // SCROLL UP -> Go to Previous Page
      else if (e.deltaY < 0 && isAtTop) {
        if (currentIdx > 0) {
          isNavigating.current = true;
          navigate(routes[currentIdx - 1]);
          setTimeout(() => isNavigating.current = false, 1000);
        }
      }
    };

    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, [navigate, location]);
};
