import React, { useState, useEffect } from "react";
import { getFromStorage } from "../actions/actions.js";
import "../styles/views/browsingweek.scss";

export default function BrowsingWeek() {
  const [data, setData] = useState([]);

  useEffect(async () => {
    let storageRes = await getFromStorage("browsingWeek");
    if (storageRes.browsingWeek) setData(storageRes.browsingWeek);
  }, []);

  return (
    <div className="browsing-week-container">
      <span className="title">
        Search the topic listed below from the search
      </span>
      <div className="scroller-wrapper">
        <div className="scroller">
          {data.map((d, i) => {
            return (
              <div className="item" key={i}>
                <span className="item-title">{d.keyword}</span>
                {d.questions.map((q, i) => {
                  return (
                    <div className="item-question" key={i}>{`${
                      i + 1
                    }. ${q}`}</div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
