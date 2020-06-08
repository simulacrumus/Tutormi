import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
// Page components
import ProfilePage from "./pages/profile/ProfilePage.js";
import DashboardPage from "./pages/dashboard/DashboardPage";
import ViewTutorPage from "./pages/view-tutor/ViewTutorPage";
import HomePage from "./pages/home/HomePage";
import CreateProfilePage from "./pages/create-profile/CreateProfilePage";
import EmailConfirmationPage from "./pages/create-profile/EmailConfirmationPage";
import SearchMain from "./components/SearchMain";
import Login from "./components/login/Login";
import SignUp from "./components/login/SignUp"

import { isLoggedIn, isTutee, isViewedTutorSet, isProfileSetUp } from "./util/authenticationFunctions";

export default class Router extends Component {

  render() {
    return (
      <main>
        <Switch>
          <Route path="/" component={HomePage} exact />

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
                return isProfileSetUp() ? <ProfilePage /> : <Redirect to="/createProfile" />;
              else
                return <Redirect to="/login" />;
            }} />

          <Route path="/dashboard" exact
            render={() => {
              if (isLoggedIn())
                return isProfileSetUp() ? <DashboardPage /> : <Redirect to="/createProfile" />;
              else
                return <Redirect to="/login" />;
            }} />

          <Route path="/viewTutor" exact
            render={() => {
              if (!isLoggedIn())
                return <Redirect to="/login" />;
              else if (isProfileSetUp())
                return isViewedTutorSet() ? <ViewTutorPage /> : <Redirect to="/profile" />;
              else
                return <Redirect to="/createProfile" />;
            }} />/>

          <Route
            path="/search"
            render={() => {
              if (!isLoggedIn())
                return <Redirect to="/login" />;
              else if (isProfileSetUp())
                return isTutee() ? <SearchMain /> : <Redirect to="/profile" />;
              else
                return <Redirect to="/createProfile" />;
            }} />

          <Route path="*" render={() => <h1>404 Page Not Found!</h1>} />{" "}
          {/* Need to make an error component later */}
        </Switch>
      </main>
    );
  }
}