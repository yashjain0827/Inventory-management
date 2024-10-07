import React from "react";
import userimg from "../../img/download.png";
import { NavLink } from "react-router-dom";

export default function Header() {
  const logedinuser = JSON.parse(localStorage.getItem("loginuser"));
  return (
    <div className="header">
      <div className="header-logo">
        <NavLink to="/landingpage/dashboard" style={{ textDecoration: "none" }}>
          <p>IMS</p>
        </NavLink>
        <h3>Inventory Management System</h3>
      </div>

      <div className="header-user">
        <p>{logedinuser.userName}</p>
        <NavLink to="/landingpage/myacount">
          <img src={userimg} alt="User" />
        </NavLink>
      </div>
    </div>
  );
}
