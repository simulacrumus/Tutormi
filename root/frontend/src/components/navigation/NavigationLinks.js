import React from "react";
import { NavLink } from "react-router-dom";
import "./NavigationLinks.css";
import { CSSTransition } from "react-transition-group";
const NavigationLinks = (props) => {
  return (
    <CSSTransition
      in={props}
      timeout={200}
      classNames="slide-in-left"
      mountOnEnter
      unmountOnExit
    >
      <ul className="nav-link">
        <li>
          <NavLink to="/about">About</NavLink>
        </li>
        <li>
          <NavLink to="/search" exact>
            Search tutors
          </NavLink>
        </li>

        <li>
          <NavLink to="/components/login/SignUp.js">Sign up</NavLink>
        </li> 
      </ul>
    </CSSTransition>
  );
};

export default NavigationLinks;
