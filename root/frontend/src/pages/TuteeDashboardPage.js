import React, { Component } from "react";
import ProfileNavBar from "../components/logged-in-nav-bar/ProfileNavBar.js";
import WeeklySchedule from "../components/scheduling/WeeklySchedule.js";
import "./TuteeDashboardPage.css";
import FavoriteTutorsView from "../components/favorite-tutors/FavoriteTutorsView.js";
import { clearViewedTutor } from "../store/viewed-tutor/viewedTutorActions";

export default class TuteeDashboardPage extends Component {

  render() {
    return (
      <div>
        <ProfileNavBar />
        <div className="dashboardContainer">
          <div className="innerDashboardContainer">
            <WeeklySchedule />
          </div>
          <div className="innerDashboardContainer">
            <FavoriteTutorsView />
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    clearViewedTutor(); // When viewing the tutees dashboard by default no tutor schedule should be shown
  }

}

