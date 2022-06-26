import React, { useState } from "react";

import "../styles/fonts.scss";
import "../styles/screens/login.scss";

import InputType from "../components/InputType.js";
import Button from "../components/Button.js";
import { saveToStorage, sendMessage } from "../actions/actions";

export default function LoginScreen({ setFirstTime }) {
  const [userId, setUserId] = useState(null);

  const handleButton = async () => {
    let msgResp = await sendMessage({ command: "authUser", userId: userId });
    if (!msgResp.error) saveToStorage({ userId: userId });
  };

  const handleTextChange = (e) => {
    if (!e.target.value) return;
    setUserId(e.target.value);
  };

  const buttonProps = {
    text: "Next",
    onClick: handleButton,
  };

  return (
    <div className="login-wrapper">
      <div className="title">Enter your ID</div>
      <div className="description">
        <div className="login-input-container">
          <InputType props={{ onChange: handleTextChange, id: null }} />
        </div>
      </div>
      <Button props={buttonProps} />
    </div>
  );
}
