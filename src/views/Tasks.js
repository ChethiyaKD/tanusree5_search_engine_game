import React, { useState, useEffect } from "react";
import { getFromStorage, sendMessage } from "../actions/actions.js";
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

  const [serveyQuestions, setServeyQuestions] = useState(null);

  const handleSubmitButton = (t) => {
    sendMessage({ command: "submitTask", task: t });
  };

  const buttonProps = {
    text: "Submit",
    onClick: handleSubmitButton,
    disabled: false,
  };

  const handleInputChange = (e, id) => {
    console.log(id);
    let index = data.findIndex((k) => k.id === id);
    data[index].link = e.target.value;
    setData([...data]);
  };

  useEffect(async () => {
    let storageRes = await getFromStorage([
      "weekTwoKeywords",
      "serveyQuestions",
    ]);
    if (storageRes.weekTwoKeywords) setData([...storageRes.weekTwoKeywords]);
    if (storageRes.serveyQuestions)
      setServeyQuestions(storageRes.serveyQuestions);
  }, []);

  return (
    <div className="tasks-container">
      <div className="scroller-wrapper">
        <div className="scroller">
          {data.map((k, i) => {
            return (
              <div className="keyword-item" key={i}>
                <span className="caption">Keyword</span>
                <span className="keyword-name">{k.keyword}</span>
                <div className="input-container">
                  <InputType
                    props={{ onChange: handleInputChange, id: k.id }}
                  />
                  <SquareButton
                    props={buttonProps}
                    disabled={k.link ? true : false}
                    id={k}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
