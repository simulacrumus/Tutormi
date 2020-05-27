import { store } from '../configureStore';
import { convertTimeSlotToSingleHours } from "../../util/scheduleFunctions";

export const VIEWED_TUTOR_SET = "VIEWED_TUTOR_SET";
export const VIEWED_TUTOR_CLEARED = "VIEWED_TUTOR_CLEARED";
export const VIEWED_TUTOR_AVAILABILITY_UPDATED = "VIEWED_TUTOR_AVAILABILITY_UPDATED";
export const VIEWED_TUTOR_APPOINTMENT_BOOKED = "VIEWED_TUTOR_APPOINTMENT_BOOKED";
export const VIEWED_TUTOR_APPOINTMENT_CANCELED = "VIEWED_TUTOR_APPOINTMENT_CANCELED";

export async function setViewedTutor(id) {
    fetch(`/api/tutors/user/${id}`, {
        method: "GET"
    })
        .then(response => response.json())
        .then(viewedTutor => {
            store.dispatch({ type: VIEWED_TUTOR_SET, payload: viewedTutor });
        })
        .then(() => window.location.href = "/viewTutor"); // This should not always relocate, fix it later
}

export function clearViewedTutor() {
    store.dispatch({ type: VIEWED_TUTOR_CLEARED })
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