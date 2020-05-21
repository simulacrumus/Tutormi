import React, { Component } from 'react';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import './TimeSlotOpen.css';
import { store } from "../../../store/configureStore.js";
import { BOOK_SLOT } from "../../../store/profileReducer.js";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { CANCEL_AVAILABILITY } from "../../../store/profileReducer.js";
import { convertTimeSlotToSingleHours } from "../../../util/scheduleFunctions.js";


export default class UserOpenTimeSlot extends Component {

    render() {
        return (
            <OverlayTrigger trigger="click" placement="bottom" overlay={this.popover}>
                <td rowSpan={parseInt(this.props.timeSlot.time.end.getHours()) - parseInt(this.props.timeSlot.time.start.getHours())} className="open">
                    {this.props.timeSlot.time.start.getHours() + ":00-" + this.props.timeSlot.time.end.getHours()}:00 PM</td>
            </OverlayTrigger>
        );
    }

    popover = (
        <Popover id="popover-basic">
            <Popover.Title >
                <div className="popoverTitleContainer">
                    <div>
                        <img className="timeIcon" src={require("../../../images/time-icon.png")}></img>
                        {this.props.timeSlot.time.start.getHours() + ":00-" + this.props.timeSlot.time.end.getHours()}:00 PM
                        <img className="cancelIcon" src={require("../../../images/cancel-icon.png")}
                            onClick={() => this.cancelAvailability()}></img>
                    </div>
                </div>
            </Popover.Title>
        </Popover>
    );

    cancelAvailability() {
        store.dispatch({
            type: CANCEL_AVAILABILITY,
            payload: convertTimeSlotToSingleHours(this.props.timeSlot)
        });
    }

}

function MyPopover(props) {
    return (
        <Popover id="popover-basic">
            <Popover.Title >
                <div className="popoverTitleContainer">
                    <div>
                        <img className="timeIcon" src={require("../../../images/time-icon.png")}></img>
                        {props.timeSlot.start.getHours() + ":00-" + props.timeSlot.end.getHours()}:00 PM
                    </div>
                </div>
            </Popover.Title>
            <Popover.Content>
                {/* {`${this.props.tutor.firstName} ${this.props.tutor.lastName}`} */}
                <Form.Label>Course</Form.Label>
                <Form.Control size="sm" as="select" id="coursesSelect">
                    {props.tutor.courses.map((course) => <option value={course}>{course}</option>)}
                </Form.Control>
                <Form.Control size="sm" type="text" placeholder="Notes" id="notesInput" />
                <button onClick={() => bookSlot()}>Book Appointment</button>
            </Popover.Content>
        </Popover>
    );

}

function bookSlot() {
    store.dispatch({
        type: BOOK_SLOT,
        payload: {
            tutorID: this.props.tutor.firstName + " " + this.props.tutor.lastName,
            time: {
                start: this.props.timeSlot.start,
                end: this.props.timeSlot.end
            },
            subject: document.getElementById("coursesSelect").value,
            note: document.getElementById("notesInput").value
        }
    });
}