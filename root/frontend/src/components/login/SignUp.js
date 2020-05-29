import React from 'react'
import "./Login.css";
import CustomButton from "./CustomButton.js";


const SingUp = () => {
  return (
    <form className="parentLoginFormBoxContainer">
     
<div className = "loginFormBoxContainer">
<h3 style={{  textAlign: "center"}}>Sign Up</h3>
      <div className="form-group">
        <label>First name</label>
        <input type="text" className="form-control" placeholder="First name" />
      </div>

      <div className="form-group">
        <label>Last name</label>
        <input type="text" className="form-control" placeholder="Last name" />
      </div>

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

      <CustomButton  className="login">
        Sign Up
        </CustomButton>
      <p className="forgot-password text-right">
        Already registered <a href="./Login.js">sign in?</a>
      </p>
      </div>
    </form>
    
  );
};

export default SingUp;