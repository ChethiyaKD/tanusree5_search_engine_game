import React, { useState, useEffect } from "react";
import {
  sendMessage,
  getFromStorage,
  saveToStorage,
} from "../actions/actions.js";
import "../styles/components/surveryquestions.scss";
import Button from "./Button.js";

export default function SurveyQuestion({ questions, setQuestions }) {
  const [qq, setQq] = useState([]);
  const [required, setRequired] = useState(false);

  const handleButton = async () => {
    let found = qq.find((q) => !q.answer);
    if (found) return setRequired(true);
    let res = await sendMessage({ command: "answerServey", data: qq });
    if (res) setQuestions(null);
  };

  const handleInput = async (e, q) => {
    setRequired(false);
    let index = qq.indexOf(qq.find((qs) => q.question === qs.question));
    qq[index].answer = e.target.value;
  };

  const buttonProps = {
    text: "Submit",
    onClick: handleButton,
    disabled: false,
  };

  useEffect(() => {
    console.log(questions)
    let ques = questions.filter(aq => !aq.answer);
    console.log([ques[0]])
    setQq([ques[0]]);
  }, [questions]);

  return (
    <div className="survery-question-popup-wrapper">
      <span className="popup-title">Survey Questions</span>
      {qq.map((q, i) => {
        if (q.answer) return;
        return (
          <div className="qa" key={i}>
            <span className="question">{q.question}</span>
            <div className="input-container">
              <select onChange={(e) => handleInput(e, q)}>
                <option>Select an answer</option>
                {q.options.map((o, i) => {
                  return (
                    <option value={o} key={i}>
                      {o}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        );
      })}
      <div className="required-message">
        {required && (
          <span>Make sure you have answered all of the question</span>
        )}
      </div>
      <div className="button-wrapper">
        <Button props={buttonProps} />
      </div>
    </div>
  );
}
