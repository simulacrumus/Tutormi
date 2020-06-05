import React, { Component } from "react";
import "./DashboardSidePanel.css";
import { connect } from "react-redux";
import TutorView from "./TutorView.js";
import FavoriteIcon from '@material-ui/icons/Favorite';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import { ThemeProvider } from "@material-ui/core/styles";
import customTheme from "../../styles/materialUiTheme";
import TodayIcon from '@material-ui/icons/Today';
import AppointmentView from "./AppointmentView";
import moment from "moment";
import ScheduleMetrics from "./ScheduleMetrics.js";
import { isTutee } from "../../util/authenticationFunctions";
import ShowChartIcon from '@material-ui/icons/ShowChart';
import DoneIcon from '@material-ui/icons/Done';

class DashboardSidePanel extends Component {

  state = { tabValue: 0 };

  render() {
    return (
      <div className="favoriteContainer">
        <ThemeProvider theme={customTheme}>
          <AppBar position="static">
            <Tabs onChange={(e, newTabValue) => this.setState({ ...this.state, tabValue: newTabValue })}
              value={this.state.tabValue} variant="fullWidth">

              {isTutee()
                ? <Tab label="Favorites" icon={<FavoriteIcon />} />
                : <Tab label="Metrics" icon={<ShowChartIcon />} />}
              <Tab label="Upcoming" icon={<TodayIcon />} />
              <Tab label="Previous" icon={<DoneIcon />} />
            </Tabs>
          </AppBar>
        </ThemeProvider>

        <div className="sideContainer">
          {(this.state.tabValue === 0 && isTutee()) && this.displayTutors()}

          {(this.state.tabValue === 0 && !isTutee()) && <ScheduleMetrics />}

          {this.state.tabValue === 1 && this.displayUpcoming()}

          {this.state.tabValue === 2 && this.displayPastAppointments()}
        </div>

      </div>
    );
  }

  displayAppointments(isBefore) {
    let appointments = this.props.appointments.slice();
    let pastAppointments = [];
    appointments.sort((apt1, apt2) => moment(apt1.time.start).diff(moment(apt2.time.start)));
    for (let i = 0; i < appointments.length; i++) {
      let timeCondition = isBefore ? moment(appointments[i].time.end).isBefore(moment()) : moment(appointments[i].time.end).isAfter(moment());
      if (timeCondition)
        pastAppointments.push(<AppointmentView appointment={appointments[i]} />);
    }
    return pastAppointments.length === 0 ? <p>{`No ${isBefore ? "previous" : "upcoming"} appointments`}</p> : pastAppointments;
  }

  displayUpcoming() {
    if (this.props.appointments.length === 0)
      return <p>{"No upcoming appointments"}</p>

    let appointments = this.props.appointments.slice();
    let upcomingAppointments = [];
    appointments.sort((apt1, apt2) => moment(apt1.time.start).diff(moment(apt2.time.start)));
    for (let i = 0; i < appointments.length; i++)
      upcomingAppointments.push(<AppointmentView appointment={appointments[i]} />);
    return upcomingAppointments;
  }

  displayPastAppointments() {
    if (this.props.appointments.length === 0)
      return <p>{"No previous appointments"}</p>

    let appointments = this.props.appointments.slice();
    let pastAppointments = [];
    appointments.sort((apt1, apt2) => moment(apt1.time.start).diff(moment(apt2.time.start)));
    for (let i = 0; i < appointments.length; i++) {
      if (moment(appointments[i].time.end).isBefore(moment())) {
        pastAppointments.push(<AppointmentView appointment={appointments[i]} />);
      }
    }

    return pastAppointments;
  }

  displayTutors() {
    // Tutee has no favorites
    if (this.props.favoriteTutors.length === 0) {
      return (
        <div className="tutorRowContainer">
          <p>
            You don't have any tutors in your favorites list yet, try <a href="/search">searching</a> for one.
          </p>
        </div>);
    } else {
      // If the tutee has favorites display them
      let tutors = [];
      let tutorRow = [];
      for (let index = 0; index < this.props.favoriteTutors.length; index++) {
        if (index !== 0 && index % 3 === 0) {
          tutors.push(<div className="tutorRowContainer">{tutorRow}</div>);
          tutorRow = [];
        }
        tutorRow[index] = (<TutorView tutor={this.props.favoriteTutors[index]} />);
      }
      tutors.push(<div className="tutorRowContainer">{tutorRow}</div>);
      return tutors;
    }
  }
}

function mapStateToProps(state) {
  return {
    appointments: state.user.user.appointments,
    favoriteTutors: state.user.user.favorites,
  };
}

export default connect(mapStateToProps)(DashboardSidePanel);
