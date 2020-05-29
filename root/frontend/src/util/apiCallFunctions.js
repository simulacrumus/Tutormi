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