import React, { Component } from "react";
import "./index.css";
import ProfilePage from "./pages/ProfilePage.js";
import DashboardPage from "./pages/DashboardPage.js";
import TutorViewPage from "./pages/TutorViewPage.js";
import { Route, Switch, Redirect } from "react-router-dom";
import SearchMain from "./components/SearchMain";
import TutorDashboardPage from "./pages/TutorDashboardPage.js";
import { connect } from "react-redux";
import Login from "./components/login/Login";
import SignUp from "./components/login/SignUp"
import { isLoggedIn, isTutee, isViewedTutorSet } from "./util/authenticationFunctions";

export default class Router extends Component {

  render() {
    return (
      <main>
        <Switch>
          <Route path="/" component={Login} exact />

          <Route path="/login" component={Login} exact />

          <Route path="/profile" exact
            render={() => {
              return isLoggedIn() ? <ProfilePage /> : <Redirect to="/login" />;
            }} />

          <Route path="/dashboard" exact
            render={() => {
              if (!isLoggedIn())
                return <Redirect to="/login" />;
              else
                return isTutee() ? <DashboardPage /> : <TutorDashboardPage />;

            }} />

          <Route path="/viewTutor" exact
            render={() => {
              if (!isLoggedIn())
                return <Redirect to="/login" />;
              else
                return isViewedTutorSet() ? <TutorViewPage /> : <Redirect to="/profile" />;

            }} />/>

          <Route
            path="/search"
            render={() => {
              if (!isLoggedIn())
                return <Redirect to="/login" />;
              else
                return isTutee() ? <SearchMain /> : <Redirect to="/profile" />;

            }} />

          <Route path="*" render={() => <h1>404 Page Not Found!</h1>} />{" "}
          {/* Need to make an error component later */}
        </Switch>
      </main>
    );
  }
}