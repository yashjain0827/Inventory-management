import React from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ViewInArIcon from "@mui/icons-material/ViewInAr";
import DescriptionIcon from "@mui/icons-material/Description";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <NavLink
        to="/landingpage/dashboard"
        className={({ isActive, isPending }) =>
          isPending
            ? "pending"
            : isActive
            ? " sidebar-child active"
            : "sidebar-child"
        }
      >
        <DashboardIcon />
        <p>Dashboard</p>
      </NavLink>
      <NavLink
        to="/landingpage/products"
        className={({ isActive, isPending }) =>
          isPending
            ? "pending"
            : isActive
            ? " sidebar-child active"
            : "sidebar-child"
        }
      >
        <ViewInArIcon />
        <p>Products</p>
      </NavLink>
      <NavLink
        to="/landingpage/billing"
        className={({ isActive, isPending }) =>
          isPending
            ? "pending"
            : isActive
            ? " sidebar-child active"
            : "sidebar-child"
        }
      >
        <DescriptionIcon />
        <p>Billing</p>
      </NavLink>
      <NavLink
        to="/landingpage/myacount"
        className={({ isActive, isPending }) =>
          isPending
            ? "pending"
            : isActive
            ? " sidebar-child active"
            : "sidebar-child"
        }
      >
        <AccountBoxIcon />
        <p>My acount</p>
      </NavLink>
    </div>
  );
}
