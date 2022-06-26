import React, { useState, useEffect } from "react";
import { sendMessage, getFromStorage } from "../actions/actions.js";
import ErrorPopup from "../components/ErrorPopup.js";

import "../styles/views/home.scss";

import googleImg from "../assets/images/google.png";
import seachIcon from "../assets/images/magnifier.svg";

export default function Search({ setSelected, setData, setIsResult }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [noAccess, setNoAccess] = useState(false);

  const handleSearchInput = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleKeyUp = async (e) => {
    if (e.key != "Enter") return;
    let storageRes = await getFromStorage(["history", "weekTwoKeywords"]);
    let isAKeyword = storageRes.weekTwoKeywords.find((k) =>
      searchTerm.toLowerCase().includes(k.keyword.toLowerCase())
    );
    let isSubmitted = storageRes.history.find((h) => h.submitted);
    console.log(isAKeyword, isSubmitted);
    if (!isSubmitted && isAKeyword) return setNoAccess(true);
    let res = await sendMessage({ command: "search", data: searchTerm });
    console.log(res);
    setData([...res]);
    setIsResult(true);
  };

  return (
    <div className="view-container">
      {noAccess && <ErrorPopup setSelected={setSelected} />}
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
