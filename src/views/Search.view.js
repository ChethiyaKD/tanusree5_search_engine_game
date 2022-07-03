import React, { useState, useEffect } from "react";
import {
  sendMessage,
  getFromStorage,
  saveToStorage,
} from "../actions/actions.js";
import ErrorPopup from "../components/ErrorPopup.js";

import "../styles/views/home.scss";

import googleImg from "../assets/images/google.png";
import seachIcon from "../assets/images/magnifier.svg";
import loadingIcon from "../assets/images/loading-small.svg";

export default function Search({
  setSelected,
  setData,
  setIsResult,
  setLastKeyword,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [noAccess, setNoAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearchInput = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleKeyUp = async (e) => {
    if (e.key != "Enter") return;
    setIsLoading(true);
    let storageRes = await getFromStorage([
      "history",
      "weekTwoKeywords",
      "whitelistedKeywords",
      "bypass",
    ]);
    let isAKeyword = storageRes.weekTwoKeywords.find((k) =>
      searchTerm.toLowerCase().includes(k.keyword.toLowerCase())
    );
    let isSubmitted = storageRes.history.find((h) => h.submitted);
    console.log(storageRes.bypass);
    if (!isSubmitted && isAKeyword && !storageRes.bypass) {
      setLastKeyword(isAKeyword); //whitelist keyword
      return setNoAccess(true);
    }
    if (
      isSubmitted &&
      !storageRes.whitelistedKeywords.find((kw) =>
        searchTerm.toLowerCase().includes(kw.toLowerCase())
      ) &&
      !storageRes.bypass
    ) {
      setLastKeyword(isAKeyword); //whitelist keyword
      return setNoAccess(true);
    }
    let res = await sendMessage({ command: "search", data: searchTerm });
    console.log(res);
    setData([...res]);
    setIsResult(true);
    saveToStorage({ bypass: false });
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
        {isLoading && (
          <img src={loadingIcon} className="search-loading" alt="" />
        )}
      </div>
    </div>
  );
}
