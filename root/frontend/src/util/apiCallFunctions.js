import { store } from "../store/configureStore";

export async function saveAppointment(appointment) {

    let response = await fetch("api/appointments", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-auth-token": store.getState().user.token
        },
        body: JSON.stringify(appointment)
    });

    response = await response.json();
    return response;
}

export async function deleteAppointment(appointmentId) {
    let response = await fetch(`api/appointments/${appointmentId}`, {
        method: "DELETE",
        headers: {
            "x-auth-token": store.getState().user.token
        }
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
        method: 'POST',
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

export async function addUser() {
    let updateResponse = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: "hi",
            email: "hi@hi.com",
            password: "haajJkkzkxkxkxkxk",
            type: "tutor"
        }),
    });

    console.log(updateResponse);
    updateResponse = await updateResponse.json();
    console.log(updateResponse);
    return updateResponse;
}