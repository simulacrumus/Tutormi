// login.js contains form for the user to login
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form } from "react-bootstrap";
import { Component } from "react";
import { connect } from "react-redux";
import CustomButton from "./CustomButton.js";
import login from "./Signin";
import "./Login.css";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      chword: "",
      type: "",
    };
    this.handleInputChange = this.handleInputChange.bind(this);
  }
  handleInputChange(event) {
    event.preventDefault();
    const target = event.target;
    const value = target.value;
    const parameter = target.name;
    console.log(`${parameter} have changed and now it's value is ${value}`);
    if (parameter == "email") {
      console.log(`${parameter}: ${value}`);
      if (parameter === "") {
        console.log("email can;t be empty");
      }
    }

    this.setState({
      [parameter]: value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    //if (email){}
  }

  render() {
    return (
      <div className="parentLoginFormBoxContainer">
        <div className="loginFormBoxContainer">
          <h1 className="welcomeSign">Sign In</h1>

          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>
            <Form.Group controlId="formBasicCheckbox">
              <Form.Check type="checkbox" label="Remember me" />
            </Form.Group>
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
          </Form>
          {/* "Forgot Pssword" starts */}

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
      </div>// end of "parentLoginFormBoxContainer"
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  handleSubmit: (user) => dispatch(login(user)),
});
export default connect(null, mapDispatchToProps)(Login);
