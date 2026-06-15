"use client";

import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState("loading");

  useEffect(() => {
    let animationFrame;
    let exitTimer;
    const startedAt = globalThis.performance.now();
    const minimumDuration = 1700;

    const tick = (now) => {
      const elapsed = now - startedAt;
      const documentReady = globalThis.document?.readyState === "complete";
      const timedProgress = Math.min(96, Math.round((elapsed / minimumDuration) * 96));

      setProgress((current) => Math.max(current, documentReady ? Math.min(100, timedProgress + 8) : timedProgress));

      if (documentReady && elapsed >= minimumDuration) {
        setProgress(100);
        setPhase("exiting");
        exitTimer = globalThis.setTimeout(() => setPhase("hidden"), 1050);
        return;
      }

      animationFrame = globalThis.requestAnimationFrame(tick);
    };

    animationFrame = globalThis.requestAnimationFrame(tick);

    return () => {
      if (animationFrame) globalThis.cancelAnimationFrame(animationFrame);
      if (exitTimer) globalThis.clearTimeout(exitTimer);
    };
  }, []);

  if (phase === "hidden") return null;

  return (
    <div className={`splash-screen ${phase === "exiting" ? "is-exiting" : ""}`} aria-live="polite">
      <div className="splash-inner">
        <span className="splash-label">Naila Azahra</span>
        <div className="splash-progress" aria-label={`Loading ${progress}%`}>
          <span style={{ width: `${progress}%` }}></span>
        </div>
        <strong>{progress}%</strong>
      </div>
    </div>
  );
}
