import React, { useEffect, useState } from "react";
import { sendMessage } from "../actions/actions.js";
import "../styles/views/results.scss";

export default function Result({ data }) {
  const [result, setResult] = useState([]);

  const openLink = (link) => {
    sendMessage({ command: "openLink", url: link });
  };

  useEffect(() => {
    setResult([...data]);
  }, []);

  return (
    <div className="results-container">
      <span className="title">Search Result</span>
      <div className="scroller-wrapper">
        <div className="scroller">
          {result.map((r, i) => {
            return (
              <div className="result-item" key={i}>
                <div
                  className="link-container"
                  onClick={() => openLink(r.link)}
                >
                  {r.displayed_link}
                </div>
                <div
                  className="title-container"
                  onClick={() => openLink(r.link)}
                >
                  {r.title}
                </div>
                <div
                  className="snippet-container"
                  onClick={() => openLink(r.link)}
                >
                  {r.snippet}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
