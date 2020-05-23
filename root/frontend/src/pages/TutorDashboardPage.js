import React, { Component } from "react";
import ProfileNavBar from "../components/logged-in-nav-bar/ProfileNavBar.js";
import WeeklySchedule from "../components/scheduling/WeeklySchedule.js";
import "./TutorDashboardPage.css";
import { connect } from "react-redux";
import FavoriteTutorsView from "../components/favorite-tutors/FavoriteTutorsView.js";
import ScheduleMetrics from "../components/scheduling/ScheduleMetrics.js";

class TutorDashboardPage extends Component {
  render() {
    return (
      <div>
        <ProfileNavBar />
        <div className="tutorDashboardContainer">
          <div className="tutorInnerDashboardContainer">
            <WeeklySchedule
              appointments={this.props.user.appointments}
              tutorHours={this.props.user.availableHours}
            />
          </div>
          <div className="tutorInnerDashboardContainer">
            <ScheduleMetrics />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.userReducer.user,
  };
}

export default connect(mapStateToProps)(TutorDashboardPage);
