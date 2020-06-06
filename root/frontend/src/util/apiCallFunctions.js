import { store } from "../store/configureStore";
import { USER_LOGGED_IN } from "../store/user/userActions";

export async function saveAppointment(appointment) {
  let response = await fetch("api/appointments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": store.getState().user.token,
    },
    body: JSON.stringify(appointment),
  });

  response = await response.json();
  return response;
}

export async function deleteAppointment(appointmentId) {
  let response = await fetch(`api/appointments/${appointmentId}`, {
    method: "DELETE",
    headers: {
      "x-auth-token": store.getState().user.token,
    },
  });

  response = await response.json(); // Add response notification later
}

export async function saveTutorAvailableHours(availableHours) {
  fetch("/api/tutors/schedule", {
    method: "POST",
    headers: {
      "X-Auth-Token": store.getState().user.token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(availableHours),
  });
}

export async function uploadProfilePicture(imageFile) {
  let formData = new FormData();
  formData.append("image", imageFile);

  let uploadResponse = await fetch("/api/tutors/profile-pic", {
    method: "POST",
    headers: { "x-auth-token": store.getState().user.token },
    body: formData,
  });

  uploadResponse = await uploadResponse.json();
  return uploadResponse.profilePic;
}

export async function updateUserInformation(updateInfo) {
  let updateResponse = await fetch("/api/tutors", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": store.getState().user.token,
    },
    body: JSON.stringify(updateInfo),
  });

  updateResponse = await updateResponse.json();

  return updateResponse;
}

export async function createAccount(name, email, password, type) {
  console.log(typeof name, typeof email, typeof password, typeof type);
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
  console.log(
    JSON.stringify({
      name: name,
      email: email,
      password: password,
      type: type,
    })
  );
  console.log(authResponse);
  authResponse = await authResponse.json();
  console.log(authResponse);
  let message = "";
  return (message = authResponse.msg);
}

export async function updateTuteeFavorites(tutorId, shouldAdd) {
  let response = await fetch(`api/tutees/favorites/${tutorId}`, {
    method: (shouldAdd ? "PUT" : "DELETE"),
    headers: {
      "x-auth-token": store.getState().user.token,
    },
  });
  response = await response.json();
  return response;
}

export async function logIn(token, userType) {
  let apiRoute = userType === "tutor" ? "/api/tutors/me" : "/api/tutees/me";

  // Can check and deal with the authorization response here
  let userResponse = await fetch(apiRoute, {
    method: "GET",
    headers: { "x-auth-token": token },
  });

  let user = await userResponse.json();

  user.user.type = userType;
  user.profilePic = user.profilePic === undefined ? "default-profile-pic.png" : user.profilePic; // Give a default profile pic to users without one
  store.dispatch({
    type: USER_LOGGED_IN,
    payload: { user: user, token: token },
  });

  return user;
}