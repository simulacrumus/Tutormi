import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
// Page components
import ProfilePage from "./pages/profile/ProfilePage.js";
import DashboardPage from "./pages/dashboard/DashboardPage";
import ViewTutorPage from "./pages/view-tutor/ViewTutorPage";
import ViewTuteePage from "./pages/view-tutee/ViewTuteePage";
import HomePage from "./pages/home/HomePage";
import LogoutPage from "./pages/logout/LogoutPage";
import CreateProfilePage from "./pages/create-profile/CreateProfilePage";
import EmailConfirmationPage from "./pages/create-profile/EmailConfirmationPage";
import SearchMain from "./pages/search/SearchMain";
import Login from "./components/login/Login";
import SignUp from "./components/login/SignUp";

import {
  isLoggedIn, isTutee, isViewedTutorSet, isProfileSetUp, isViewedTuteeSet, validateToken
} from "./util/authenticationFunctions";

export default class Router extends Component {
  render() {
    return (
      <main>
        <Switch>
          <Route path="/" component={HomePage} exact />
          <Route path="/logout" component={LogoutPage} exact />


          <Route path="/login" render={() => {
            if (isLoggedIn())
              return !isProfileSetUp() ? <Redirect to="/createProfile" /> : <Redirect to="/profile" />;
            else
              return <Login />;
          }} />

          <Route path="/signup" exact render={() => {
            if (isLoggedIn())
              return !isProfileSetUp() ? <Redirect to="/createProfile" /> : <Redirect to="/profile" />;
            else
              return <SignUp />;
          }} />

          <Route path="/emailConfirmation" component={EmailConfirmationPage} exact />

          <Route path="/createProfile" exact render={() => {

            if (isLoggedIn())
              return !isProfileSetUp() ? <CreateProfilePage /> : <Redirect to="/profile" />;
            else
              return <Redirect to="/login" />;
          }} />

          <Route path="/profile" exact
            render={() => {
              if (isLoggedIn())
                return !isProfileSetUp() ? (
                  <Redirect to="/createProfile" />
                ) : (
                    <ProfilePage />
                  );
              else return <Login />;
            }}
          />
          <Route
            path="/signup"
            exact
            render={() => {
              if (isLoggedIn())
                return !isProfileSetUp() ? (
                  <Redirect to="/createProfile" />
                ) : (
                    <Redirect to="/profile" />
                  );
              else return <SignUp />;
            }}
          />
          <Route
            path="/emailConfirmation"
            component={EmailConfirmationPage}
            exact
          />
          <Route
            path="/createProfile"
            exact
            render={() => {
              if (isLoggedIn())
                return !isProfileSetUp() ? (
                  <CreateProfilePage />
                ) : (
                    <Redirect to="/profile" />
                  );
              else return <Redirect to="/login" />;
            }}
          />
          <Route
            path="/profile"
            exact
            render={() => {
              if (isLoggedIn())
                return isProfileSetUp() ? (
                  <ProfilePage />
                ) : (
                    <Redirect to="/createProfile" />
                  );
              else return <Redirect to="/login" />;
            }}
          />
          <Route
            path="/dashboard"
            exact
            render={() => {
              if (isLoggedIn())
                return isProfileSetUp() ? (
                  <DashboardPage />
                ) : (
                    <Redirect to="/createProfile" />
                  );
              else return <Redirect to="/login" />;
            }}
          />
          <Route
            path="/viewTutee"
            exact
            render={() => {
              if (!isLoggedIn()) return <Redirect to="/login" />;
              else if (isProfileSetUp())
                return isViewedTuteeSet() ? (
                  <ViewTuteePage />
                ) : (
                    <Redirect to="/dashboard" />
                  );
              else return <Redirect to="/createProfile" />;
            }}
          />
          <Route
            path="/viewTutor"
            exact
            render={() => {
              if (!isLoggedIn()) return <Redirect to="/login" />;
              else if (isProfileSetUp())
                return isViewedTutorSet() ? (
                  <ViewTutorPage />
                ) : (
                    <Redirect to="/dashboard" />
                  );
              else return <Redirect to="/createProfile" />;
            }}
          />
          <Route
            path="/search"
            render={() => {
              if (!isLoggedIn()) return <Redirect to="/login" />;
              else if (isProfileSetUp())
                return isTutee() ? <SearchMain /> : <Redirect to="/profile" />;
              else return <Redirect to="/createProfile" />;
            }}
          />
          <Route path="*" render={() => <h1>404 Page Not Found!</h1>} />{" "}
        </Switch>
      </main>
    );
  }
  componentDidMount() {
    if (isLoggedIn()) // On each page refresh if a user is logged in their token will be checked and validated
      setInterval(validateToken, 60000); // Token is continuously checked over a set time interval
  }

}
