import { store } from "../configureStore";

// General user actions
export const USER_LOGGED_IN = "USER_LOGGED_IN";
export const TOKEN_ACQUIRED = "TOKEN_ACQUIRED";
export const USER_INFO_UPDATED = "USER_INFO_UPDATED";
// Schedule specific actions
export const AVAILABILITY_OPENED = "AVAILABILITY_OPENED";
export const AVAILABILITY_CANCELED = "AVAILABILITY_CANCELED";
export const APPOINTMENT_BOOKED = "APPOINTMENT_BOOKED";
export const APPOINTMENT_CANCELED = "APPOINTMENT_CANCELED";
export const TUTEE_CHOSE_ONE_APPOINTMENT_HOUR = "TUTEE_CHOSE_ONE_APPOINTMENT_HOUR";
export const TEMP_LIST_CLEARED = "TEMP_LIST_CLEARED";
export const TEMP_HOUR_REMOVED = "TEMP_HOUR_REMOVED";

export function clearList() {
    store.dispatch({
        type: TEMP_LIST_CLEARED
    })
}

export async function updateUser(updateInfo) {
  await store.dispatch({
    type: USER_INFO_UPDATED,
    payload: updateInfo,
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

export function addTemporaryBookingHour(temporaryHour) {
    store.dispatch({
        type: TUTEE_CHOSE_ONE_APPOINTMENT_HOUR,
        payload: temporaryHour
    });
}

export function removeTemporaryBookingHour(temporaryHour) {
    store.dispatch({
        type: TEMP_HOUR_REMOVED,
        payload: temporaryHour
    });

}

export function openAvailabilityHour(availabilityDate) {
  store.dispatch({
    type: AVAILABILITY_OPENED,
    payload: availabilityDate,
  });
}


export function bookAppointment(appointment) {
    store.dispatch({
        type: APPOINTMENT_BOOKED,
        payload: appointment
    });
}

export async function logInUser(email, password) {
  // Give this function a username and password paramter later
  fetch("/api/auth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  })
    .then((response) => {
      console.log(response);
      return response.json();
    })
    .then((responseToken) => {
      console.log(responseToken);
      store.dispatch({ type: TOKEN_ACQUIRED, payload: responseToken.token });
      //   fetch("/api/tutors/me", {
      //     method: "GET",
      //     headers: { "x-auth-token": responseToken.token },
      //   })
      //     .then((response) => response.json())
      //     .then((user) => {
      //       store.dispatch({ type: USER_LOGGED_IN, payload: user });
      //     });
    });
}
