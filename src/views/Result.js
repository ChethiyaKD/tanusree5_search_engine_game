import React, { useEffect, useState } from "react";
import { sendMessage } from "../actions/actions.js";
import "../styles/views/results.scss";

import ErrorPopup from "../components/ErrorPopup.js";

import backBtn from "../assets/images/back.svg";

export default function Result({ data, setIsResult, noAccess, setSelected }) {
  const [result, setResult] = useState([]);

  const openLink = (link) => {
    sendMessage({ command: "openLink", url: link });
  };

  const handleBackBtn = () => {
    setIsResult(false);
  };
  useEffect(() => {
    setResult([...data]);
  }, []);

  return (
    <div className="results-container">
      {noAccess && <ErrorPopup setSelected={setSelected} />}
      <span className="title">
        <button className="backbtn" onClick={() => handleBackBtn()}>
          <img src={backBtn} alt="" />
        </button>
        Search Result
      </span>
      <div className="scroller-wrapper">
        <div className="scroller">
          {result.map((r, i) => {
            return (
              <div className="result-item" key={i}>
                <div
                  className="link-container"
                  onClick={() => openLink(r.link || null)}
                >
                  {r.displayed_link || ""}
                </div>
                <div
                  className="title-container"
                  onClick={() => openLink(r.link || null)}
                >
                  {r.title}
                </div>
                <div
                  className="snippet-container"
                  onClick={() => openLink(r.link || null)}
                >
                  {r.snippet || ""}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
