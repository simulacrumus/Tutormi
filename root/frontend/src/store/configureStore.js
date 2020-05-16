import { createStore } from "redux";
import rootReducer from "./rootReducer";

// Global State
const initialState = {
  user: {}, // The person currently logged in (can be either a tutor or tutee)
  viewedTutor: {}, // The tutor the tutee is currently viewing in detail, not applicable if the user is a tutor
  tutorSearchList: [], // List containing all the tutors currently displayed in the search list
};

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
); //connects our app to Redux DevTools extension

export default store;
