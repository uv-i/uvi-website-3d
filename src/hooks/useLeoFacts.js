import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useIdle } from './useIdle';
import { CHATBOT_PERSONA } from '../data/mockData';

const CYCLE_MS = 90_000; // 90 s per fact before auto-advancing

// Fisher-Yates shuffle over fact indices
const shuffleIndices = () => {
  const arr = CHATBOT_PERSONA.facts.map((_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

/**
 * Manages the Leo engagement-bubble lifecycle:
 * - Shows bubble after idle period (hidden on /games and /lab)
 * - Cycles through all facts in random order before repeating
 * - Exposes controls for ChatBot to open/close the bubble
 *
 * @param {boolean} isOpen  - whether the full chat window is open
 * @returns {{ showWelcome, setShowWelcome, factIndex, activeFact, cycleRef }}
 */
const useLeoFacts = (isOpen) => {
  const location  = useLocation();
  const isIdle    = useIdle(4000);
  const queueRef  = useRef([]);
  const cycleRef  = useRef(null);

  const [showWelcome, setShowWelcome] = useState(false);
  const [factIndex,   setFactIndex]   = useState(0);

  const advanceFact = () => {
    if (queueRef.current.length === 0) queueRef.current = shuffleIndices();
    setFactIndex(queueRef.current.shift());
  };

  // Show bubble on idle (skip pages where it's distracting)
  useEffect(() => {
    const hidden = ['/games', '/lab'].includes(location.pathname);
    if (!isIdle || isOpen || showWelcome || hidden) return;
    advanceFact();
    setShowWelcome(true);
  }, [isIdle, location.pathname, isOpen, showWelcome]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cycle facts while bubble is visible
  useEffect(() => {
    if (!showWelcome) { clearInterval(cycleRef.current); return; }
    cycleRef.current = setInterval(advanceFact, CYCLE_MS);
    return () => clearInterval(cycleRef.current);
  }, [showWelcome]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    showWelcome,
    setShowWelcome,
    factIndex,
    activeFact: CHATBOT_PERSONA.facts[factIndex],
    cycleRef,
    CYCLE_MS,
  };
};

export default useLeoFacts;
