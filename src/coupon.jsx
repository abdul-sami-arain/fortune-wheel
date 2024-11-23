import React from "react";

export default function CouponCard({prize}) {
    const redirectToUrl = (url) => {
        window.location.href = url;
      };
    return(
       <div className="coupon_card_pre">
         <div className="couponCard">
                <div className="left_cut"></div>
                <div className="right_cut"></div>
            <button onClick={()=>{redirectToUrl("https://thefurnituredepots.com/")}}> 
                SHOP NOW
            </button>
            <h4>YOU WIN</h4>
            <h3>"{prize}"</h3>
            <p>Coupon code is sent to your email.</p>
        </div>
       </div>
    )
}