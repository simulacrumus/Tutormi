import { store } from "../configureStore";
import { cancelViewedTutorAppointment } from "../viewed-tutor/viewedTutorActions";
import { isViewedTutorSet } from "../../util/authenticationFunctions";

// General user actions
export const USER_LOGGED_IN = "USER_LOGGED_IN";
export const USER_INFO_UPDATED = "USER_INFO_UPDATED";
export const USER_LOGGED_OUT = "USER_LOGGED_OUT";
export const USER_CREATED_ACCOUNT = "USER_CREATED_ACCOUNT";
// Schedule specific actions
export const AVAILABILITY_OPENED = "AVAILABILITY_OPENED";
export const AVAILABILITY_CANCELED = "AVAILABILITY_CANCELED";
export const APPOINTMENT_BOOKED = "APPOINTMENT_BOOKED";
export const APPOINTMENT_CANCELED = "APPOINTMENT_CANCELED";

export async function createAccount(name, email, password, type) {
  let authResponse = await fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
      email: email,
      password: password,
      type: type,
    }),
  });

  let user = "";
  //confim with the email first

  // const responseToken = await authResponse.json();
  // // Can check and deal with the authorization response here
  // if (userType === "tutor") {
  //   let userResponse = await fetch("/api/tutors/me", {
  //     method: "GET",
  //     headers: { "x-auth-token": responseToken.token },
  //   });

  //   user = await userResponse.json();

  //   console.log(typeof user);
  //   console.log(user);
  // } else {
  //   let userResponse = await fetch("/api/tutees/me", {
  //     method: "GET",
  //     headers: { "x-auth-token": responseToken.token },
  //   });

  //   user = await userResponse.json();
  //   console.log(typeof user);
  //   console.log(user);
  // }

  // let message = "";
  // message = user.msg;
  // console.log("message is type of", typeof message);

  // // Only update the store if everything was ok
  // if (!message) {
  //   user.user.type = userType;
  //   store.dispatch({
  //     type: USER_LOGGED_IN,
  //     payload: { user: user, token: responseToken.token },
  //   });
  //   return false;
  // }
  // return message;
}

export async function logInUser(email, password, userType) {
  let authResponse = await fetch("/api/auth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });

  let user = "";
  const responseToken = await authResponse.json();
  // Can check and deal with the authorization response here
  if (userType === "tutor") {
    let userResponse = await fetch("/api/tutors/me", {
      method: "GET",
      headers: { "x-auth-token": responseToken.token },
    });

    user = await userResponse.json();

    console.log(typeof user);
    console.log(user);
  } else {
    let userResponse = await fetch("/api/tutees/me", {
      method: "GET",
      headers: { "x-auth-token": responseToken.token },
    });

    user = await userResponse.json();
    console.log(typeof user);
    console.log(user);
  }

  let message = "";
  message = user.msg;
  console.log("message is type of", typeof message);

  // Only update the store if everything was ok
  if (!message) {
    user.user.type = userType;
    store.dispatch({
      type: USER_LOGGED_IN,
      payload: { user: user, token: responseToken.token },
    });
    return false;
  }
  return message;
}

export function logout() {
  store.dispatch({ type: USER_LOGGED_OUT });
}

export function cancelAppointment(appointment) {
  store.dispatch({
    type: APPOINTMENT_CANCELED,
    payload: appointment,
  });

  if (isViewedTutorSet())
    // Clear the viewed tutor appointment to keep page responsive
    cancelViewedTutorAppointment(appointment);
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
      "x-auth-token": store.getState().userReducer.token,
    },
    body: JSON.stringify(updateInfo),
  })
    .then((response) => response.json())
    .then((updatedUser) => console.log(updatedUser));
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
    payload: appointment,
  });
}
