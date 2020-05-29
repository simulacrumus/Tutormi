import React from "react";
import classes from "./CustomButton.css";

const CustomButton = (props) => (
  // reusable button component, class name
  <button onClick={props.onClick} className={props.name}>
    {props.children}
  </button>
);

export default CustomButton;
