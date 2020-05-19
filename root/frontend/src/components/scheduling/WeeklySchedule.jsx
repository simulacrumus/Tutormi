import React, { Component } from 'react';
import './WeeklySchedule.css';
import TimeSlotBooked from './TimeSlotBooked.jsx';
import TimeSlotOpen from './TimeSlotOpen.jsx';
import UserOpenTimeSlot from './UserOpenTimeSlot.jsx';
import OpenableTimeSlot from './OpenableTimeSlot.jsx';
import moment from 'moment';
import { connect } from "react-redux";
import {
    convertSingleHoursToTimeSlots, findTimeSlot, removeSlotConflict, convertDateStringsToDates,
    checkIfAppointmentsConflict, combineSingleSlots
} from "../../util/scheduleFunctions.js";

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

class WeeklySchedule extends Component {

    constructor(props) {
        super(props);
        this.state = { weekStart: moment().startOf('week') };
    }

    render() {
        return (
            <div className="weekScheduleContainer">
                <div className="weekControlSection">
                    <button onClick={() => this.setState({ weekStart: this.state.weekStart.clone().subtract(1, "month").startOf('week') })}>Previous Month</button>
                    <button onClick={() => this.setState({ weekStart: this.state.weekStart.clone().subtract(1, "week").startOf('week') })}>Previous Week</button>
                    <h5>{`Week starting on ${this.state.weekStart.format("MMM DD YYYY")}`}</h5>
                    <button onClick={() => this.setState({ weekStart: this.state.weekStart.clone().add(1, "week").startOf('week') })}>Next Week</button>
                    <button onClick={() => this.setState({ weekStart: this.state.weekStart.clone().add(1, "month").startOf('week') })}>Next Month</button>
                </div>

                <table>
                    <tr>
                        <th></th>
                        {this.makeDayHeaderCells()}
                    </tr>
                    {this.fillRows()}
                </table>
            </div >

        );
    }

    makeDayHeaderCells() {
        let headerCells = [];
        for (let day = 0; day < DAYS_OF_WEEK.length; day++)
            headerCells[day] = <th>{`${DAYS_OF_WEEK[day]}`}<br />{this.state.weekStart.clone().add(day, "day").format("DD/MM/YYYY")}</th>

        return headerCells;
    }

    // This method works but feels bloated I need to simplify it somehow
    fillRows() {
        let userAppointments = convertDateStringsToDates(this.props.user.appointments); // User's appointments (can be tutee or tutor)

        let userAvailableHours = (this.props.user.type === "tutor") ? convertSingleHoursToTimeSlots(this.props.user.availableHours) : []; // If user is a tutor they might have available hours
        userAvailableHours = convertDateStringsToDates(userAvailableHours);
        combineSingleSlots(userAvailableHours);

        let viewedTutorAppointments = convertDateStringsToDates(this.props.viewedTutor.appointments);

        let viewedTutorAvailableHours = (typeof this.props.viewedTutor.availableHours !== "undefined") ? convertSingleHoursToTimeSlots(this.props.viewedTutor.availableHours) : [];
        viewedTutorAvailableHours = convertDateStringsToDates(viewedTutorAvailableHours);
        combineSingleSlots(viewedTutorAvailableHours);

        removeSlotConflict(viewedTutorAvailableHours, userAppointments); // This will remove any tutor open hours that cant be booked because of pre-existing conflicts

        let table = [];
        for (let hour = 0; hour < 10; hour++) {
            let row = [];
            for (let day = 0; day < 7; day++) {
                let viewedTutorAppointmentSlot = this.findTimeSlot(day, hour, viewedTutorAppointments);
                let viewedTutorAvailableHourSlot = this.findTimeSlot(day, hour, viewedTutorAvailableHours);
                let userAppointmentSlot = this.findTimeSlot(day, hour, userAppointments);
                let userAvailableHourSlot = this.findTimeSlot(day, hour, userAvailableHours);

                // Display viewed tutor appointments
                if (typeof viewedTutorAppointmentSlot !== "undefined") {
                    if (hour === viewedTutorAppointmentSlot.timeBlock.startTime.getHours())
                        row[day] = <TimeSlotBooked start={viewedTutorAppointmentSlot.timeBlock.startTime.getHours()} end={viewedTutorAppointmentSlot.timeBlock.endTime.getHours()}
                            name={viewedTutorAppointmentSlot.tutorID} subject={viewedTutorAppointmentSlot.subject} note={viewedTutorAppointmentSlot.note} />
                    // Display viewed tutor available hours
                } else if (typeof viewedTutorAvailableHourSlot !== "undefined") {
                    if (hour === viewedTutorAvailableHourSlot.timeBlock.startTime.getHours())
                        row[day] = <TimeSlotOpen tutor={this.props.viewedTutor} timeSlot={viewedTutorAvailableHourSlot.timeBlock} />
                    // Display user appointments
                } else if (typeof userAppointmentSlot !== "undefined") {
                    if (hour === userAppointmentSlot.timeBlock.startTime.getHours())
                        row[day] = <TimeSlotBooked start={userAppointmentSlot.timeBlock.startTime} end={userAppointmentSlot.timeBlock.endTime}
                            name={userAppointmentSlot.tutorID} subject={userAppointmentSlot.subject} note={userAppointmentSlot.note} />
                    // Display user (only if user is tutor) available hours
                } else if (typeof userAvailableHourSlot !== "undefined") {
                    if (hour === userAvailableHourSlot.timeBlock.startTime.getHours())
                        row[day] = <UserOpenTimeSlot tutor={this.props.user} timeSlot={userAvailableHourSlot} />

                } else {
                    // Tutor's can interact with empty cells and open them, tutees cannot
                    row[day] = (this.props.user.type === "tutor") ? <OpenableTimeSlot date={this.state.weekStart.clone().add(day, "day")} hour={hour} /> : <td></td>;
                }
            }
            row.unshift(<td className="time"> {hour === 9 ? "" : `${hour + 1}:00 PM`} </td>); // Need to change the range of hours here
            table.push(<tr>{row}</tr>);
        }
        return table;
    }

    // Finds and returns the single point (or undefined) in a collection of slots that meet the condition of day and hour
    findTimeSlot(day, hour, slots) {
        return slots.filter((slot) => this.state.weekStart.year() === slot.timeBlock.startTime.getFullYear() &&
            this.state.weekStart.month() === slot.timeBlock.startTime.getMonth() &&
            (this.state.weekStart.date() + day) === slot.timeBlock.startTime.getDate() &&
            hour >= slot.timeBlock.startTime.getHours() && hour < slot.timeBlock.endTime.getHours())[0];
    }

}

function mapStateToProps(state) {
    return {
        user: state.profileReducer.user,
        viewedTutor: state.profileReducer.viewedTutor
    };
}

export default connect(mapStateToProps)(WeeklySchedule);