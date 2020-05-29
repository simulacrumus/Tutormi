import moment from "moment";

// Converts available hours to the format used with booked appointments
export function convertSingleHoursToTimeSlots(availableHours) {
  return availableHours.map((timeHour) => {
    let start = moment(timeHour);
    let end = start.clone().add(1, "hour");
    return {
      time: {
        start: start,
        end: end,
      },
    };
  });
}

export function convertTimeSlotToSingleHours(timeSlot) {
  let hours = [];
  let start = moment(timeSlot.time.start);
  let end = moment(timeSlot.time.end).hours() === 0 ? 24 : moment(timeSlot.time.end).hours();
  for (let i = 0, hour = moment(timeSlot.time.start).hours(); hour < end; i++, hour++)
    hours.push(start.clone().add(i, "hour"));

  return hours;
}

export function convertAppointmentsListToSingleHours(appointments) {
  let hours = [];
  appointments.forEach((appointments) => hours.push(...convertTimeSlotToSingleHours(appointments)));
  return hours;
}

// Used to remove all tutor available hours that have a conflict with what the tutee has already booked. This makes sure that the conflicted
// slots don't show on the weekly schedule
export function removeSlotConflict(tutorAvailableHours, tuteeAppointments) {
  for (let i = 0; i < tuteeAppointments.length; i++) {
    for (let j = 0; j < tutorAvailableHours.length; j++) {
      if (fallsOnSameDay(tuteeAppointments[i].time.start, tutorAvailableHours[j].time.start)) {
        if (checkIfAppointmentsConflict(tuteeAppointments[i].time.start.hours(), tuteeAppointments[i].time.end.hours(),
          tutorAvailableHours[j].time.start.hours(), tutorAvailableHours[j].time.end.hours())) {
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
      ...dateStrings[i],
      time: {
        start: moment(dateStrings[i].time.start),
        end: moment(dateStrings[i].time.end),
      },
    };
  }
  return dates;
}

// Checks if two 'lines' with start and end points intersect (appointments are essentially lines)
function checkIfAppointmentsConflict(start1, end1, start2, end2) {
  return ((start1 > start2 && start1 < end2) || (end1 > start2 && end1 < end2) || (start2 > start1 && start2 < end1)
    || (end2 > start1 && end2 < end1) || (start1 === start2 && end1 === end2) // Final condition checks if the lines overlap exactly
  );
}

export function combineSingleSlots(openHours) {
  openHours.sort((timeSlot1, timeSlot2) => timeSlot1.time.start.diff(timeSlot2.time.start)); // Need to sort first to compare adjacent hours

  for (let i = 0; i < openHours.length - 1; i++) {
    if (!(openHours[i].time.start.hours() === 23 && openHours[i].time.end.hours() === 0)) { // If its the last hour in the day it cant be joined
      if (fallsOnSameDay(openHours[i].time.start, openHours[i + 1].time.start)
        && openHours[i].time.end.hours() === openHours[i + 1].time.start.hours()) {
        openHours[i + 1].time.start.hours(openHours[i].time.start.hours());
        openHours.splice(i, 1);
        i--; // Need to go back one index so we don't skip the newly joined time slot
      }
    }
  }
}

export function calcTotalHours(hours, timePeriod) {
  let start = moment().startOf(timePeriod);
  let end = moment().endOf(timePeriod);
  return hours.filter((hour) => moment(hour).isAfter(start) && moment(hour).isBefore(end)).length;
}

export function calcTotalHoursPerMonth(hours, numberOfMonthsBack) {
  let start = moment().clone().startOf("month").subtract(numberOfMonthsBack, "month").startOf("month");
  let end = moment().clone().startOf("month").subtract(numberOfMonthsBack, "month").endOf("month");
  return hours.filter((hour) => moment(hour).isAfter(start) && moment(hour).isBefore(end)).length;
}

export function fallsOnSameDay(date1, date2) {
  return (date1.year() === date2.year()
    && date1.month() === date2.month()
    && date1.date() === date2.date());
}

export function displayHour12Format(hour) {
  return moment().set("minute", 0).set("hour", hour).format("hh:mm A");
}