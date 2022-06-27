import React, { useState, useEffect } from "react";
import {
  sendMessage,
  getFromStorage,
  saveToStorage,
} from "../actions/actions.js";
import "../styles/components/surveryquestions.scss";
import InputType from "./InputType.js";
import Button from "./Button.js";

export default function SurveyQuestion({ questions, setQuestions }) {
  const [qq, setQq] = useState([]);

  const handleButton = async () => {
    let res = await sendMessage({ command: "answerServey", data: qq });
    if (res) setQuestions(null);
  };

  const handleInput = async (e, q) => {
    let index = qq.indexOf(qq.find((qs) => q.question === qs.question));
    qq[index].answer = e.target.value;
  };

  const buttonProps = {
    text: "Submit",
    onClick: handleButton,
    disabled: false,
  };

  useEffect(() => {
    setQq([...questions]);
  }, [questions]);

  return (
    <div className="survery-question-popup-wrapper">
      <span className="popup-title">Survey Questions</span>
      {questions.map((q, i) => {
        if (q.answer) return;
        return (
          <div className="qa" key={i}>
            <span className="question">{q.question}</span>
            <div className="input-container">
              <InputType props={{ onChange: handleInput, id: q }} />
            </div>
          </div>
        );
      })}
      <div className="button-wrapper">
        <Button props={buttonProps} />
      </div>
    </div>
  );
}
