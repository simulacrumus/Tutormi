/* 
Utility functions used to help deal with appointments and general date management.
*/
import moment from 'moment';

// Converts available hours to the format used with booked appointments
export function convertSingleHoursToTimeSlots(availableHours) {
    return availableHours.map((timeHour) => {
        let date = moment(timeHour);
        return {
            time:
            {
                start: date,
                end: date.clone().add(1, "hour")
            }
        }
    });
}

// Converts available hours to the format used with booked appointments
export function convertTimeSlotToSingleHours(timeSlot) {
    let hours = [];
    let start = moment(new Date(timeSlot.time.start).getTime());
    for(let i = 0, hour = new Date(timeSlot.time.start).getHours(); hour < new Date(timeSlot.time.end).getHours(); i++, hour++ ) {
        hours.push(new Date(start.clone().add(i, "hour")));
    }
    return hours;
}

export function convertAppointmentsListToSingleHours(appointments) {
    let hours = [];
    appointments.forEach( (appointments) => hours.push(...convertTimeSlotToSingleHours(appointments)));
    return hours;
}

// Finds and returns the single point (or undefined) in a collection of slots that meet the condition of day and hour
export function findTimeSlot(day, hour, slots) {
    return slots.filter((slot) => this.state.weekStart.year() === slot.time.start.getFullYear() &&
        this.state.weekStart.month() === slot.time.start.getMonth() &&
        (this.state.weekStart.date() + day) === slot.time.start.getDate() &&
        hour >= slot.time.start.getHours() && hour < slot.time.end.getHours())[0];
}

// Used to remove all tutor available hours that have a conflict with what the tutee has already booked. This makes sure that the conflicted
// slots don't show on the weekly schedule
export function removeSlotConflict(tutorAvailableHours, tuteeAppointments) {
    for (let i = 0; i < tuteeAppointments.length; i++) {
        for (let j = 0; j < tutorAvailableHours.length; j++) {
            // Check if the two slots fall on the same exact date
            if (tuteeAppointments[i].time.start.getFullYear() === tutorAvailableHours[j].time.start.getFullYear() &&
                tuteeAppointments[i].time.start.getMonth() === tutorAvailableHours[j].time.start.getMonth() &&
                tuteeAppointments[i].time.start.getDate() === tutorAvailableHours[j].time.start.getDate()) {
                if (checkIfAppointmentsConflict(tuteeAppointments[i].time.start.getHours(), tuteeAppointments[i].time.end.getHours(),
                    tutorAvailableHours[j].time.start.getHours(), tutorAvailableHours[j].time.end.getHours())) {
                    tutorAvailableHours.splice(j, 1); // may have to adjust index
                }
            }
        }
    }
}

// Since in local storage dates are converted to strings we need to convert all the strings back to dates while maintaining the other data
export function convertDateStringsToDates(dateStrings) {
    let dates = [];
    for (let i = 0; typeof dateStrings !== "undefined" && i < dateStrings.length; i++) {
        dates[i] = {
            ...dateStrings[i], time: {
                start: new Date(dateStrings[i].time.start), end: new Date(dateStrings[i].time.end)
            }
        };
    }
    return dates;
}

// Checks if two 'lines' with start and end points intersect (appointments are essentially lines)
export function checkIfAppointmentsConflict(start1, end1, start2, end2) {
    return ((start1 > start2 && start1 < end2)
        || (end1 > start2 && end1 < end2)
        || (start2 > start1 && start2 < end1)
        || (end2 > start1 && end2 < end1)
        || (start1 === start2 && end1 === end2)); // Final condition checks if the lines overlap exactly
}

export function combineSingleSlots(openHours) {
    openHours.sort((timeSlot1, timeSlot2) => timeSlot1.time.start.getTime() - timeSlot2.time.start.getTime());
    for (let i = 0; i < openHours.length - 1; i++) {
        if (openHours[i].time.start.getFullYear() === openHours[i + 1].time.start.getFullYear() &&
            openHours[i].time.start.getMonth() === openHours[i + 1].time.start.getMonth() &&
            openHours[i].time.start.getDate() === openHours[i + 1].time.start.getDate()
            && openHours[i].time.end.getHours() === openHours[i + 1].time.start.getHours()) {
            openHours[i + 1].time.start.setHours(openHours[i].time.start.getHours());
            openHours.splice(i, 1);
            i--; // Need to go back one index so we don't skip the newly joined time slot
        }
    }
}

export function calcTotalHours(hours, timePeriod) {
    let start = moment().startOf(timePeriod);
    let end = moment().endOf(timePeriod);
    return hours.filter( (hour) => moment(hour).isAfter(start) && moment(hour).isBefore(end) ).length;
}

export function calcTotalHoursPerMonth(hours, numberOfMonthsBack) {
    let start = moment().clone().startOf("month").subtract(numberOfMonthsBack, "month").startOf("month");
    let end = moment().clone().startOf("month").subtract(numberOfMonthsBack, "month").endOf("month");
    return hours.filter( (hour) => moment(hour).isAfter(start) && moment(hour).isBefore(end) ).length;
}

export function fallOnSameDay(date1, date2){
    return (date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate());
}