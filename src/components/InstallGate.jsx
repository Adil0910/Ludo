import React, { useEffect, useState } from "react";

function InstallGate({ onDone }) {
  // index.html ka inline script event ko yahan pahunchne se pehle hi
  // pakad chuka ho sakta hai -> pehle wahi check karo.
  const [prompt, setPrompt] = useState(() => window.__bipEvent || null);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const take = () => {
      if (window.__bipEvent) setPrompt(window.__bipEvent);
    };
    take(); // agar is beech mein aa gaya ho

    const onReady = () => take(); // index.html se event
    const onPrompt = (e) => {
      e.preventDefault();
      window.__bipEvent = e;
      setPrompt(e);
    };
    const onInstalled = () => onDone();

    window.addEventListener("bip-ready", onReady);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("bip-ready", onReady);
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, [onDone]);

  const install = async () => {
    if (!prompt) {
      setShowHint(true);
      return;
    }

    prompt.prompt();

    const { outcome } = await prompt.userChoice;

    window.__bipEvent = null;
    setPrompt(null);

    if (outcome === "accepted") {
      onDone();
    }
  };

  return (
    <div className="download-component">

      <video
        className="download-video"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/img/video1.mp4" type="video/mp4" />
      </video>

      <div className="download-overlay"></div>

      <div className="dwnld-box">
        <h1>Install Ludo</h1>

        <p>
          Install Ludo on your device and play it like an app.
        </p>

        <button
          onClick={install}
          className="Dwnload-btn"
        >
          Install Now
        </button>

        {showHint && (
          <p>
            iPhone: Share → Add to Home Screen
            <br />
            Android: ⋮ → Install app
          </p>
        )}

        <button
          className="link"
          onClick={onDone}
        >
          Continue in Browser
        </button>
      </div>
    </div>
  );
}

export default InstallGate;