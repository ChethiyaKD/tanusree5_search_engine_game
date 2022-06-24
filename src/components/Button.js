import React from "react";
import "../styles/components/button.scss";
import "../styles/fonts.scss";

export default function Button({ props }) {
  return (
    <div className="button-container">
      <button className="primary-button" onClick={() => props.onClick()}>
        {props.text}
      </button>
    </div>
  );
}
