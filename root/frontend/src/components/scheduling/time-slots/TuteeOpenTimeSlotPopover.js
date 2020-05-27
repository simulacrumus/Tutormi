import React, { Component } from "react";
import Popover from "react-bootstrap/Popover";
import { bookAppointment } from "../../../store/user/userActions";
import { updateViewedTutorSchedule } from "../../../store/viewed-tutor/viewedTutorActions";
import Form from "react-bootstrap/Form";
import { connect } from "react-redux";
import PopoverTitleContainer from "./PopoverTitleContainer";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { displayHour12Format } from "../../../util/scheduleFunctions";

export default class TuteeOpenTimeSlotPopover extends Component {

  state = { start: this.props.timeSlot.time.start.hours(), end: this.props.timeSlot.time.end.hours() }

  render() {
    return (
      <Popover {...this.props} id="popover-basic" >
        <PopoverTitleContainer time={this.props.timeSlot.time} />
        <Popover.Content>
          {`Tutor: ${this.props.viewedTutor.user.name}`} <br />

          <Form.Label>Course</Form.Label>
          <Form.Control size="sm" as="select" id="coursesSelect">
            {this.props.viewedTutor.courses.map((course) => <option value={course}>{course}</option>)}
          </Form.Control>

          <Form.Control size="sm" type="text" placeholder="Notes" id="notesInput" />

          <Select value={this.state.start} onChange={(e) => this.setState({ ...this.state, start: e.target.value })}>
            {this.makeMenuItems(this.props.timeSlot.time.start.hours(), this.state.end - 1)}
          </Select>
          <Select value={this.state.end} onChange={(e) => this.setState({ ...this.state, end: e.target.value })}>
            {this.makeMenuItems(this.state.start + 1, this.props.timeSlot.time.end.hours())}
          </Select>

          <button
            onClick={() => {
              let newAppointment = {
                tutor: this.props.viewedTutor._id, // change name!!!!!
                tutee: this.props.tuteeId,
                time: {
                  end: this.props.timeSlot.time.end.set("hours", this.state.end),
                  start: this.props.timeSlot.time.start.set("hours", this.state.start)
                },
                subject: document.getElementById("coursesSelect").value,
                note: document.getElementById("notesInput").value,
                //date: new Date(),
              }
              bookAppointment(newAppointment);
              updateViewedTutorSchedule(newAppointment);
            }
            }>Book Appointment </button>
        </Popover.Content>
      </Popover>
    );
  }

  makeMenuItems(start, end) {
    let menuItems = [];
    for (let hour = start; hour <= end; hour++)
      menuItems.push(<MenuItem value={hour}>{displayHour12Format(hour)}</MenuItem>);
    return menuItems;
  }

}

