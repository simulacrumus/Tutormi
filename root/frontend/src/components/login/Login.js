// login.js contains form for the user to login
import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Modal } from "react-bootstrap";

import MainNavigation from "../navigation/MainNavigation";
import CustomButton from "./CustomButton.js";
import {
  authenticateAndLoginUser,
  changeForgottenPassword,
} from "../../util/apiCallFunctions";
import { isProfileSetUp } from "../../util/authenticationFunctions";

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
      showModal: false,
      errors: {
        email: "",
        password: "",
        login: "",
      },
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleInputChange(event) {
    event.preventDefault();
    const { name, value } = event.target;
    let errors = this.state.errors;
    // console.log(name, value);

    switch (name) {
      case "email":
        this.setState({ ...this.state, email: event.target.value });
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
        this.setState({ ...this.state, password: event.target.value });
        errors.password =
          value.length < 4 ? "password can't be shotrer then 4 characters" : "";
        if (value.length > 30) {
          errors.password = "password can be maximum 30 characters";
        }
        break;

      default:
        break;
    }

    // this.setState({ errors, [name]: value }, () => {
    //   //console.log(errors);
    // });
  }

  async handleSubmit(event) {
    console.log(
      "Handle Submit says: this is a user type: " + this.state.userType
    );
    event.preventDefault();
    if (this.state.type == "") {
      let emailSent = "";
      if (validateForm(this.state.errors) && this.state.email) {
        emailSent = await changeForgottenPassword(this.state.email);
      }
      if (!emailSent) {
        this.setState({ ...this.state, showModal: true });
      } else {
        document.getElementById("submittion-error").innerHTML = emailSent;
        // await this.setState({ ...this.state, errors: { login: login } }, () => {
        //   console.log(errors);
        // });
        console.error("HANDLE SUBMIT SAYS: invalid Form");
      }
    }
    if (
      validateForm(this.state.errors) &&
      this.state.email &&
      this.state.password
    ) {
      console.info("HANDLE SUBMIT SAYS: Valid Form");
      let login = await authenticateAndLoginUser(
        this.state.email,
        this.state.password,
        this.state.userType
      );
      console.log("value of LOGIN returned is: ", login);
      if (!login) {
        if (isProfileSetUp())
          // User who has created their account previously should be sent to profile
          window.location.href = "/profile";
        // redirect tutor to create account page
        else window.location.href = "/createProfile";
      } else {
        document.getElementById("submittion-error").innerHTML = login;
        // await this.setState({ ...this.state, errors: { login: login } }, () => {
        //   console.log(errors);
        // });
        console.error("HANDLE SUBMIT SAYS: invalid Form");
      }
    }
  }
  // *************************************************************************************************************8
  render() {
    // console.log("xxxxxxxxxxxxxxxxxxxxxx", this.state); //to check the most up to date state
    const { errors } = this.state;

    return (
      <>
        <Modal
          centered="true"
          show={this.state.showModal}
          onHide={() => {
            this.setState({ ...this.state, showModal: false });
            window.location.href = "/login";
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Forgot your password? We got you!</Modal.Title>
          </Modal.Header>
          <Modal.Body>All done! check your email.</Modal.Body>
        </Modal>
        {/* <MainNavigation /> */}

        {/* **************************************************************************************** */}

        <Modal
          centered="true"
          show={this.state.showModal}
          onHide={() => {
            this.setState({ ...this.state, showModal: false });
            window.location.href = "/login";
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Forgot your password? We got you!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={this.handleSubmit}>
              <Form.Group controlId="formBasicEmail">
                <Form.Control
                  onBlur={this.handleInputChange}
                  onChange={this.handleInputChange}
                  name="email"
                  placeholder="Enter your email"
                />
                {errors.email.length > 0 && (
                  <Form.Text className="error">{errors.email}</Form.Text>
                )}
              </Form.Group>
              <Form.Text id="submittion-error" className="error">
                {errors.login}
              </Form.Text>
              <div style={{ textAlign: "center", alignItems: "right" }}>
                <CustomButton
                  name="login"
                  type="submit"
                  onClick={() => {
                    console.log("random message");
                    this.setState({ ...this.state, email: this.state.email });
                  }}
                >
                  reset password
                </CustomButton>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
        {/* <MainNavigation /> */}

        {/* ************************************************************************************ */}
        <div className="parentLoginFormBoxContainer">
          <div className="loginFormBoxContainer">
            <h3 className="welcomeSign">Sign In</h3>

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

              <Form.Text id="submittion-error" className="error">
                {errors.login}
              </Form.Text>

              <CustomButton
                name="login"
                type="submit"
                onClick={() => {
                  console.log("random message");
                  this.setState({ ...this.state, userType: "tutor" });
                }}
              >
                Login as a tutor
              </CustomButton>
              <CustomButton
                type="submit"
                name="login"
                onClick={() => {
                  this.setState({ ...this.state, userType: "tutee" });
                }}
              >
                Login as a tutee
              </CustomButton>
            </Form>
            <Form.Text
              style={{ alignSelf: "flex-end" }}
              className="forgot-password"
            >
              Forgot{" "}
              <a
                href="/login"
                id="myButton"
                onClick={(e) => {
                  e.preventDefault();
                  this.setState({ ...this.state, showModal: true });
                }}
              >
                password?
              </a>
            </Form.Text>
            <br />
            <Form.Text style={{ fontSize: "15px" }}>
              Not a member yet?
            </Form.Text>

            <CustomButton
              name="buttonSignUp"
              onClick={() => {
                //setCount(count + 1);
                //  this.props.flip()
                window.location.href = "/signup";
              }}
            >
              sign up
            </CustomButton>
            {/* <p>Join {count} users that already signed up</p> */}
          </div>
        </div>
      </>
    );
  }
}

export default Login;
