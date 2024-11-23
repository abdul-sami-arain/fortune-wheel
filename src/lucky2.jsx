import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import img1 from "./assets/1.jpg";
import img2 from "./assets/2.jpg";
import img3 from "./assets/3.jpg";
import img4 from "./assets/4.jpg";

const LuckySpinWithImages = () => {
  const [isWin, setWin] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [rotation, setRotation] = useState(0);

  const prizes = ["Prize 1", "Prize 2", "Prize 3", "Prize 4", "Prize 5", "Prize 6"];
  const images = [
 img1,
 img2,
 img3,
 img4,
 img1,
 img2
  ];

  const segments = prizes.length;
  const segmentAngle = 360 / segments;

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    const spinAngle = Math.floor(5000 + Math.random() * 5000); // Spin for 5–10 seconds
    const newRotation = rotation + spinAngle;
    const selectedIndex = Math.floor(
      ((segments - (newRotation % 360) / (360 / segments)) % segments + segments) % segments
    );

    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setWinner(prizes[selectedIndex]);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 10000); // Hide confetti after 10 seconds
    }, 5000);
  };

  return (
    <div className="spinner">
      <h1>Lucky Spin Wheel</h1>
      <div
        style={{
          margin: "auto",
          position: "relative",
          width: "500px",
          height: "500px",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            position: "relative",
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? "transform 5s ease-out" : "none",
          }}
        >
          {/* Segments */}
          {images.map((image, index) => (
            <div
              key={index}
              style={{
                position: "absolute",
                width: "50%",
                height: "50%",
                backgroundImage: `url(${image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                transformOrigin: "100% 100%",
                transform: `rotate(${index * segmentAngle}deg)`,
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              }}
            />
          ))}
        </div>

        {/* Arrow */}
        <div
          style={{
            position: "absolute",
            top: "-10px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "20px",
            height: "40px",
            backgroundColor: "#000",
            clipPath: "polygon(50% 0, 100% 100%, 0 100%)",
            zIndex: 1,
          }}
        ></div>

        {/* Spin Button */}
        <button
          onClick={spinWheel}
          disabled={isSpinning}
          style={{
            position: "absolute",
            top: "calc(50% - 20px)",
            left: "calc(50% - 50px)",
            width: "100px",
            height: "40px",
            borderRadius: "10px",
            backgroundColor: "#000",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Spin
        </button>
      </div>

      {winner && <h2>You won: {winner}</h2>}

      {/* Confetti */}
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          colors={["#F1B3BB", "#F57683", "#CCAAAE", "#DFA0B3", "#FFC7C7", "#D16877"]}
          numberOfPieces={1000}
        />
      )}
    </div>
  );
};

export default LuckySpinWithImages;
