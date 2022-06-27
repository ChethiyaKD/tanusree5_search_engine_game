import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import {
  saveToStorage,
  getFromStorage,
  listenToLogin,
  sendMessage,
} from "./actions/actions.js";

import "./styles/main.scss";

import Welcome from "./screens/Welcome.screen.js";
import Dashboard from "./screens/Dashboard.screen.js";
import Login from "./screens/Login.screen";

function Popup() {
  const [firstTime, setFirstTime] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(async () => {
    let storageRes = await getFromStorage(["firstTime", "userId"]);
    if (storageRes.userId) setLoggedIn(true);
    setFirstTime(storageRes.firstTime);
    sendMessage({ command: "init" });
  }, []);

  listenToLogin(setLoggedIn);

  return (
    <div className="container">
      {!loggedIn && <Login />}
      {loggedIn && firstTime && <Welcome setFirstTime={setFirstTime} />}
      {loggedIn && !firstTime && <Dashboard />}
    </div>
  );
}

render(<Popup />, document.getElementById("react-target"));
