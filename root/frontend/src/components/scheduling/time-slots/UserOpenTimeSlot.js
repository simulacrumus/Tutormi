import React, { Component } from "react";
import Popover from "react-bootstrap/Popover";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import "./TimeSlotOpen.css";
import { store } from "../../../store/configureStore.js";
import { AVAILABILITY_CANCELED } from "../../../store/user/userActions";
import { convertTimeSlotToSingleHours } from "../../../util/scheduleFunctions.js";

export default class UserOpenTimeSlot extends Component {

  render() {
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
            <img
                className="cancelIcon"
                src={require("../../../images/cancel-icon.png")}
                onClick={() => this.cancelAvailability()}
              ></img>
            </div>
          </div>
        </Popover.Title>
      </Popover>
    );
  }

  cancelAvailability() {
    store.dispatch({
      type: AVAILABILITY_CANCELED,
      payload: convertTimeSlotToSingleHours(this.props.timeSlot),
    });
  }
}
