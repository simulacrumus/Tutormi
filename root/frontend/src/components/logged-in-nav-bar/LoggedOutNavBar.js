import React, { Component } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import "./ProfileNavBar.css";
import { logout } from "../../store/user/userActions";

export default class LoggedOutNavBar extends Component {
    render() {
        return (
            <Navbar className="customNavBar" variant="dark" expand="lg">
                <Navbar.Brand href="/">Tutormi</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
            </Navbar>
        );
    }
}

