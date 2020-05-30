import { store } from "../configureStore";
import { cancelViewedTutorAppointment } from "../viewed-tutor/viewedTutorActions";
import { isViewedTutorSet } from "../../util/authenticationFunctions";

// General user actions
export const USER_LOGGED_IN = "USER_LOGGED_IN";
export const USER_INFO_UPDATED = "USER_INFO_UPDATED";
export const USER_IMAGE_UPDATED = "USER_IMAGE_UPDATED";
export const USER_LOGGED_OUT = "USER_LOGGED_OUT";

// Schedule specific actions
export const AVAILABILITY_OPENED = "AVAILABILITY_OPENED";
export const AVAILABILITY_CANCELED = "AVAILABILITY_CANCELED";
export const APPOINTMENT_BOOKED = "APPOINTMENT_BOOKED";
export const APPOINTMENT_CANCELED = "APPOINTMENT_CANCELED";


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
    user.profilePic = user.profilePic === undefined ? "default-profile-pic.png" : user.profilePic; // Give a default profile pic to users without one
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

export function changeUserImage(profilePic) {
  store.dispatch({ type: USER_IMAGE_UPDATED, payload: profilePic });
}

export function cancelAppointment(appointment) {
  store.dispatch({
    type: APPOINTMENT_CANCELED,
    payload: appointment,
  });

  if (isViewedTutorSet() && store.getState().viewedTutor.viewedTutor._id === appointment.tutor.id)
    cancelViewedTutorAppointment(appointment); // Clear the viewed tutor appointment to keep page responsive
}

export async function updateUser(updateInfo) {
  await store.dispatch({
    type: USER_INFO_UPDATED,
    payload: updateInfo,
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
    payload: appointment,
  });
}
