import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

export default function Landingpage() {
  const navigate = useNavigate();
  const location = useLocation();

  const logedinuser = JSON.parse(localStorage.getItem("loginuser"));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const errorMessage =
    location.state?.errorMessage || "Invalid session, please login again";

  if (logedinuser) {
    return (
      <div className="landingpage">
        <div className="landingpage-header">
          <Header />
        </div>
        <div className="landingpage-sidebar">
          <Sidebar />
        </div>
        <div className="landingpage-outlet">
          <Outlet />
        </div>
      </div>
    );
  } else {
    return (
      <div style={styles.overlay}>
        <div style={styles.container}>
          <h1>{errorMessage}</h1>
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogout}
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </div>
      </div>
    );
  }
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  },
  container: {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "8px",
    textAlign: "center",
  },
};
