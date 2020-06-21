import React, { Component } from "react";
import { Form, Modal } from "react-bootstrap";

import { resetPassword } from "../../util/apiCallFunctions";
import CustomButton from "./CustomButton.js";

import "./Login.css";

class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 0,
      password: "",
      showModal: false,
      errors: {
        password: "",
        login: "",
        password2: "",
      },
    };
  
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount(){
    console.log(this.state)
    let url = new URL(window.location.href);
    let token = url.searchParams.get("token");
  
    fetch(`api/users/changepassword?token=${token}`).then((response) =>
      this.setState({ status: response.status })
    );
  }
  handleInputChange(event) {
    event.preventDefault();
    const { name, value } = event.target;
    let errors = this.state.errors;

    switch (name) {
      case "password":
        errors.password =
          value.length < 8 ? "password can't be shotrer then 8 characters" : "";
        if (value.length > 30) {
          errors.password = "password can be maximum 30 characters";
        }
        break;
      case "password2":
        errors.password2 =
          this.state.password == this.state.password2
            ? ""
            : "passwords do not match!";
        break;
      default:
        break;
    }

    this.setState({ errors, [name]: value }, () => {});
  }

  async handleSubmit(event) {
    event.preventDefault();

    if (!this.state.errors && this.state.password && this.state.password2) {
      console.info("HANDLE SUBMIT SAYS: Valid Form");
      let resetPassword = await resetPassword(this.state.password);

      if (!resetPassword) {
        this.setState({ ...this.state, showModal: true });

        console.log("HANDLE SUBMIT SAYS: reset successful successful");
      } else {
        document.getElementById("submittion-error").innerHTML = resetPassword;

        console.error("HANDLE SUBMIT SAYS: invalid Form");
      }
    }
  }
  render() {
    const { errors } = this.state;

      console.log("xxxxxxxxxxxxxxxxxxxxxx", this.state);
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
          <Modal.Body id="modal-body">
            <p>You are ready to log in!</p>
          </Modal.Body>
        </Modal>
        {this.state.status === 200 && (
          <form
            className="parentLoginFormBoxContainer"
            onSubmit={this.handleSubmit}
          >
            <div className="loginFormBoxContainer">
              <h3 className="welcomeSign" style={{ textAlign: "center" }}>
                Set up a new password
              </h3>

              <div className="form-group">
                <label>Password</label>
                <input
                  onBlur={this.handleInputChange}
                  onChange={this.handleInputChange}
                  name="password"
                  id="password"
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
                />
                {errors.password.length > 0 && (
                  <Form.Text className="error">{errors.password}</Form.Text>
                )}
              </div>
              <div className="form-group">
                <input
                  onBlur={this.handleInputChange}
                  onChange={this.handleInputChange}
                  name="password2"
                  id="password2"
                  type="password"
                  className="form-control"
                  placeholder="repeat your password"
                />
                {errors.password2.length > 0 && (
                  <Form.Text className="error">{errors.password2}</Form.Text>
                )}
              </div>
              <Form.Text id="submittion-error" className="error">
                {errors.login}
              </Form.Text>
              <div>
                <CustomButton
                  name="login"
                  onClick={(e) => {
                    e.preventDefault();
                    this.setState({ ...this.state, showModal: true });
                  }}
                >
                  reset
                </CustomButton>
              </div>
            </div>
          </form>
        )}
        {this.state.status === 401 && (
          <>
            <h4>Invalid Token.</h4>
            <CustomButton>Send another email</CustomButton>
          </>
        )}
      </>
    );
  }
}

export default ChangePassword;
