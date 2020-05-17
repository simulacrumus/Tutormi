import { favTutors } from './testData.js';

// Initial Global State 
const initialState = {
    user: {  // The person currently logged in (can be either a tutor or tutee)
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
            },
            // {
            //     tutorID: "Emrah Kinay",
            //     timeBlock: {
            //         startTime: new Date(2020, 4, 15, 1),
            //         endTime: new Date(2020, 4, 15, 2)
            //     },
            //     subject: "Java",
            //     note: "Some theory before my midterm"
            // }
        ]

    },
    viewedTutor: {}, // The tutor the tutee is currently viewing in detail, not applicable if the user is a tutor
    tutorSearchList: [] // List containing all the tutors currently displayed in the search list
}

export default initialState;