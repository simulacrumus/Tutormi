import { store } from './store/configureStore';
import { USER_LOGGED_IN, TOKEN_ACQUIRED } from './store/user/userActions';

// Tutors
// let testPerson = {
//     email: "msanter7@biblegateway.com",
//     password: "TTaszczMlSnf"
// };
let testPerson = {
    email: "mrockh@dedecms.com",
    password: "vZt4Kr"
};

//Tutee
// let testPerson = {
//     email: "qhave1@nydailynews.com",
//     password: "K6SQANk9IZds"
// };

fetch("/api/auth", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(testPerson)
})
    .then(response => response.json())
    .then(responseToken => {
        console.log(responseToken.token)

        store.dispatch({ type: TOKEN_ACQUIRED, payload: responseToken.token })
        fetch("/api/tutors/me", {
            method: "GET",
            headers: { "x-auth-token": responseToken.token },
        })
            .then(response => response.json())
            .then(user => {
                // user.user.type = "tutee"
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
    tempBooking: [], // Stores hours while tutor is choosing hours for their appointment
    token: null // Token used to make API calls
}

export default initialState;
