import React from "react";
import "../styles/components/deletebutton.scss";

import deleleIcon from "../assets/images/deleteButton.svg";

export default function DeleteButton({ id, onClick }) {
  return (
    <div className="delete-button-wrapper">
      <button className="delete-button" onClick={() => onClick(id)}>
        <img src={deleleIcon} alt="" />
      </button>
    </div>
  );
}
