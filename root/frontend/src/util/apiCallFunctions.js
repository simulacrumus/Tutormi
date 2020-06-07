import { store } from "../store/configureStore";
import { userWithProfileLoggedIn, userWithoutProfileLoggedIn, addToken } from "../store/user/userActions";

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

export async function updateUserInformation(updateInfo, userType) {
  let apiRoute = userType === "tutor" ? "/api/tutors" : "/api/tutees";
  let updateResponse = await fetch(apiRoute, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": store.getState().user.token,
    },
    body: JSON.stringify(updateInfo),
  });

  updateResponse = await updateResponse.json();
  console.log(updateResponse);

  return updateResponse;
}

export async function changeForgottenPassword(email) {
  let authResponse = await fetch("/api/forgetpswd", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email
    }),
  });

  authResponse = await authResponse.json();

  return authResponse.errors === undefined ? false : authResponse.errors[0].msg;
}

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

  authResponse = await authResponse.json();

  return authResponse.errors === undefined ? false : authResponse.errors[0].msg;
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

export async function authenticateAndLoginUser(email, password, userType) {
  let authResponse = await fetch("/api/auth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
      type: userType
    }),
  });

  const status = authResponse.status;
  const responseToken = await authResponse.json();

  if (status === 200) { // Valid token is acquired
    addToken(responseToken.token);

    if (responseToken.hasProfile) {
      let user = await logIn(responseToken.token, userType);
      userWithProfileLoggedIn(user);
      return user.msg; // This will be false if there are no errors otherwise it will return the error message
    } else {
      userWithoutProfileLoggedIn(userType);
      return false;
    }
  } else {
    return responseToken.errors[0].message;
  }

}

export async function logIn(token, userType) {
  let apiRoute = userType === "tutor" ? "/api/tutors/me" : "/api/tutees/me";

  let userResponse = await fetch(apiRoute, {
    method: "GET",
    headers: { "x-auth-token": token },
  });

  let user = await userResponse.json();
  user.user.type = userType; // Set user type 
  // For now we do this check. When tutor DB is updated remove!
  user.profilePic = user.profilePic === undefined ? "default-profile-pic.png" : user.profilePic;
  return user;
}

export async function addRating(tutorId, rating) {
  let response = await fetch("api/ratings", {
    method: "POST",
    headers: { "x-auth-token": store.getState().user.token },
    body: JSON.stringify({
      tutorId: tutorId,
      rate: rating,
    })
  });

  console.log(JSON.stringify({
    tutorId: tutorId,
    rate: rating,
  }))

  console.log(response);
  response = await response.json();
  console.log(response);
}

export async function deleteUser(userType) {
  let apiRoute = userType === "tutor" ? "/api/tutors" : "/api/tutees";
  let response = await fetch(apiRoute, {
    method: "DELETE",
    headers: { "x-auth-token": store.getState().user.token }
  });

  response = await response.json();
}

export async function updateEmail(newEmail, password) {
  let response = await fetch("api/users/changeemail", {
    method: "POST",
    headers: { "x-auth-token": store.getState().user.token },
    body: JSON.stringify({
      email: newEmail,
      password: password,
    })
  });

  response = await response.json();
  console.log(response);
  return response;
}

export async function changePassword(currentPassword, newPassword) {
  let response = await fetch("api/users/changepassword", {
    method: "POST",
    headers: { "x-auth-token": store.getState().user.token },
    body: JSON.stringify({
      currentPassword: currentPassword,
      newPassword: newPassword,
    })
  });

  response = await response.json();
  console.log(response);
  return response;
}