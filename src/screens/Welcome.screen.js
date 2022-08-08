import React from "react";
import uuid from 'react-uuid'
import "../styles/fonts.scss";
import "../styles/screens/welcome.scss";

import Button from "../components/Button.js";
import { saveToStorage, sendMessage } from "../actions/actions";

export default function Welcome({ setFirstTime }) {
  const handleButton = () => {
    let id = uuid()
    setFirstTime(false);
    saveToStorage({ firstTime: false, id: id });
  };

  const buttonProps = {
    text: "Yes",
    onClick: handleButton,
  };

  return (
    <div className="welcome-wrapper">
      <div className="title">Welcome to search engine game</div>
      <div className="description">
        Welcome to the Search Engine Game. Here in the game, you will be using
        the tool for <b>week 1</b> and search different topic we sent you before
        . From &nbsp;
        <b>week 2</b>, the game will start. You will be asked to perform
        different search task and input the first url to your task panel after
        you searched it with keyword you were assigned. We will record the time
        from when you search with the keyword in the engine to when you inputted
        the url to your answer field Are you ready to start exploring?
      </div>
      <Button props={buttonProps} />
    </div>
  );
}
