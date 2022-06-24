import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import { saveToStorage } from "./actions/actions.js";
import { getFromStorage } from "./actions/actions.js";

import "./styles/main.scss";

import Welcome from "./screens/Welcome.screen.js";
import Dashboard from "./screens/Dashboard.screen.js";

function Popup() {
  const [firstTime, setFirstTime] = useState(true);

  useEffect(async () => {
    let storageRes = await getFromStorage("firstTime");
    setFirstTime(storageRes.firstTime);
  }, []);

  return (
    <div className="container">
      {firstTime && <Welcome setFirstTime={setFirstTime} />}
      {!firstTime && <Dashboard />}
    </div>
  );
}

render(<Popup />, document.getElementById("react-target"));
