import { useState, useEffect } from 'react';

export const useIdle = (ms = 4000) => {
  const [idle, setIdle] = useState(false);
  useEffect(() => {
    let timeoutId;
    const handleActivity = () => {
      setIdle(false);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setIdle(true), ms);
    };
    ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'].forEach(evt => 
      window.addEventListener(evt, handleActivity)
    );
    timeoutId = setTimeout(() => setIdle(true), ms);
    return () => {
      ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'].forEach(evt => 
        window.removeEventListener(evt, handleActivity)
      );
      clearTimeout(timeoutId);
    };
  }, [ms]);
  return idle;
};