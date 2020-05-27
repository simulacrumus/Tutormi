import React, { Component } from "react";
import Popover from "react-bootstrap/Popover";
import { store } from "../../../store/configureStore.js";
import { APPOINTMENT_CANCELED } from "../../../store/user/userActions";
import { VIEWED_TUTOR_APPOINTMENT_CANCELED } from "../../../store/viewed-tutor/viewedTutorActions";
import PopoverTitleContainer from "./PopoverTitleContainer";

export default class BookedTimeSlotPopover extends Component {

    render() {
        return (
            <Popover {...this.props} id="popover-basic">
                <PopoverTitleContainer time={this.props.appointment.time} />
                <Popover.Content>
                    Tutor: <strong>{this.props.appointment.tutor}</strong><br />
                    Tutee: <strong>{this.props.appointment.tutee}</strong><br />
                    Subject: <strong>{this.props.appointment.subject}</strong><br />
                    Notes: <strong>{this.props.appointment.note}</strong>
                    <div>
                        Cancel?
                    <img className="cancelIcon" src={require("../../../images/cancel-icon.png")} onClick={() => this.cancelAppointment()}>
                        </img>
                    </div>
                </Popover.Content>
            </Popover>
        );
    }

    cancelAppointment() {
        store.dispatch({
            type: APPOINTMENT_CANCELED,
            payload: this.props.appointment
        });

        store.dispatch({
            type: VIEWED_TUTOR_APPOINTMENT_CANCELED,
            payload: this.props.appointment
        });
    }

}