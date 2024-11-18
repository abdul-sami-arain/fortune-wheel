import React, { useState, useRef, useEffect } from "react";
import Confetti from 'react-confetti';

const LuckySpinCustom = () => {
  const [isWin, setWin] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState("");
  const [showConfetti, setShowConfetti] = useState(false); // State to control confetti visibility
  const canvasRef = useRef(null);

  const prizes = ["Prize 1", "Prize 2", "Prize 3", "Prize 4", "Prize 5", "Prize 6"];
  const bgcolors = ["#F1B3BB", "#F57683", "#CCAAAE", "#DFA0B3", "#FFC7C7", "#D16877"];
  const segments = prizes.length;
  const segmentAngle = 360 / segments;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2;

    // Clear canvas and redraw wheel
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw each segment
    for (let i = 0; i < segments; i++) {
      const startAngle = (i * segmentAngle * Math.PI) / 180;
      const endAngle = ((i + 1) * segmentAngle * Math.PI) / 180;

      // Draw segment
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = bgcolors[i];
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.stroke();

      // Add prize text
      ctx.save();
      const textAngle = startAngle + (endAngle - startAngle) / 2;
      const textRadius = radius * 0.8; // Adjust for desired distance from center
      const textX = centerX + textRadius * Math.cos(textAngle);
      const textY = centerY + textRadius * Math.sin(textAngle);

      // Rotate text to match the segment's arc
      ctx.translate(textX, textY);
      ctx.rotate(textAngle + Math.PI / 2);
      ctx.textAlign = "center";
      ctx.fillStyle = "#000";
      ctx.font = "16px Arial";
      ctx.fillText(prizes[i], 0, 0);
      ctx.restore();
    }
  }, [prizes]);

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    const spinAngle = Math.floor(5000 + Math.random() * 5000); // Spin for 5–10 seconds
    const rotation = spinAngle % 360;
    const selectedIndex = Math.floor((segments - rotation / (360 / segments)) % segments);

    const canvas = canvasRef.current;
    canvas.style.transition = "transform 5s ease-out";
    canvas.style.transform = `rotate(${spinAngle}deg)`;

    setTimeout(() => {
      setIsSpinning(false);
      setWinner(prizes[selectedIndex]);
      canvas.style.transition = "none";
      canvas.style.transform = `rotate(${rotation}deg)`;

      // Show confetti for 10 seconds after winning
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
        }}
      >
        {/* Wheel */}
        <div
          style={{
            height: "500px",
            width: "500px",
            position: "relative",
          }}
          className="spinner"
        >
          <canvas
            className="wheel-canvas"
            ref={canvasRef}
            width="500"
            height="500"
            style={{
              transformOrigin: "center",
            }}
          />
           <div
         className="arrow"
        ></div>
          <div className="central_circle">
            <button
              style={{
                top: "calc(50% - 20px)",
                left: "calc(50% - 50px)",
                width: "100px",
                height: "40px",
                borderRadius: "10px",
                zIndex: 1,
                backgroundColor: "#000",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
              onClick={spinWheel}
              disabled={isSpinning}
            >
              Spin
            </button>
            {winner && <h2>You won: {winner}</h2>}
          </div>
        </div>
        {/* Confetti after winning */}
       
      </div>
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

export default LuckySpinCustom;
