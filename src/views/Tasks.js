import React, { useState, useEffect } from "react";
import { saveToStorage, sendMessage } from "../actions/actions.js";
import SquareButton from "../components/SquareButton.js";
import InputType from "../components/InputType.js";
import "../styles/views/tasks.scss";

export default function Tasks() {
  const [data, setData] = useState([
    { id: 1, text: "League of Legends", link: null },
    { id: 2, text: "YouTube", link: null },
    { id: 3, text: "Twitch", link: null },
    { id: 4, text: "Home Depot", link: null },
  ]);

  const handleSubmitButton = (id) => {
    console.log(id);
  };

  const buttonProps = {
    text: "Submit",
    onClick: handleSubmitButton,
    disabled: false,
  };

  const handleInputChange = (e, id) => {
    let index = data.findIndex((k) => k.id === id);
    data[index].link = e.target.value;
    setData([...data]);
  };

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div className="tasks-container">
      <div className="scroller-wrapper">
        <div className="scroller">
          {data.map((k, i) => {
            return (
              <div className="keyword-item" key={i}>
                <span className="caption">Keyword</span>
                <span className="keyword-name">{k.text}</span>
                <div className="input-container">
                  <InputType
                    props={{ onChange: handleInputChange, id: k.id }}
                  />
                  <SquareButton props={buttonProps} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
