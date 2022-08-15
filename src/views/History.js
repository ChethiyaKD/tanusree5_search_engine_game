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
import GoBackToSearch from "../components/GoBackToSearch.js";

import checkDot from "../assets/images/checkDot.svg";

export default function History({ lastKeyword, setSelected, setIsResult }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState([]);
  const [requireData, setRequireData] = useState(true);
  const [isFirstTime, setIsFirstTime] = useState(true)
  const [doneSubmitting, setDoneSubmitting] = useState(false)

  const handleDelete = (id) => {
    let filtered = data.filter((d) => d != id);
    setData([...filtered]);
    saveToStorage({ history: filtered });
  };

  const handleSubmit = async () => {
    let storageRes = await getFromStorage("whitelistedKeywords");
    if (lastKeyword) {
      storageRes.whitelistedKeywords.push(lastKeyword.keywords);
    };
    // if (!lastKeyword) saveToStorage({ bypass: true }); //if user submitted history before searching something, bypass "submit search" popup for the first time
    setLoading(true);
    let res = await sendMessage({
      command: "uploadHistory",
      history: selectedHistory,
    });
    if (res) { setLoading(false); setDoneSubmitting(true) };

    saveToStorage({ whitelistedKeywords: storageRes.whitelistedKeywords });
  };

  const buttonProps = {
    text: loading ? "Submitting..." : "Submit",
    onClick: handleSubmit,
    disabled: data.length > 0 ? false : true,
  };

  const handleGoBackBtn = () => {
    setSelected(2);
    setIsResult(false)
  }

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

  const init = async () => {
    let historyResponse = await sendMessage({ command: "getHistory" });
    if (historyResponse) setData(historyResponse);

    //don't show popup for the first time
    let storageRes = await getFromStorage("searchHistoryCheck");
    setIsFirstTime(storageRes.searchHistoryCheck);
    saveToStorage({ searchHistoryCheck: false })
    console.log(storageRes, requireData)
  }

  useEffect(() => {
    init();
  }, []);

  chrome.storage.local.onChanged.addListener((e) => {
    if (!e.history) return;
    if (!e.history.newValue) return;
    setData([...e.history.newValue]);
  });


  return (
    <div className="history-container">
      {doneSubmitting && <GoBackToSearch onClick={handleGoBackBtn} />}
      {requireData && !isFirstTime && <RequestMoreData popup={setRequireData} />}
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
