import React from "react";
import "../styles/components/errorpopup.scss";

import Button from "./Button.js";

export default function ErrorPopup({ setSelected }) {
  const handleButton = () => {
    setSelected(4);
  };

  const buttonProps = {
    text: "Go to history",
    onClick: handleButton,
  };

  return (
    <div className="error-popup-wrapper">
      <span className="popup-title">Submit your history</span>
      <span className="error-message">
        You have to submit at least one record from your search history
      </span>
      <Button props={buttonProps} />
    </div>
  );
}
