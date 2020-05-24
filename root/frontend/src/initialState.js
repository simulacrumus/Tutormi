import { store } from './store/configureStore';
import { USER_LOGGED_IN, TOKEN_ACQUIRED } from './store/user/userActions';

fetch("/api/auth", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        email: "cguiettr@examiner.com",
        password: "ly2Efl2C"
    })
})
    .then(response => response.json())
    .then(responseToken => {
        store.dispatch({ type: TOKEN_ACQUIRED, payload: responseToken.token })
        fetch("/api/tutors/me", {
            method: "GET",
            headers: { "x-auth-token": responseToken.token },
        })
            .then(response => response.json())
            .then(user => {
                user.user.type = "tutee";
                console.log("Current user:", user);
                store.dispatch({ type: USER_LOGGED_IN, payload: user })
            });
    });

// Initial Global State 
const initialState = {
    user: { // The person currently logged in (can be either a tutor or tutee)
        availableHours: [],
        appointments: []
    },
    token: null // Token used to make API calls
}

export default initialState;
