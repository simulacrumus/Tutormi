import React, { Component } from "react";
import Popover from "react-bootstrap/Popover";
import PopoverTitleContainer from "./PopoverTitleContainer";
import { cancelAppointment } from "../../../store/user/userActions";

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
                    <img className="cancelIcon" src={require("../../../images/cancel-icon.png")}
                            onClick={() => cancelAppointment(this.props.appointment)}></img>
                    </div>
                </Popover.Content>
            </Popover>
        );
    }

}