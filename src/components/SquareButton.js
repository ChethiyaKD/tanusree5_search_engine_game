import React from "react";
import "../styles/components/squarebutton.scss";

export default function SquareButton({ props, id }) {
  return (
    <div className="square-button-container">
      <button
        className="primary-button"
        onClick={() => props.onClick(id)}
        disabled={props.disabled}
      >
        {props.text}
      </button>
    </div>
  );
}
