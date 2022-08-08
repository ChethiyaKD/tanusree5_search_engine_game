import React, { useState } from "react";
import Navbar from "../components/Navbar.js";
import Home from "../views/Home.view.js";
import Search from "../views/Search.view.js";
import BrowsingWeek from "../views/BrowsingWeek.js";
import History from "../views/History.js";
import Tasks from "../views/Tasks.js";
import Result from "../views/Result.js";


import "../styles/screens/dashboard.scss";

export default function Dashboard() {
  const [selected, setSelected] = useState(1);
  const [isResult, setIsResult] = useState(false);
  const [data, setData] = useState([]);
  const [lastKeyword, setLastKeyword] = useState(null);
  const [noAccess, setNoAccess] = useState(false);

  return (
    <div className="dashboard-container">
      <Navbar selected={selected} setSelected={setSelected} />
      <div className="home-wrapper">
        {selected === 1 && <Home />}
        {selected === 2 && isResult && (
          <Result data={data} setIsResult={setIsResult} setNoAccess={setNoAccess} noAccess={noAccess} setSelected={setSelected} />
        )}
        {selected === 2 && !isResult && (
          <Search
            setSelected={setSelected}
            setData={setData}
            setIsResult={setIsResult}
            setLastKeyword={setLastKeyword}
            setNoAccess={setNoAccess}
          />
        )}
        {selected === 3 && <BrowsingWeek />}
        {selected === 4 && <History lastKeyword={lastKeyword} setSelected={setSelected} setIsResult={setIsResult} />}
        {selected === 5 && <Tasks />}
      </div>
    </div>
  );
}
