import React, { Component } from "react";
import ProfileNavBar from "../components/logged-in-nav-bar/ProfileNavBar.js";
import PersonalSummary from "../components/personal-summary/PersonalSummary.js";
import "./TutorViewPage.css";
import { connect } from "react-redux";
import WeeklySchedule from "../components/scheduling/WeeklySchedule.js";

class TutorViewPage extends Component {
  render() {
    return (
      <div>
        <ProfileNavBar />
        <div className="profilePage">
          <div className="tutorWeekContainer">
            <WeeklySchedule
              tuteeAppointments={this.props.user.appointments}
              tutorAppointments={this.props.viewedTutor.appointments}
              tutorAvailableHours={this.props.viewedTutor.availableHours}
              viewedTutor={this.props.viewedTutor}
            />
          </div>
          <div className="tutorProfileContainer">
            <PersonalSummary person={this.props.viewedTutor} isUser={false} />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.userReducer.user,
    viewedTutor: state.viewedTutorReducer.viewedTutor,
  };
}

export default connect(mapStateToProps)(TutorViewPage);
