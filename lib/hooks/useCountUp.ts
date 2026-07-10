"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Anima la transición entre valores numéricos (efecto "count-up") cada vez
 * que `target` cambia, sin depender de librerías externas de animación.
 */
export function useCountUp(target: number, durationMs = 600): number {
  const [display, setDisplay] = useState(target);
  const latestValueRef = useRef(target);

  useEffect(() => {
    const startValue = latestValueRef.current;
    const startTime = performance.now();
    let frameId: number;

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const value = startValue + (target - startValue) * eased;
      latestValueRef.current = value;
      setDisplay(value);
      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    }

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [target, durationMs]);

  return display;
}
