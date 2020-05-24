import { store } from '../configureStore';

export const VIEWED_TUTOR_SET = "VIEWED_TUTOR_SET";
export const VIEWED_TUTOR_CLEARED = "VIEWED_TUTOR_CLEARED";

export async function setViewedTutor(id) {
    fetch(`/api/tutors/user/${id}`, {
        method: "GET"
    })
        .then(response => response.json())
        .then(viewedTutor => {
            store.dispatch({ type: VIEWED_TUTOR_SET, payload: viewedTutor });
        })
        .then(() => window.location.href = "/viewTutor");
}