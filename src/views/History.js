import React, { useState, useEffect } from "react";
import Checkbox from "react-custom-checkbox";
import {
  saveToStorage,
  sendMessage,
  getFromStorage,
} from "../actions/actions.js";
import "../styles/views/history.scss";

import DeleteButton from "../components/DeleteButton.js";
import Button from "../components/Button.js";
import RequestMoreData from "../components/RequestMoreData.js";

import checkDot from "../assets/images/checkDot.svg";

export default function History({ lastKeyword }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState([]);
  const [requireData, setRequireData] = useState(true);

  const handleDelete = (id) => {
    let filtered = data.filter((d) => d != id);
    setData([...filtered]);
    saveToStorage({ history: filtered });
  };

  const handleSubmit = async () => {
    let storageRes = await getFromStorage("whitelistedKeywords");
    storageRes.whitelistedKeywords.push(lastKeyword.keyword);
    setLoading(true);
    let res = await sendMessage({
      command: "uploadHistory",
      history: selectedHistory,
    });
    if (res) setLoading(false);
    saveToStorage({ whitelistedKeywords: storageRes.whitelistedKeywords });
  };

  const buttonProps = {
    text: loading ? "Submitting..." : "Submit",
    onClick: handleSubmit,
    disabled: data.length > 0 ? false : true,
  };

  const handleSelect = (selection) => {
    let found = selectedHistory.find((h) => h.url === selection.url);
    if (found) {
      let filtered = selectedHistory.filter((h) => h.url != found.url);
      setSelectedHistory([...filtered]);
      return;
    }
    selectedHistory.push(selection);
    setSelectedHistory([...selectedHistory]);
  };

  useEffect(async () => {
    let historyResponse = await sendMessage({ command: "getHistory" });
    if (historyResponse) setData(historyResponse);
  }, []);

  chrome.storage.local.onChanged.addListener((e) => {
    if (!e.history) return;
    if (!e.history.newValue) return;
    setData([...e.history.newValue]);
  });

  return (
    <div className="history-container">
      {requireData && <RequestMoreData popup={setRequireData} />}
      <span className="title">History</span>
      <div className="scroller-wrapper">
        <div className="scroller">
          {data.map((h, i) => {
            return (
              <div className="history-item" key={i}>
                <div className="left">
                  <Checkbox
                    disabled={h.submitted}
                    icon={<img src={checkDot} />}
                    checked={h.submitted}
                    onChange={() => handleSelect(h)}
                    borderColor="#2169F5"
                    style={{ cursor: "pointer" }}
                  />
                  <span className="history-text">{h.searchTerm}</span>
                </div>
                {!h.submitted && <DeleteButton onClick={handleDelete} id={h} />}
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
