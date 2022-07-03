import React, { useState } from "react";
import "../styles/components/requestmoredata.scss";

import Button from "./Button.js";

export default function RequestMoreData({ popup }) {
  const handleButton = () => {
    popup(false);
  };

  const buttonProps = {
    text: "Got it",
    onClick: handleButton,
  };

  return (
    <div className="request-data-popup-wrapper">
      <span className="popup-title">Improve your search result</span>
      <span className="error-message">
        The search result will be improved based on how much search query data
        you're sharing. Also if you are shairing more private search query data,
        such as medical, financial, etc, your result might be improved.
      </span>
      <Button props={buttonProps} />
    </div>
  );
}
