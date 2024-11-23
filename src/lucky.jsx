import React, { useState, useRef, useEffect } from "react";
import Confetti from "react-confetti";
import img1 from "./assets/1.png";
import img2 from "./assets/2.jpg";
import img3 from "./assets/3.png";
import img4 from "./assets/4.png";
import img5 from "./assets/5.png";
import img6 from "./assets/6.png";
import img7 from "./assets/7.png";
import trans from "./assets/trans.png";
import DottedCircle from "./dotted";
import CouponCard from "./coupon";
import arrow from "./assets/arrow.png";
import arrow2 from "./assets/arrow2.png";
import arrow3 from "./assets/arrow3.png";

const LuckySpinCustom = () => {
  const [isWin, setWin] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [uid, setUid] = useState("");
  const [loading, isLoading] = useState(false);
  const [winner, setWinner] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCongrat, setShowCongrats] = useState(false);
  const canvasRef = useRef(null);
  const [makeChange,setMakeChange] = useState(false);

  const buttonRef = useRef(null); // Ref for the button

  useEffect(() => {
    if (makeChange) {
      const button = buttonRef.current;

      // Add the shake class
      button.classList.add("shake");

      // Remove the shake class after animation ends
      const timeout = setTimeout(() => {
        button.classList.remove("shake");
        setMakeChange(false); // Reset the state if needed
      }, 500); // Match the shake animation duration

      return () => clearTimeout(timeout); // Cleanup timeout
    }
  }, [makeChange]);


  const setCurrentStepState = (to) => {
    setCurrentStep(to);
  }

  const prizes = [
    { name: "Prize 1", image: img7, prize: "$25 off your order of $499.99 or more", uid: "67403239561b22475e89b915" },
    { name: "Prize 2", image: trans, prize: "Free mattress set with purchase of bedroom set $1199.99 or more", uid: "6740575822ae7b6151f18669" },
    { name: "Prize 3", image: trans, prize: "Free delivery with purchase of $799.99 or more", uid: "6740577222ae7b6151f186d0" },
    { name: "Prize 4", image: trans, prize: "$99.99 worth of Free accessories with purchase of $999.99 or more", uid: "6740578822ae7b6151f18737" },
    { name: "Prize 5", image: img5, prize: "10% off on your order of $999.99 or more", uid: "6740579d22ae7b6151f1879e" },
    { name: "Prize 6", image: trans, prize: "Free 75 inch TV with purchase of $5000 or more", uid: "674057c522ae7b6151f18805" },
    // { name: "Prize 6", image: img3 }
  ];
  // const bgcolors = ["#bc0022", "#22bc00", "#0022bc", "#bc0022", "#22bc00", "#0022bc"];
  const bgcolors = ["#bc0022", "#006dbc", "#00bc9a", "#bc0022", "#006dbc", "#00bc9a"];
  const segments = prizes.length;
  const segmentAngle = 360 / segments;
  const images = useRef([]);

  // Preload images
  useEffect(() => {
    prizes.forEach((prize, index) => {
      const img = new Image();
      img.src = prize.image;
      img.onload = () => {
        images.current[index] = img;
        if (images.current.length === prizes.length) drawWheel();
      };
    });
  }, [prizes]);

  const drawWheel = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < segments; i++) {
      // Adjust the angles to start at the top (-90 degrees)
      const startAngle = ((i * segmentAngle - 90) * Math.PI) / 180;
      const endAngle = (((i + 1) * segmentAngle - 90) * Math.PI) / 180;

      // Draw segment background
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = bgcolors[i];
      ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,0)";
      ctx.stroke();

      // Clip the drawing area to the current segment
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.clip();

      // Draw prize image
      if (images.current[i]) {
        const imgSize = radius * 0.8; // Adjust the size of the image as needed
        const textAngle = startAngle + (endAngle - startAngle) / 2;
        const imgX = centerX + radius * 0.7 * Math.cos(textAngle) - imgSize / 2;
        const imgY = centerY + radius * 0.8 * Math.sin(textAngle) - imgSize / 2;

        ctx.drawImage(images.current[i], imgX, imgY, imgSize, imgSize);
      }

      ctx.restore();
    }
  };


  const sentMail = async (uid,mail) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "email": mail,
      "option_uid": uid
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch("https://fdepot.skyhub.pk/api/v1/winners/add", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  }

  
  const [value, setValue] = useState('');

  const handleChange = (e) => {
    console.log(e.target.value)
    setValue(e.target.value);
  };

  const spinWheel = () => {
    if (isSpinning) return;
  
    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (!value || !emailRegex.test(value)) {
      console.log("Please enter a valid email address.");
      setMakeChange(!makeChange);
      return;
    }
  
    setIsSpinning(true);
    setCurrentStep(2);
  
    const spinAngle = Math.floor(15000 + Math.random() * 5000); // Total spin angle (5–10 seconds)
    const rotation = spinAngle % 360;
    const selectedIndex = Math.floor(
      (segments - rotation / (360 / segments)) % segments
    );
  
    const canvas = canvasRef.current;
  
    // Reduce the duration for a faster spin
    canvas.style.transition = "transform 15s cubic-bezier(0.25, 1, 0.5, 1)";
    canvas.style.transform = `rotate(${spinAngle}deg)`;
  
    setTimeout(() => {
      setIsSpinning(false);
      setWinner(prizes[selectedIndex].prize);
      setUid(prizes[selectedIndex].uid);
  
      // Reset the wheel to the final position (rotation)
      canvas.style.transition = "none";
      canvas.style.transform = `rotate(${rotation}deg)`;
  
      // Send email
      sentMail(prizes[selectedIndex].uid, value);
  
      // Show confetti and move to the next step
      setTimeout(() => {
        setCurrentStep(3);
        setShowConfetti(true);
      }, 1000);
  
      // Hide confetti after 10 seconds
      setTimeout(() => setShowConfetti(false), 10000);
    }, 15000); // Transition duration (2s)
  };
  


  return (
    <div className="main">
      <div
        style={{
          height: "500px",
          width: "500px",

        }}
        className="spinner"
      >
        <DottedCircle
          radius={264} // Radius of the circle
          dotCount={24} // Number of dots
          dotRadius={7.5} // Size of each dot
          size={566} // SVG canvas size
          left={-3}
          top={-2}
          isBlink={currentStep === 3}
        />
        <canvas
          className={showCongrat ? "wheel-canvas display_none" : "wheel-canvas"}
          ref={canvasRef}
          width="500"
          height="500"
          style={{
            transformOrigin: "center",

          }}
        />
        <img src={arrow2}
          className={currentStep === 3 ? "arrow display_none" : "arrow"}
        />

        <div 
        onClick={() => { setCurrentStepState(1) }}
        // onClick={spinWheel}
         className={currentStep === 0 ? "central_circle_0 " : "central_circle_0 display_none"}>
          {/* <h2>LET SEE <br /> <span>WHAT YOU WILL</span> <br />WIN</h2> */}

          <div className="central_circle_0_1">
            <h2>Spin</h2>
          </div>

        </div>
        <div className={currentStep === 1 ? "central_circle" : "central_circle display_none"}>

          <h2>SPIN <br /> <span>TO WIN</span></h2>
          <input
            type="text"
            value={value}
            onChange={handleChange}
            className="underlined-input"
            placeholder="Enter Your Email"
          />
          <button
             ref={buttonRef}
            onClick={spinWheel}
            disabled={isSpinning}
          >
            GET SPIN
          </button>

        </div>
        <div className={currentStep === 2 ? "central_circle_progress " : "central_circle_progress display_none"}>
          <h2>LET SEE <br /> <span className="">WHAT YOU</span> <br /> <span className="span2" >WIN</span> </h2>
          <DottedCircle
            radius={100} // Radius of the circle
            dotCount={12} // Number of dots
            dotRadius={7.5} // Size of each dot
            size={240}
            left={0}
            top={0}
          />

        </div>
        <div className={currentStep === 3 ? "central_circle_2 display_none" : "central_circle_2 "}>
          <h2>CONGRATULATIONS!</h2>
          <CouponCard prize={winner} />

        </div>



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
