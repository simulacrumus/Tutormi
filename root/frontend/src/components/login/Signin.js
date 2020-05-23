import React from "react";


export default function login(email, password) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password }), // add a type, declare enum: tutor, tutee, admin
    };

    fetch("/api/auth", requestOptions)
      .then((res) => res.json())
      .then((user) => {
        console.log("Here we have a user: " + user);
        console.log("this is the token: " + user.token);

    //     fetch("/api/tutors/me", {
    //       method: "GET",
    //       headers: { "x-auth-token": user.token },
    //     })
    //       .then((res) => res.json())
    //       .then((user1) => {
    //         console.log(user1);
    //       });
       });
  }

