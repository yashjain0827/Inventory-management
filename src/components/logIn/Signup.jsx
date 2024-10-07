import { Button, Paper, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getSignup } from "../../actions/loginAction";
import img1 from "../../img/customised-data-image.png";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setloading] = useState(false);
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple regex for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validation checks
    if (!fullName.trim()) {
      setError("Full Name should not be empty.");
      return;
    }

    if (!email) {
      setError("Email should not be empty.");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Invalid email format.");
      return;
    }

    if (!password.trim()) {
      setError("Password should not be empty.");
      return;
    }

    const userRegDetails = {
      userName: fullName,
      email: email,
      password: password,
    };

    try {
      setloading(true);
      await getSignup(userRegDetails);
      setloading(false);
      navigate("/");
    } catch (error) {
      setloading(false);
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("Unexpected Error");
      }
    }
  };

  return (
    <div className="logincontainer">
      <div className="loginimg">
        <img src={img1} alt="" />
      </div>
      <div className="loginform">
        <Paper elevation={4} sx={{ padding: 4 }}>
          <Typography variant="h4" textAlign="center">
            Sign Up
          </Typography>

          <form
            onSubmit={(e) => handleSubmit(e)}
            style={{ marginBottom: "20px" }}
          >
            <TextField
              label="Full Name"
              id="fullName"
              name="fullName"
              variant="outlined"
              required
              fullWidth
              margin="normal"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              error={!!error && error.includes("Full Name")}
              helperText={error.includes("Full Name") && error}
            />

            <TextField
              label="Email"
              id="userName"
              name="userName"
              variant="outlined"
              type="email"
              required
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!error && error.includes("email")}
              helperText={error.includes("email") && error}
            />

            <TextField
              label="Password"
              id="password"
              name="password"
              variant="outlined"
              type="password"
              required
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!error && error.includes("Password")}
              helperText={error.includes("Password") && error}
            />
            {error &&
              !error.includes("Full Name") &&
              !error.includes("email") &&
              !error.includes("Password") && (
                <p style={{ color: "red" }}>{error}</p>
              )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 3, fontSize: 20 }}
              fullWidth
              disabled={loading}
            >
              Submit
            </Button>
          </form>
          <NavLink to={"/"}>Back to login</NavLink>
        </Paper>
      </div>
    </div>
  );
}
