
import { useState } from "react";

import Page1 from "../components/Page1";
import Page2 from "../components/Page2";
import Page3 from "../components/Page3";
import Page4 from "../components/Page4";
import Page5 from "../components/Page5";
import Page6 from "../components/Page6";

function LudoPAges() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isRolling, setIsRolling] = useState(false);

  const ludo = [
    <Page1 />,
    <Page2 />,
    <Page3 />,
    <Page4 />,
    <Page5 />,
    <Page6 />,
  ];

  const tapLudo = () => {
    if (isRolling) return;

    setIsRolling(true);

    // Random final page
    const finalPage = Math.floor(Math.random() * 6) + 1;

    let count = 0;

    const interval = setInterval(() => {
      const randomPage = Math.floor(Math.random() * 6) + 1;

      setCurrentPage(randomPage);

      count++;

      if (count >= 15) {
        clearInterval(interval);

        setCurrentPage(finalPage);
        setIsRolling(false);
      }
    }, 250);
  };

  return (
    <>

    <div
      className="tap-ludo"
      onClick={tapLudo}
    >
      {/* Current Ludo Page */}
      <div className="ludo-page">
        {ludo[currentPage - 1]}
      </div>
    </div>
    </>
  );
}

export default LudoPAges;