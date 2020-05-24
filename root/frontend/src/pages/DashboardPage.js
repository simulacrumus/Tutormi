import React, { Component } from "react";
import ProfileNavBar from "../components/logged-in-nav-bar/ProfileNavBar.js";
import WeeklySchedule from "../components/scheduling/WeeklySchedule.js";
import "./DashboardPage.css";
import { connect } from "react-redux";
import FavoriteTutorsView from "../components/favorite-tutors/FavoriteTutorsView.js";

class DashboardPage extends Component {
  render() {
    return (
      <div>
        <ProfileNavBar />
        <div className="dashboardContainer">
          <div className="innerDashboardContainer">
            <WeeklySchedule
              tuteeAppointments={this.props.user.appointments}
              tutorAppointments={this.props.viewedTutor.appointments}
              tutorAvailableHours={this.props.viewedTutor.availableHours}
              viewedTutor={this.props.viewedTutor}
              tutorHours={this.props.user.availableHours}
            />
          </div>
          <div className="innerDashboardContainer">
            <FavoriteTutorsView />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.userReducer.user,
    favoriteTutors: state.userReducer.user.favoriteTutors,
    viewedTutor: state.viewedTutorReducer.viewedTutor,
  };
}

export default connect(mapStateToProps)(DashboardPage);
