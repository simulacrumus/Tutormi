/* 
Utility functions used to help deal with appointments and general date management.
*/
import moment from 'moment';

// Converts available hours to the format used with booked appointments
export function convertSingleHoursToTimeSlots(availableHours) {
    return availableHours.map((timeHour) => {
        let date = moment(timeHour.start);
        return {
            timeBlock:
            {
                startTime: date,
                endTime: date.clone().add(1, "hour")
            }
        }
    });
}

// Converts available hours to the format used with booked appointments
export function convertTimeSlotToSingleHours(timeSlot) {
    let hours = [];
    let startTime = moment(timeSlot.timeBlock.startTime.getTime());
    for(let i = 0, hour = timeSlot.timeBlock.startTime.getHours(); hour < timeSlot.timeBlock.endTime.getHours(); i++, hour++ ) {
        hours.push({ start: new Date(startTime.clone().add(i, "hour"))});
    }
    return hours;
}

// Finds and returns the single point (or undefined) in a collection of slots that meet the condition of day and hour
export function findTimeSlot(day, hour, slots) {
    return slots.filter((slot) => this.state.weekStart.year() === slot.timeBlock.startTime.getFullYear() &&
        this.state.weekStart.month() === slot.timeBlock.startTime.getMonth() &&
        (this.state.weekStart.date() + day) === slot.timeBlock.startTime.getDate() &&
        hour >= slot.timeBlock.startTime.getHours() && hour < slot.timeBlock.endTime.getHours())[0];
}

// Used to remove all tutor available hours that have a conflict with what the tutee has already booked. This makes sure that the conflicted
// slots don't show on the weekly schedule
export function removeSlotConflict(tutorAvailableHours, tuteeAppointments) {
    for (let i = 0; i < tuteeAppointments.length; i++) {
        for (let j = 0; j < tutorAvailableHours.length; j++) {
            // Check if the two slots fall on the same exact date
            if (tuteeAppointments[i].timeBlock.startTime.getFullYear() === tutorAvailableHours[j].timeBlock.startTime.getFullYear() &&
                tuteeAppointments[i].timeBlock.startTime.getMonth() === tutorAvailableHours[j].timeBlock.startTime.getMonth() &&
                tuteeAppointments[i].timeBlock.startTime.getDate() === tutorAvailableHours[j].timeBlock.startTime.getDate()) {
                if (checkIfAppointmentsConflict(tuteeAppointments[i].timeBlock.startTime.getHours(), tuteeAppointments[i].timeBlock.endTime.getHours(),
                    tutorAvailableHours[j].timeBlock.startTime.getHours(), tutorAvailableHours[j].timeBlock.endTime.getHours())) {
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
            ...dateStrings[i], timeBlock: {
                startTime: new Date(dateStrings[i].timeBlock.startTime), endTime: new Date(dateStrings[i].timeBlock.endTime)
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
    openHours.sort((timeSlot1, timeSlot2) => timeSlot1.timeBlock.startTime.getTime() - timeSlot2.timeBlock.startTime.getTime());
    for (let i = 0; i < openHours.length - 1; i++) {
        if (openHours[i].timeBlock.startTime.getFullYear() === openHours[i + 1].timeBlock.startTime.getFullYear() &&
            openHours[i].timeBlock.startTime.getMonth() === openHours[i + 1].timeBlock.startTime.getMonth() &&
            openHours[i].timeBlock.startTime.getDate() === openHours[i + 1].timeBlock.startTime.getDate()
            && openHours[i].timeBlock.endTime.getHours() === openHours[i + 1].timeBlock.startTime.getHours()) {
            openHours[i + 1].timeBlock.startTime.setHours(openHours[i].timeBlock.startTime.getHours());
            openHours.splice(i, 1);
            i--; // Need to go back one index so we don't skip the newly joined time slot
        }
    }
}