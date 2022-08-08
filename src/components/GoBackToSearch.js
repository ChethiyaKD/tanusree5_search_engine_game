import React from "react";
import "../styles/components/errorpopup.scss";

import Button from "./Button.js";

export default function GoBackToSearch({ onClick }) {
  const handleButton = () => {
    setSelected(2);
  };

  const buttonProps = {
    text: "Go back to search ",
    onClick: onClick,
  };

  return (
    <div className="error-popup-wrapper">
      <span className="popup-title">Done submitting?</span>
      <span className="error-message">
        If you're done submitting your search history, you can go back to the
        search engine.
      </span>
      <Button props={buttonProps} />
    </div>
  );
}
