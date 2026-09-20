import { GiDiceFire } from "react-icons/gi";
import { FaDiceSix } from "react-icons/fa";
export default function Menu({ onPick }) {
  return (
    <section className="scr">
  
      

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
<h1>Ludo</h1>
      <p>Choose Games</p>

<button className="card" onClick={() => onPick("setup")}>
        <i><GiDiceFire /></i>
        <span><b>Ludo</b><small>Classic Board Game</small></span>
      </button>
      <button className="card" onClick={() => onPick("tap")}>
        <i><FaDiceSix /></i>
        <span><b>Tap Ludo</b><small>One Tap Ludo</small></span>
      </button>

</div>
    </section>
  );
}
