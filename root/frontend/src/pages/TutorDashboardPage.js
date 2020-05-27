import React, { Component } from "react";
import ProfileNavBar from "../components/logged-in-nav-bar/ProfileNavBar.js";
import WeeklySchedule from "../components/scheduling/WeeklySchedule.js";
import "./TutorDashboardPage.css";
import { connect } from "react-redux";
import FavoriteTutorsView from "../components/favorite-tutors/FavoriteTutorsView.js";
import ScheduleMetrics from "../components/scheduling/ScheduleMetrics.js";

export default class TutorDashboardPage extends Component {
  render() {
    return (
      <div>
        <ProfileNavBar />
        <div className="tutorDashboardContainer">
          <div className="tutorInnerDashboardContainer">
            <WeeklySchedule />
          </div>
          <div className="tutorInnerDashboardContainer">
            <ScheduleMetrics />
          </div>
        </div>
      </div>
    );
  }
}
