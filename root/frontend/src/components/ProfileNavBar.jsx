import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import '../styles/ProfileNavBar.css';
import { connect } from "react-redux";

class ProfileNavBar extends Component {

    render() {
        return (
            <Navbar className="customNavBar" variant="dark" expand="lg">
                <Navbar.Brand href="#home">Tutormi</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="/">Profile</Nav.Link>
                        <Nav.Link href="/dashboard">Dashboard</Nav.Link>
                        <Nav.Link href="/search">Search</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>
                        Signed in as: <a href="#login">{this.props.firstName + " " + this.props.lastName}</a>
                    </Navbar.Text>
                    <img src={this.props.imgPath}></img>
                </Navbar.Collapse>
            </Navbar>
        );
    }

}

function mapStateToProps(state) {
    return {
        firstName: state.profileReducer.user.firstName,
        lastName: state.profileReducer.user.lastName,
        imgPath: state.profileReducer.user.imgPath
    };
}

export default connect(mapStateToProps)(ProfileNavBar);
