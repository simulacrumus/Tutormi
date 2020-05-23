// login.js contains form for the user to login
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import {Component} from "react"
import {connect} from "react-redux"

import CustomButton from "./CustomButton.js";
import login from './Signin'
import "./Login.css";


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      type: "",
    };
    this.handleInputChange = this.handleInputChange.bind(this);
  }
  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const parameter = target.name;

    this.setState({
      [parameter]: value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    //this is where the error checking will go
  }
  render() {
    return (
      <div className="parentLoginFormBoxContainer">
        <div className="loginFormBoxContainer">
          <h1 className="welcomeSign">Sign In</h1>
          <form className="login-form" onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label>Email address</label>
              <input
                type="email"
                className="form-control"
                placeholder="Your Email"
                onChange={this.handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="8 to 16 characters"
                onChange={this.handleInputChange}
              />
            </div>
            {/* "remember me" starts here--------------------------------- Not implemented yet */}
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
            <CustomButton
              name="login"
              onClick={() => {
                this.type.setState("tutor");
              }}
            >
              Login as a tutor
            </CustomButton>
            <CustomButton
              name="login"
              onClick={() => {
                this.type.setState("tutor");
              }}
            >
              Login as a tutee
            </CustomButton>

            {/* "Forgot Pssword" starts */}
            <p style={{ textAlign: "right" }}>
              Forgot <a href="emailUser">password?</a>
            </p>
            {/* "Forgot Pssword" starts */}
          </form>
          {/* sign up button must be implemented as a custom button */}
          <Button
            className="buttonSignUp"
            onClick={() => {
              //setCount(count + 1);
              window.location.href = "/components/login/SignUp.js";
            }}
          >
            sign up
          </Button>
          {/* <p>Join {count} users that already signed up</p> */}
        </div>
      </div>
    );
  }
}
const mapDispatchToProps = (dispatch) => ({
  handleSubmit: (user) => dispatch(login(user)),
});
export default connect(null, mapDispatchToProps)(Login);
