// login.js contains form for the user to login, uses bootstrap to run use the following command in the root/frontend directory: npm install -g bootstrap
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
//import Alert, { AlertHeading } from "react-bootstrap/Alert";

import { Button } from "react-bootstrap";
import {
  FacebookLoginButton,
  GoogleLoginButton,
  TwitterLoginButton,
  LinkedInLoginButton,
} from "react-social-login-buttons";

import "./Login.css";
//import { Link } from "react-router-dom";

export default function Login() {
  //const [email, setEmail] = useState("");
  //const [password, setPassword] = useState("");
  const [count, setCount] = useState(0); //button count

  // const Example = (props) => {
  //   return (
  //     <div>
  //       <Alert color="primary">
  //         This is a primary alert with{" "}
  //         <a href="google.com" className="alert-link">
  //           an example link
  //         </a>
  //         . Give it a click if you like.
  //       </Alert>
  //       <Alert color="secondary">
  //         This is a secondary alert with{" "}
  //         <a href="google.com" className="alert-link">
  //           an example link
  //         </a>
  //         . Give it a click if you like.
  //       </Alert>
  //       <Alert color="success">
  //         This is a success alert with{" "}
  //         <a href="google.com" className="alert-link">
  //           an example link
  //         </a>
  //         . Give it a click if you like.
  //       </Alert>
  //       <Alert color="danger">
  //         This is a danger alert with{" "}
  //         <a href="google.com" className="alert-link">
  //           an example link
  //         </a>
  //         . Give it a click if you like.
  //       </Alert>
  //       <Alert color={props}>
  //         This is a warning alert with{" "}
  //         <a href="google.com" className="alert-link">
  //           an example link
  //         </a>
  //         . Give it a click if you like.
  //       </Alert>
  //       <Alert color="info">
  //         This is a info alert with{" "}
  //         <a href="google.com" className="alert-link">
  //           an example link
  //         </a>
  //         . Give it a click if you like.
  //       </Alert>
  //       <Alert color="light">
  //         This is a light alert with{" "}
  //         <a href="google.com" className="alert-link">
  //           an example link
  //         </a>
  //         . Give it a click if you like.
  //       </Alert>
  //       <Alert color="dark">
  //         This is a dark alert with{" "}
  //         <a href="google.com" className="alert-link">
  //           an example link
  //         </a>
  //         . Give it a click if you like.
  //       </Alert>
  //     </div>
  //   );
  // };

  // function nonExsistantUser(variant, idx) {
  //   console.log("gheeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
  //   //if the user not logged in
  //   return [
  //     "primary",
  //     "secondary",
  //     "success",
  //     "danger",
  //     "warning",
  //     "info",
  //     "light",
  //     "dark",
  //   ].map((variant, idx) => (
  //     <Alert key={5} variant={variant}>
  //       This is a {variant} alert with{" "}
  //       <Alert.Link href="google.com">an example link</Alert.Link>. Give it a
  //       click if you like.
  //     </Alert>
  //   ));
  // }

  return (
    <div className="parentLoginFormBoxContainer">
      <div className="loginFormBoxContainer">
        <h1 className="welcomeSign">Sign In</h1>
        <form>
          <div className="form-group">
            <label>Email address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
            />
          </div>

          <div className="form-group">
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="customCheck1"
              />
              <label className="custom-control-label" htmlFor="customCheck1">
                Remember me
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="btn  btn-block signIn"
            onClick={() => {
             // Example("warning");
            }}
          >
            Login
          </button>
          <p style={{ textAlign: "right" }} className="forgot-password">
            Forgot <a href="google.com">password?</a>
          </p>
        </form>

        <div className="social-buttons">
          <LinkedInLoginButton onClick={() => alert("Hello")} />
          <TwitterLoginButton onClick={() => alert("Hello")} />
          <GoogleLoginButton onClick={() => alert("Hello")} />
          <FacebookLoginButton onClick={() => alert("Hello")} />
        </div>

        <Button
          className="buttonSignUp"
          onClick={() => {
            setCount(count + 1);
            window.location.href = "/components/login/SignUp.js";
          }}
        >
          sign up
        </Button>
        <p style={{ textAlign: "center" }}>
          Join {count} users that already signed up
        </p>
      </div>
    </div>
  );
}
