import React, { useState } from "react";
import Navbar from "../components/Navbar.js";
import Home from "../views/Home.view.js";
import Search from "../views/Search.view.js";
import BrowsingWeek from "../views/BrowsingWeek.js";
import "../styles/screens/dashboard.scss";

export default function Dashboard() {
  const [selected, setSelected] = useState(1);
  return (
    <div className="dashboard-container">
      <Navbar selected={selected} setSelected={setSelected} />
      <div className="home-wrapper">
        {selected === 1 && <Home />}
        {selected === 2 && <Search />}
        {selected === 3 && <BrowsingWeek />}
      </div>
    </div>
  );
}
