import {store} from './store/configureStore';
import {USER_LOGGED_IN, TOKEN_ACQUIRED} from './store/profileReducer';
     
fetch("/api/auth", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        email:"cguiettr@examiner.com",
        password: "ly2Efl2C"
    })
})
.then( response => response.json() )
.then( responseToken => {
    // store.dispatch({type: TOKEN_ACQUIRED, payload: responseToken})
    fetch("/api/tutors/me", {
        method: "GET",
        headers: {"x-auth-token": responseToken.token},
    })
    .then( response => response.json() )
    .then( user => {
        console.log("Current user:", user);
        store.dispatch({type: USER_LOGGED_IN, payload: user})} );
});

// Initial Global State 
const initialState = {
    user: { // The person currently logged in (can be either a tutor or tutee)
        availableHours: [],
        appointments: []
    },  
    viewedTutor: {}, // The tutor the tutee is currently viewing in detail, not applicable if the user is a tutor
    tutorSearchList: [], // List containing all the tutors currently displayed in the search list
}

export default initialState;

