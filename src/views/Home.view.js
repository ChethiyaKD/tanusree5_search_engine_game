import React, { useState, useEffect } from "react";
import { saveToStorage, getFromStorage } from "../actions/actions.js";
import SurveyQuestion from "../components/SurveyQuestion.js";

import "../styles/views/search.scss";

export default function Home() {
  const [credits, setCredits] = useState(0);
  const [balance, setBalance] = useState(0);
  const [serveyQuestions, setServeyQuestions] = useState(null);

  useEffect(async () => {
    let storageRes = await getFromStorage([
      "credits",
      "balance",
      "serveyQuestions",
    ]);
    if (storageRes.credits) setCredits(storageRes.credits);
    if (storageRes.balance) setBalance(storageRes.balance);
    if (storageRes.serveyQuestions)
      setServeyQuestions(storageRes.serveyQuestions);
  }, []);

  return (
    <div className="view-container">
      {Array.isArray(serveyQuestions) &&
        serveyQuestions?.find((s) => !s.answer) && (
          <SurveyQuestion
            questions={serveyQuestions}
            setQuestions={setServeyQuestions}
          />
        )}
      <div className="cards-container">
        <div className="card primary">
          <span className="card-title">Account Score</span>
          <span className="credits">{credits}</span>
        </div>
        <div className="card">
          <span className="card-title">Account Balance</span>
          <span className="credits">{`$${balance}`}</span>
        </div>
      </div>
      <div className="briefing-container">
        <span className="briefing-title">Rules and Debrief</span>
        <span className="briefing">
          PrivacyBrowser is a privacy-preserving search engine that keeps your
          searches private. In our Beta version, the search results are not much
          accurate. Throughout the study, if you provide your search queries,
          the search result might improve.<br /> <br />In this search engine, in your first
          week, you will get familiar with the tool and answer several survey
          questionnaires which will appear in the tool as a pop-up. This search
          history in our tool will store the search queries that you perform in
          the search engine tab. Search history data will be stored on your
          device with the browser extension tool. In the 2nd week, you will
          perform the task of finding information with our browser. During this
          process, you can choose to share your search query data with us to
          help improve our tool to generate more accurate search results. As
          fast you can complete the task, you will be compensated accordingly.
        </span>
      </div>
    </div>
  );
}
