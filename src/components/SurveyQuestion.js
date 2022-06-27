import React, { useState } from "react";
import { sendMessage } from "../actions/actions.js";
import "../styles/components/surveryquestions.scss";
import InputType from "./InputType.js";
import Button from "./Button.js";

export default function SurveyQuestion() {
  const [input, setInput] = useState("");

  const handleButton = () => {
    sendMessage("submitServey");
  };
  const handleInput = (e) => {
    setInput(e.target.value);
  };
  const buttonProps = {
    text: "Submit",
    onClick: handleButton,
    disabled: false,
  };
  const inputProps = {
    onChange: handleInput,
    id: 1,
  };

  return (
    <div className="survery-question-popup-wrapper">
      <span className="popup-title">Survey Questions</span>
      <span className="question">
        You have to submit at least one record from your search history
      </span>
      <div className="input-container">
        <InputType props={inputProps} />
      </div>
      <div className="button-wrapper">
        <Button props={buttonProps} />
      </div>
    </div>
  );
}
