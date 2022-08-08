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
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum
        </span>
      </div>
    </div>
  );
}
