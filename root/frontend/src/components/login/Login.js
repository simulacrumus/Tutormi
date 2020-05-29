// login.js contains form for the user to login
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form } from "react-bootstrap";
import { Component } from "react";
import { connect } from "react-redux";
//import Modal from 'react'
import CustomButton from "./CustomButton.js";
import { logInUser } from "../../store/user/userActions";
import login from "./Signin";
import "./Login.css";

const validEmailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);
const validateForm = (errors) => {
  let valid = true;
  Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
  return valid;
};
const userType = "";
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      userType: "",
      errors: {
        email: "",
        password: "",
      },
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleInputChange(event) {
    event.preventDefault();
    const { name, value } = event.target;
    let errors = this.state.errors;
    console.log(name, value);

    switch (name) {
      case "email":
        errors.email = !this.state.email ? "email can't be empty!" : "";
        if (this.state.email) {
          errors.email = validEmailRegex.test(value)
            ? ""
            : "email is not valid!";
        }
        if (value.length > 30) {
          errors.email = "email is to long!";
        }
        break;
      case "password":
        errors.password =
          value.length < 4 ? "password can't be shotrer then 4 characters" : "";
        if (value.length > 30) {
          errors.password = "password can be maximum 30 characters";
        }
        break;

      default:
        break;
    }

    this.setState({ errors, [name]: value }, () => {
      console.log(errors);
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    if (
      validateForm(this.state.errors) &&
      this.state.email &&
      this.state.password
    ) {
      console.info("Valid Form");
      logInUser(this.state.email, this.state.password, this.state.userType);
    } else {
      console.error("Invalid Form");
    }
  }

  render() {
    const { errors } = this.state;
    return (
      <div className="parentLoginFormBoxContainer">
        <div className="loginFormBoxContainer">
          <h1 className="welcomeSign">Sign In</h1>

          <Form onSubmit={this.handleSubmit}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                onBlur={this.handleInputChange}
                onChange={this.handleInputChange}
                name="email"
                placeholder="Enter email"
              />
              {errors.email.length > 0 && (
                <Form.Text className="error">{errors.email}</Form.Text>
              )}
              {/* <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text> */}
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                onBlur={this.handleInputChange}
                onChange={this.handleInputChange}
                name="password"
                type="password"
                placeholder="Password"
              />
              {errors.password.length > 0 && (
                <Form.Text className="error">{errors.password}</Form.Text>
              )}
            </Form.Group>
            <Form.Group controlId="formBasicCheckbox">
              <Form.Check
                name="rememberMe"
                type="checkbox"
                label="Remember me"
              />
            </Form.Group>
            <CustomButton
              name="login"
              onClick={() => {
                this.setState({ ...this.state, userType: "tutor" });
                //window.location.href = "/profile";
              }}
            >
              Login as a tutor
            </CustomButton>
            <CustomButton
              name="login"
              onClick={() => {
                this.setState({ ...this.state, userType: "tutee" });
              }}
            >
              Login as a tutee
            </CustomButton>
          </Form>
          {/* sign up button must be implemented as a custom button */}
          <Form.Text
            style={{ alignSelf: "flex-end" }}
            className="forgot-password"
          >
            Forgot <a href="google.com">password?</a>
          </Form.Text>
          <Form.Text>Or</Form.Text>
          <br />
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
      </div> // end of "parentLoginFormBoxContainer"
    );
  }
}

export default Login;
