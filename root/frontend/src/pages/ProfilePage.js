import React, { Component } from "react";
import ProfileNavBar from "../components/logged-in-nav-bar/ProfileNavBar.js";
import PersonalSummary from "../components/personal-summary/PersonalSummary.js";
import "./ProfilePage.css";
import { connect } from "react-redux";
import { store } from "../store/configureStore.js";

class ProfilePage extends Component {
  render() {
    return (
      <div>
        <ProfileNavBar />
        <div className="profilePageContainer">
          <PersonalSummary person={this.props.user} isUser={true} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.userReducer.user,
    viewedTutor: state.viewedTutorReducer,
  };
}

export default connect(mapStateToProps)(ProfilePage);
