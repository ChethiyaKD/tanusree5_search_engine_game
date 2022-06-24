import React, { useState, useEffect } from "react";
import { sendMessage } from "../actions/actions.js";

import "../styles/views/home.scss";

import googleImg from "../assets/images/google.png";
import seachIcon from "../assets/images/magnifier.svg";

export default function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchInput = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleKeyUp = (e) => {
    if (e.key != "Enter") return;
    sendMessage({ command: "search", data: searchTerm });
  };

  return (
    <div className="view-container">
      <img src={googleImg} alt="" className="google-logo" />
      <div className="search-box">
        <img src={seachIcon} alt="" />
        <input
          type="text"
          className="search-input"
          onChange={(e) => handleSearchInput(e)}
          onKeyUp={(e) => handleKeyUp(e)}
        />
      </div>
    </div>
  );
}
