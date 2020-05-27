import { store } from "../store/configureStore";

export const isLoggedIn = () => store.getState().userReducer.isLoggedIn;

export const isTutee = () => store.getState().userReducer.user.user.type === "tutee";

export const isViewedTutorSet = () => store.getState().viewedTutorReducer.viewedTutor !== null;