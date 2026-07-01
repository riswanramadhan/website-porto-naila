"use client";

import { useEffect, useRef, useState } from "react";

export default function SplashScreen() {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState("loading");
  const splashRef = useRef(null);

  useEffect(() => {
    let progressTimer;
    let exitTimer;
    let failSafeTimer;
    let finished = false;
    const appShell = globalThis.document?.getElementById("app-shell");

    const lockPage = (locked) => {
      globalThis.document?.documentElement.classList.toggle("splash-active", locked);
      if (appShell) appShell.inert = locked;
    };

    const finish = () => {
      if (finished) return;
      finished = true;
      if (progressTimer) globalThis.clearInterval(progressTimer);
      setProgress(100);
      setPhase("exiting");
      exitTimer = globalThis.setTimeout(() => {
        lockPage(false);
        setPhase("hidden");
      }, 280);
    };

    lockPage(true);
    splashRef.current?.focus();
    progressTimer = globalThis.setInterval(() => {
      setProgress((current) => Math.min(88, current + Math.max(2, Math.round((88 - current) / 5))));
    }, 90);

    if (globalThis.document?.readyState !== "loading") {
      globalThis.requestAnimationFrame(finish);
    } else {
      globalThis.addEventListener("load", finish, { once: true });
    }
    failSafeTimer = globalThis.setTimeout(finish, 4000);

    return () => {
      globalThis.removeEventListener("load", finish);
      if (progressTimer) globalThis.clearInterval(progressTimer);
      if (exitTimer) globalThis.clearTimeout(exitTimer);
      if (failSafeTimer) globalThis.clearTimeout(failSafeTimer);
      lockPage(false);
    };
  }, []);

  if (phase === "hidden") return null;

  return (
    <div
      ref={splashRef}
      className={`splash-screen ${phase === "exiting" ? "is-exiting" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Memuat halaman"
      tabIndex={-1}
    >
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
