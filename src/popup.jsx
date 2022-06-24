import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import "./styles/main.scss";

import Welcome from "./screens/Welcome.screen.js";

function Popup() {
  return (
    <div className="container">
      <Welcome />
    </div>
  );
}

render(<Popup />, document.getElementById("react-target"));
