import React, { Component } from "react";
import "./WeeklySchedule.css";
import "./time-slots/timeSlotStyles.css";
import BookedTimeSlot from "./time-slots/BookedTimeSlot";
import OpenTimeSlot from "./time-slots/OpenTimeSlot";
import TutorOpenableTimeSlot from "./time-slots/TutorOpenableTimeSlot";
import moment from "moment";
import { connect } from "react-redux";
import {
  convertSingleHoursToTimeSlots, findTimeSlot, removeSlotConflict, convertDateStringsToDates, checkIfAppointmentsConflict,
  combineSingleSlots, displayHour12Format, fallsOnSameDay
} from "../../util/scheduleFunctions.js";
import ArrowBackIosOutlinedIcon from "@material-ui/icons/ArrowBackIosOutlined";
import ArrowForwardIosOutlinedIcon from "@material-ui/icons/ArrowForwardIosOutlined";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core";
import purple from "@material-ui/core/colors/purple";
import Button from "react-bootstrap/Button";
import Slider from '@material-ui/core/Slider';

const customTheme = createMuiTheme({ palette: { primary: purple } });
const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function createHours() {
  let hours = [];
  for (let hour = 1; hour <= 23; hour = hour + 3) {
    hours[hour] = { value: hour, label: displayHour12Format(hour) }
  }
  return hours;
}
const sliderHours = createHours();

class WeeklySchedule extends Component {

  state = { weekStart: moment().startOf("week"), chosenDay: moment(), isSaving: false, hourRange: [8, 19] };

  render() {
    return (
      <div className="weekScheduleContainer">

        <div className="weekControlSection">

          <div className="weekControlSectionTop">
            <div className="weekNavigator">
              <ArrowBackIosOutlinedIcon className="weekChangeIcons"
                onClick={() => this.setState({ weekStart: this.state.weekStart.clone().subtract(1, "week").startOf("week"), })} />
              <h5>Week starting on {this.state.weekStart.format("MMM DD YYYY")}</h5>
              <ArrowForwardIosOutlinedIcon className="weekChangeIcons"
                onClick={() => this.setState({ weekStart: this.state.weekStart.clone().add(1, "week").startOf("week"), })} />
            </div>

            <ThemeProvider theme={customTheme}>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <KeyboardDatePicker disableToolbar variant="inline" format="DD/MM/yyyy" value={this.state.chosenDay}
                  onChange={(date) => {
                    if (date !== null && date.isValid())
                      this.setState({ weekStart: date.clone().startOf("week"), chosenDay: date, });
                  }} />
              </MuiPickersUtilsProvider>
            </ThemeProvider>

            <Button variant="secondary" size="sm" disabled={this.state.isSaving}
              onClick={() => {
                if (!this.state.isSaving) {
                  this.setState({ ...this.state, isSaving: true });
                  let sendDate = { hours: this.props.user.availableHours };
                  fetch("/api/tutors/schedule", {
                    method: "POST",
                    headers: {
                      "X-Auth-Token": this.props.token,
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(sendDate),
                  }).then((response) => {
                    this.setState({ ...this.state, isSaving: false });
                  });
                }
              }}>
              {this.state.isSaving ? "Saving..." : "Save Schedule"}
            </Button>
          </div>
          <h6>Display range</h6>
          <ThemeProvider theme={customTheme}>
            <Slider value={this.state.hourRange} marks={sliderHours} min={0} max={23}
              valueLabelFormat={(value) => moment().set("minute", 0).set("hour", value).format("ha")}
              onChange={(e, newValue) => this.setState({ ...this.state, hourRange: newValue })}
              valueLabelDisplay="auto"
            />
          </ThemeProvider>
        </div>

        <div className="scheduleScrollContainer">
          <table className="weeklySchedule">
            <thead>
              <tr>
                <th></th>
                {this.makeDayHeaderCells()}
              </tr>
            </thead>
            <tbody>
              {this.fillRows()}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  makeDayHeaderCells() {
    let headerCells = [];
    for (let day = 0; day < DAYS_OF_WEEK.length; day++)
      headerCells[day] = (
        <th>
          {`${DAYS_OF_WEEK[day]}`}<br />{this.state.weekStart.clone().add(day, "day").format("DD/MM/YYYY")}
        </th>);
    return headerCells;
  }

  fillRows() {
    let appointments = convertDateStringsToDates(this.props.user.appointments); // User's appointments (can be tutee or tutor)

    let availableHours = this.props.user.user.type === "tutor" ? convertSingleHoursToTimeSlots(this.props.user.availableHours) :
      convertSingleHoursToTimeSlots(this.props.viewedTutor.availableHours);

    // userAvailableHours = convertDateStringsToDates(userAvailableHours); // Don't know if I need this anymore
    if (availableHours === undefined)
      availableHours = [];

    combineSingleSlots(availableHours);

    removeSlotConflict(availableHours, appointments); // This will remove any tutor open hours that cant be booked because of pre-existing conflicts

    let table = [];
    for (let hour = this.state.hourRange[0]; hour <= this.state.hourRange[1]; hour++) {
      let row = [];
      for (let day = 0; day < 7; day++) {
        let appointmentSlot = this.findTimeSlot(day, hour, appointments);
        let availableHourSlot = this.findTimeSlot(day, hour, availableHours);

        if (appointmentSlot !== undefined) {
          if (hour === appointmentSlot.time.start.hours() || hour === this.state.hourRange[0])
            row[day] = <BookedTimeSlot appointment={appointmentSlot} displayRange={this.state.hourRange} />;

        } else if (availableHourSlot !== undefined) {   // Display user available hours (only if user is tutor)
          if (hour === availableHourSlot.time.start.hours() || hour === this.state.hourRange[0])
            row[day] = <OpenTimeSlot timeSlot={availableHourSlot} displayRange={this.state.hourRange} />;

        } else {
          if (this.state.weekStart.clone().add(day, "day").isBefore(moment())) { // The past is highlighted
            row[day] = <td className="pastSlot"></td>;
          } else {  // Tutor's can interact with empty cells and open them, tutees cannot
            row[day] = this.props.user.user.type === "tutor" ?
              <TutorOpenableTimeSlot date={this.state.weekStart.clone().add(day, "days").add(hour, "hours")} />
              : <td></td>;
          }
        }
      }

      let displayHour = hour !== this.state.hourRange[0] ? displayHour12Format(hour) : "";
      row.unshift(<td className="time"> {`${displayHour}`} </td>);
      table.push(<tr>{row}</tr>);
    }
    return table;
  }

  // Finds and returns the single point (or undefined) in a collection of slots that meet the condition of day and hour
  findTimeSlot(day, hour, slots) {
    for (let i = 0; i < slots.length; i++) {
      if (slots[i].time.end.hours() === 0) {
        if (fallsOnSameDay(this.state.weekStart.clone().add(day, "day"), moment(slots[i].time.start))
          && hour >= slots[i].time.start.hours() && hour < 24) {
          return slots[i];
        }
      } else {
        if (fallsOnSameDay(this.state.weekStart.clone().add(day, "day"), moment(slots[i].time.start))
          && hour >= slots[i].time.start.hours() && hour < slots[i].time.end.hours()) {
          return slots[i];
        }
      }
    }
  }

}

function mapStateToProps(state) {
  return {
    user: state.userReducer.user,
    viewedTutor: state.viewedTutorReducer.viewedTutor,
    token: state.userReducer.token,
    tempBooking: state.userReducer.tempBooking
  };
}

export default connect(mapStateToProps)(WeeklySchedule);


