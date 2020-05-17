import React, { Component } from 'react';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import '../styles/TimeSlotBooked.css';
import { store } from "../store.js";
import { CANCEL_APPOINTMENT } from "../reducers/profileReducer.js";

export default class TimeSlotBooked extends Component {

    render() {
        return (
            <OverlayTrigger trigger="click" placement="bottom" overlay={this.popover}>
                <td rowSpan={parseInt(this.props.end.getHours()) - parseInt(this.props.start.getHours())} className="booked">
                    {this.props.start.getHours() + ":00-" + this.props.end.getHours()}:00 PM</td>
            </OverlayTrigger>
        );
    }

    popover = (
        <Popover id="popover-basic">
            <Popover.Title >
                <div className="popoverTitleContainer">
                    <div>
                        <img className="timeIcon" src={require("../images/time-icon.png")}></img>
                        {this.props.start.getHours() + ":00-" + this.props.end.getHours()}:00 PM
                    </div>
                    <img className="cancelIcon" src={require("../images/cancel-icon.png")} 
                    onClick={() => this.cancelAppointment()}></img>
                </div>
            </Popover.Title>
            <Popover.Content>
                Tutor: <strong>{this.props.name}</strong><br />
                Subject: <strong>{this.props.subject}</strong><br />
                Notes: <strong>{this.props.note}</strong>
            </Popover.Content>
        </Popover>
    );

    cancelAppointment() {
        store.dispatch({
            type: CANCEL_APPOINTMENT,
            payload: {
                tutorID: this.props.name,
                timeBlock: {
                    startTime: this.props.start,
                    endTime: this.props.end
                }
            }
        });
    }

}