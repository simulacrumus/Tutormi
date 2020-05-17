import React, { Component } from 'react';
import '../styles/WeeklySchedule.css';
import TimeSlotBooked from './TimeSlotBooked.jsx';
import TimeSlotOpen from './TimeSlotOpen.jsx';

export default class WeeklySchedule extends Component {

    render() {
        return (
            <table>
                <tr>
                    <th></th>
                    <th>Sunday</th>
                    <th>Monday</th>
                    <th>Tuesday</th>
                    <th>Wednesday</th>
                    <th>Thursday</th>
                    <th>Friday</th>
                    <th>Saturday</th>
                </tr>
                {this.fillRows()}
            </table>
        );
    }

    // This method works but needs some changes as we know more how we want the different pieces of the puzzle to interact with the weekly schedule
    fillRows() {
        // Need to first convert all date strings to dates
        let tutorAvailableHours = this.convertDateStringsToDates(this.props.tutorAvailableHours);
        let tutorAppointments = this.convertDateStringsToDates(this.props.tutorAppointments);
        let tuteeAppointments = this.convertDateStringsToDates(this.props.tuteeAppointments);

        this.removeSlotConflict(tutorAvailableHours, tuteeAppointments); // This will remove any tutor open hours that cant be booked because of pre-existing conflicts

        let table = [];
        for (let hour = 0; hour < 10; hour++) {
            let row = [];
            for (let day = 0; day < 7; day++) {
                let tutorAppointmentSlot = this.findTimeSlot(day, hour, tutorAppointments);
                let tutorAvailableSlot = this.findTimeSlot(day, hour, tutorAvailableHours);
                let tuteeBookedSlot = this.findTimeSlot(day, hour, tuteeAppointments);

                // Display tutor booked slot
                if (typeof tutorAppointmentSlot !== "undefined") {
                    if (hour === tutorAppointmentSlot.timeBlock.startTime.getHours())
                        row[day] = <TimeSlotBooked start={tutorAppointmentSlot.timeBlock.startTime.getHours()} end={tutorAppointmentSlot.timeBlock.endTime.getHours()}
                            name={tutorAppointmentSlot.tutorID} subject={tutorAppointmentSlot.subject} note={tutorAppointmentSlot.note} />
                // Display tutor open slot
                } else if (typeof tutorAvailableSlot !== "undefined") {
                    if (hour === tutorAvailableSlot.timeBlock.startTime.getHours())
                        row[day] = <TimeSlotOpen tutor={this.props.viewedTutor} timeSlot={tutorAvailableSlot.timeBlock}/>        
                // Display tutee booked slot
                } else if (typeof tuteeBookedSlot !== "undefined") {
                    if (hour === tuteeBookedSlot.timeBlock.startTime.getHours())
                        row[day] = <TimeSlotBooked start={tuteeBookedSlot.timeBlock.startTime} end={tuteeBookedSlot.timeBlock.endTime}
                            name={tuteeBookedSlot.tutorID} subject={tuteeBookedSlot.subject} note={tuteeBookedSlot.note} />
                } else {
                    row[day] = <td></td>;
                }
            }
            row.unshift(<td className="time"> {hour === 9 ? "" : `${hour + 1}:00 PM`} </td>); // Need to change the range of hours here
            table.push(<tr>{row}</tr>);
        }
        return table;
    }

    // Finds and returns the single point (or undefined) in a collection of slots that meet the condition of day and hour
    findTimeSlot(day, hour, slots) {
        return slots.filter((slot) => day === slot.timeBlock.startTime.getDay() && hour >= slot.timeBlock.startTime.getHours()
            && hour < slot.timeBlock.endTime.getHours())[0];
    }

    // Used to remove all tutor available hours that have a conflict with what the tutee has already booked. This makes sure that the conflicted
    // slots don't show on the weekly schedule
    removeSlotConflict(tutorAvailableHours, tuteeAppointments) {
        for (let i = 0; i < tuteeAppointments.length; i++) {
            for (let j = 0; j < tutorAvailableHours.length; j++) {
                if (tuteeAppointments[i].timeBlock.startTime.getDay() === tutorAvailableHours[j].timeBlock.startTime.getDay()) { // Conflict can only occur if they fall on the same day
                    if (this.checkIfAppointmentsConflict(tuteeAppointments[i].timeBlock.startTime.getHours(), tuteeAppointments[i].timeBlock.endTime.getHours(),
                        tutorAvailableHours[j].timeBlock.startTime.getHours(), tutorAvailableHours[j].timeBlock.endTime.getHours())) {
                        tutorAvailableHours.splice(j, 1); // may have to adjust index
                    }
                }
            }
        }
    }

    // Since in local storage dates are converted to strings we need to convert all the strings back to dates while maintaining the other data
    convertDateStringsToDates(dateStrings) {
        let dates = [];
        for (let i = 0; typeof dateStrings !== "undefined" && i < dateStrings.length; i++) {
            dates[i] = {
                ...dateStrings[i], timeBlock: {
                    startTime: new Date(dateStrings[i].timeBlock.startTime), endTime: new Date(dateStrings[i].timeBlock.endTime)
                }
            };
        }
        return dates;
    }

    // Checks if two 'lines' with start and end points intersect (appointments are essentially lines)
    checkIfAppointmentsConflict(start1, end1, start2, end2) {
        return ((start1 > start2 && start1 < end2)
            || (end1 > start2 && end1 < end2)
            || (start2 > start1 && start2 < end1)
            || (end2 > start1 && end2 < end1)
            || (start1 === start2 && end1 === end2)); // Final condition checks if the lines overlap exactly
    }

}





