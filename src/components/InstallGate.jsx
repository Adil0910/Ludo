
import React from 'react'
import { useEffect, useState } from "react";

function InstallGate({ onDone }) {

  const [prompt, setPrompt] = useState(null);
  const [showHint, setShowHint] = useState(false);

useEffect(() => {
    const onPrompt = (e) => {
      e.preventDefault();
      setPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onDone);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onDone);
    };
  }, [onDone]);

  const install = async () => {
    if (!prompt) return setShowHint(true);
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    setPrompt(null);
    if (outcome === "accepted") onDone();
  };

  return (
<div className='download-component'>

<video
className='download-video'
autoPlay
loop
muted
playsInline
>
<source src="/img/video1.mp4" type="video/mp4" />
</video>

{/* Overlay */}
<div className='download-overlay'></div>

{/* Content */}
<div className='dwnld-box'>
<h1>Download Ludo Apk</h1>

<p>
Get my resume and explore my skills, projects and experience.
</p>

<button  onClick={install} className='Dwnload-btn'>
Download Now
</button>
 {showHint && (
        <p>iPhone: Share → Add to Home Screen<br />Android: ⋮ menu → Install app</p>
      )}
      <button className="link" onClick={onDone}>Browser mein continue karo</button>
</div>

</div>
  )
}

export default InstallGate;
