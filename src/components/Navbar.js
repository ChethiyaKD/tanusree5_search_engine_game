import React, { useState } from "react";
import "../styles/components/navbar.scss";

import profileIcon from "../assets/images/profile.svg";
import profileWhite from "../assets/images/profileWhite.svg";
import searchIcon from "../assets/images/search.svg";
import searchWhite from "../assets/images/searchWhite.svg";
import browserIcon from "../assets/images/browser.svg";
import browserWhite from "../assets/images/browserWhite.svg";
import historyIcon from "../assets/images/history.svg";
import historyWhite from "../assets/images/historyWhite.svg";
import taskIcon from "../assets/images/tasks.svg";
import taskWhite from "../assets/images/tasksWhite.svg";

export default function Navbar({ selected, setSelected }) {
  const buttons = [
    {
      key: 1,
      icon: { light: profileWhite, dark: profileIcon },
      text: "User profile",
    },
    {
      key: 2,
      icon: { light: searchWhite, dark: searchIcon },
      text: "Search engine",
    },
    {
      key: 3,
      icon: { light: browserWhite, dark: browserIcon },
      text: "Browsing week",
    },
    {
      key: 4,
      icon: { light: searchWhite, dark: searchIcon },
      text: "Search history",
    },
    {
      key: 5,
      icon: { light: taskWhite, dark: taskIcon },
      text: "Tasks panel",
    },
  ];
  return (
    <div className="navbar-container">
      {buttons.map((data) => (
        <Navbutton
          icon={data.icon}
          text={data.text}
          key={data.key}
          id={data.key}
          active={selected === data.key}
          setSelected={setSelected}
        />
      ))}
    </div>
  );
}

export function Navbutton({ icon, text, active, setSelected, id }) {
  return (
    <div
      className={
        active ? "nav-button-container active" : "nav-button-container"
      }
      onClick={() => setSelected(id)}
    >
      <img src={active ? icon.light : icon.dark} alt="" className="icon" />
      <span className="button-text">{text}</span>
    </div>
  );
}
