import React, { useState, useEffect } from "react";
import { saveToStorage, sendMessage } from "../actions/actions.js";
import "../styles/views/history.scss";

import DeleteButton from "../components/DeleteButton.js";
import Button from "../components/Button.js";

export default function History() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleDelete = (id) => {
    let filtered = data.filter((d) => d != id);
    setData([...filtered]);
    saveToStorage({ history: filtered });
  };

  const handleSubmit = async () => {
    setLoading(true);
    let res = await sendMessage({ command: "uploadHistory" });
    if (res) setLoading(false);
  };

  const buttonProps = {
    text: loading ? "Submitting..." : "Submit",
    onClick: handleSubmit,
    disabled: data.length > 0 ? false : true,
  };

  useState(async () => {
    let historyResponse = await sendMessage({ command: "getHistory" });
    if (historyResponse) setData(historyResponse);
  });
  return (
    <div className="browsing-week-container">
      <span className="title">History</span>
      <div className="scroller-wrapper">
        <div className="scroller">
          {data.map((h, i) => {
            return (
              <div className="history-item" key={i}>
                <span className="history-text">{h.searchTerm}</span>
                <DeleteButton onClick={handleDelete} id={h} />
              </div>
            );
          })}
        </div>
        <div className="button-wrapper">
          <Button props={buttonProps} />
        </div>
      </div>
    </div>
  );
}
