import React, { Component } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import "./ProfileNavBar.css";
import { connect } from "react-redux";
import { logout } from "../../store/user/userActions";

class ProfileNavBar extends Component {
  render() {
    return (
      <Navbar className="customNavBar" variant="dark" expand="lg">
        <Navbar.Brand href="/">Tutormi</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/profile">Profile</Nav.Link>
            <Nav.Link href="/dashboard">Dashboard</Nav.Link>
            {this.props.type === "tutee" ? (
              <Nav.Link href="/search">Search</Nav.Link>
            ) : null}
          </Nav>
        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            Signed in as: <a href="/login" onClick={() => logout()}>{this.props.name}</a>
          </Navbar.Text>
          <img src={require(`../../images/uploads/${this.props.profilePic}`)}></img>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

function mapStateToProps(state) {
  return {
    name: state.user.user.user.name,
    profilePic: state.user.user.profilePic,
    type: state.user.user.user.type,
  };
}

export default connect(mapStateToProps)(ProfileNavBar);
