import React, { Component } from "react";
import Popover from "react-bootstrap/Popover";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import "./TimeSlotOpen.css";
import { bookAppointment } from "../../../store/user/userActions";
import Form from "react-bootstrap/Form";
import { connect } from "react-redux";

class TimeSlotOpen extends Component {

  render() {
    console.log("new");
    return (
      <OverlayTrigger trigger="click" placement="bottom" overlay={this.popover(this.props.timeSlot.time)}>
        <td
          rowSpan={
            parseInt(this.props.timeSlot.time.end.getHours()) -
            parseInt(this.props.timeSlot.time.start.getHours())
          }
          className="open"
        >
          {this.props.timeSlot.time.start.getHours() +
            ":00-" +
            this.props.timeSlot.time.end.getHours()}
          :00 PM
        </td>
      </OverlayTrigger>
    );
  }

  popover(time) {
    return (
      <Popover id="popover-basic">
        <Popover.Title>
          <div className="popoverTitleContainer">
            <div>
              <img
                className="timeIcon"
                src={require("../../../images/time-icon.png")}
              ></img>
              {time.start.getHours() +
                ":00-" +
                time.end.getHours()}
            :00 PM
          </div>
          </div>
        </Popover.Title>
        <Popover.Content>
          {`Tutor: ${this.props.tutor.name}`}
          <Form.Label>Course</Form.Label>
          <Form.Control size="sm" as="select" id="coursesSelect">
            {this.props.tutor.courses.map((course) => (
              <option value={course}>{course}</option>
            ))}
          </Form.Control>
          <Form.Control
            size="sm"
            type="text"
            placeholder="Notes"
            id="notesInput"
          />
          <button
            onClick={() =>
              bookAppointment(
                this.props.tutor._id,
                this.props.timeSlot.time,
                document.getElementById("coursesSelect").value,
                document.getElementById("notesInput").value
              )
            }
          >
            Book Appointment
        </button>
        </Popover.Content>
      </Popover>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.profileReducer.user,
    viewedTutor: state.profileReducer.viewedTutor,
    token: state.profileReducer.token,
  };
}

export default connect(mapStateToProps)(TimeSlotOpen);
