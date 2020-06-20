import { store } from "../store/configureStore";
import { logout } from "../store/user/userActions";
import { checkTokenExpiry } from "./apiCallFunctions";

export const isLoggedIn = () => store.getState().user.isLoggedIn;

export async function validateToken() {
    let isTokenValid = await checkTokenExpiry();
    if (!isTokenValid)
        window.location.href = "/logout"; // Logout the user if the token is expired
}

export const isTutee = () => store.getState().user.user.user.type === "tutee";

export const isViewedTutorSet = () => store.getState().viewedTutor.viewedTutor !== null;

export const isViewedTuteeSet = () => store.getState().viewedTutee.viewedTutee !== null;

export const isProfileSetUp = () => store.getState().user.hasSetupUpProfile;