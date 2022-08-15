import React, { useState, useEffect } from "react";
import parse from "html-react-parser";
import {
  getFromStorage,
  sendMessage,
  saveToStorage,
} from "../actions/actions.js";
import SquareButton from "../components/SquareButton.js";
import { InputTextarea } from "../components/InputType.js";
import "../styles/views/tasks.scss";

export default function Tasks() {
  const [data, setData] = useState([
    { id: 1, text: "League of Legends", link: null },
    { id: 2, text: "YouTube", link: null },
    { id: 3, text: "Twitch", link: null },
    { id: 4, text: "Home Depot", link: null },
  ]);

  const [serveyQuestions, setServeyQuestions] = useState(null);

  const handleSubmitButton = async (t) => {
    sendMessage({ command: "submitTask", task: t });
    let storageRes = await getFromStorage("weekTwoKeywords");
    let found = storageRes.weekTwoKeywords.find(
      (k) => k.keyword.toLowerCase() === t.keyword.toLowerCase()
    );
    let index = storageRes.weekTwoKeywords.indexOf(found);
    if (index) {
      storageRes.weekTwoKeywords[index].link = t.link;
      saveToStorage({ weekTwoKeywords: storageRes.weekTwoKeywords });
    }
    let newData = data.filter(
      (d) => d.keyword.toLowerCase() != t.keyword.toLowerCase()
    );
    newData.map((nd) => (nd.link = null));
    setData([...newData]);
    let inputs = document.querySelectorAll("input");
    for (let i of inputs) {
      console.log(i.value);
      i.value = "";
    }
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
      "submittedKeywords",
    ]);
    if (storageRes.weekTwoKeywords) {
      let filtered = storageRes.weekTwoKeywords.filter(
        (k) => !storageRes.submittedKeywords.includes(k.keyword)
      );
      setData([...filtered]);
      // setData([...storageRes.weekTwoKeywords.filter(k => !k.link)])
    }
    if (storageRes.serveyQuestions)
      setServeyQuestions(storageRes.serveyQuestions);
  }, []);

  useEffect(() => {}, [data]);

  return (
    <div className="tasks-container">
      <div className="scroller-wrapper">
        <div className="scroller">
          {data.map((k, i) => {
            return (
              <div className="keyword-item" key={i}>
                <span className="caption">Question</span>
                <div className="keyword-name">
                  {parse(`<span>${k.question}</span>`)}
                </div>
                <div className="input-container">
                  <InputTextarea
                    props={{ onChange: handleInputChange, id: k.id }}
                  />
                </div>
                <div className="button-container">
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
