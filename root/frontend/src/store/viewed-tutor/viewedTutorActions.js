import { store } from '../configureStore';
import { convertTimeSlotToSingleHours } from "../../util/scheduleFunctions";

export const VIEWED_TUTOR_SET = "VIEWED_TUTOR_SET";
export const VIEWED_TUTOR_CLEARED = "VIEWED_TUTOR_CLEARED";
export const VIEWED_TUTOR_AVAILABILITY_UPDATED = "VIEWED_TUTOR_AVAILABILITY_UPDATED";
export const VIEWED_TUTOR_APPOINTMENT_BOOKED = "VIEWED_TUTOR_APPOINTMENT_BOOKED";
export const VIEWED_TUTOR_APPOINTMENT_CANCELED = "VIEWED_TUTOR_APPOINTMENT_CANCELED";

export async function setViewedTutor(id) {
    let response = await fetch(`/api/tutors/user/${id}`, {
        method: "GET"
    });

    let viewedTutor = await response.json();
    viewedTutor.profilePic = viewedTutor.profilePic === undefined ? "default-profile-pic.png" : viewedTutor.profilePic; // Give a default profile pic to viewed tutors without one
    store.dispatch({ type: VIEWED_TUTOR_SET, payload: viewedTutor });
}

export function clearViewedTutor() {
    store.dispatch({ type: VIEWED_TUTOR_CLEARED })
}

export function cancelViewedTutorAppointment(appointment) {
    store.dispatch({
        type: VIEWED_TUTOR_APPOINTMENT_CANCELED,
        payload: appointment
    });
}

export function updateViewedTutorSchedule(appointment) {
    store.dispatch({
        type: VIEWED_TUTOR_AVAILABILITY_UPDATED,
        payload: convertTimeSlotToSingleHours(appointment)
    });

    store.dispatch({
        type: VIEWED_TUTOR_APPOINTMENT_BOOKED,
        payload: appointment
    });
}