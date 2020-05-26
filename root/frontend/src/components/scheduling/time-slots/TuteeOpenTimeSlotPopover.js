import React, { Component } from "react";
import Popover from "react-bootstrap/Popover";
import { bookAppointment } from "../../../store/user/userActions";
import Form from "react-bootstrap/Form";
import { connect } from "react-redux";
import PopoverTitleContainer from "./PopoverTitleContainer";

export default class TuteeOpenTimeSlotPopover extends Component {

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
          <button
            onClick={() => bookAppointment(this.props.viewedTutor._id, this.props.timeSlot.time,
              document.getElementById("coursesSelect").value, document.getElementById("notesInput").value)
            }>Book Appointment </button>
        </Popover.Content>
      </Popover>
    );
  }

}

