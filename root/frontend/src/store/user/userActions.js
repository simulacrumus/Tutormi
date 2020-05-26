import { store } from '../configureStore';

// General user actions
export const USER_LOGGED_IN = "USER_LOGGED_IN";
export const TOKEN_ACQUIRED = "TOKEN_ACQUIRED";
export const USER_INFO_UPDATED = "USER_INFO_UPDATED";
// Schedule specific actions
export const AVAILABILITY_OPENED = "AVAILABILITY_OPENED";
export const AVAILABILITY_CANCELED = "AVAILABILITY_CANCELED";
export const APPOINTMENT_BOOKED = "APPOINTMENT_BOOKED";
export const APPOINTMENT_CANCELED = "APPOINTMENT_CANCELED";

export async function updateUser(updateInfo) {
    await store.dispatch({
        type: USER_INFO_UPDATED,
        payload: updateInfo
    });

    fetch("/api/tutors", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-auth-token": store.getState().userReducer.token
        },
        body: JSON.stringify(updateInfo)
    }).then((response) => response.json()).then((updatedUser) => console.log(updatedUser));
}

export function openAvailabilityHour(availabilityDate) {
    store.dispatch({
        type: AVAILABILITY_OPENED,
        payload: availabilityDate
    });
}

export function bookAppointment(tutorId, time, subject, note) {
    store.dispatch({
        type: APPOINTMENT_BOOKED,
        payload: {
            tutorID: tutorId,
            time: {
                start: time.start,
                end: time.end
            },
            subject: subject,
            note: note
        }
    });
}

export async function logInUser() { // Give this function a username and password paramter later
    fetch("/api/auth", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: "cguiettr@examiner.com",
            password: "ly2Efl2C"
        })
    })
        .then(response => response.json())
        .then(responseToken => {
            store.dispatch({ type: TOKEN_ACQUIRED, payload: responseToken.token })
            fetch("/api/tutors/me", {
                method: "GET",
                headers: { "x-auth-token": responseToken.token },
            })
                .then(response => response.json())
                .then(user => {
                    store.dispatch({ type: USER_LOGGED_IN, payload: user })
                });
        });
}