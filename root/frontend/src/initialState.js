import { favTutors } from './testData.js';
import {store} from './store/configureStore';
import {USER_LOGGED_IN} from './store/profileReducer';

fetch("/api/auth", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        email:"emapplebeck2@google.pl",
        password: "4Qfq6Amw"
    })
})
.then( response => response.json() )
.then( responseToken => {
    fetch("/api/tutors/me", {
        method: "GET",
        headers: {"x-auth-token": responseToken.token},
    })
    .then( response => response.json() )
    .then( user => {
        user.appointments = [
            {
                time : {
                start: new Date(2020, 4, 23, 2),
                end: new Date(2020, 4, 23, 5)
            }},
            {
                time : {
                start: new Date(2020, 4, 28, 6),
                end: new Date(2020, 4, 28, 8)
            }},
           { 
               time : {
                start: new Date(2020, 3, 23, 4),
                end: new Date(2020, 3, 23, 5)
            }}
        ];
        user.availableHours.push(new Date(2020, 1, 10, 6), new Date(2020, 2, 10, 6), new Date(2020, 3, 10, 6), new Date(2020, 3, 12, 6));
        user.user.type = "tutor"; // This is not defined so for now I will define it
        user.imgPath = "https://i.ya-webdesign.com/images/default-image-png-1.png"; // Default profile pic since none are supplied right now
        console.log("Current user:", user);
        // console.log(new Date(user.availableHours[0]).getHours());
        store.dispatch({type: USER_LOGGED_IN, payload: user})} );
});

// Initial Global State 
const initialState = {
    user: {  // The person currently logged in (can be either a tutor or tutee)
        type: "tutor",
        firstName: "Bob",
        lastName: "Smith",
        imgPath: "https://www.yourdictionary.com/images/definitions/lg/9816.man.jpg",
        about: "Looking to learn all there is about web development",
        social: {
            facebook: 'https://www.facebook.com/zuck',
            twitter: 'https://twitter.com/random?lang=en',
            linkedIn: 'https://www.linkedin.com/in/raad-sweidan/',
            instagram: "https://www.instagram.com/random/",
            youtube: "https://www.youtube.com/user/PewDiePie/"
        },
        courses: ["JavaScript", "Spanish"],
        languages: ["English", "French"],
        location: "Ottawa",
        favoriteTutors: favTutors,
        appointments: [
            {
                tutorID: "Emrah Kinay",
                timeBlock: {
                    startTime: new Date(2020, 4, 13, 2),
                    endTime: new Date(2020, 4, 13, 6)
                },
                subject: "Java",
                note: "Help with assignment"
            },
            {
                tutorID: "Ra'ad Sweidan",
                timeBlock: {
                    startTime: new Date(2020, 4, 15, 2),
                    endTime: new Date(2020, 4, 15, 4)
                },
                subject: "Python",
                note: "Need to go over loops"
            },
            {
                tutorID: "Emrah Kinay",
                timeBlock: {
                    startTime: new Date(2020, 4, 11, 6),
                    endTime: new Date(2020, 4, 11, 7)
                },
                subject: "Java",
                note: "Some theory before my midterm"
            }
        ],
        availableHours: [
            // {start: new Date(2020, 4, 11, 6)},
        ]
    },
    viewedTutor: {}, // The tutor the tutee is currently viewing in detail, not applicable if the user is a tutor
    tutorSearchList: [], // List containing all the tutors currently displayed in the search list
    startOfWeek: {} // Reference to the current week used 
}

export default initialState;