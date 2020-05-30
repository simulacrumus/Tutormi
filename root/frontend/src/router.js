import React, { Component } from "react";
import ProfilePage from "./pages/ProfilePage.js";
import TuteeDashboardPage from "./pages/TuteeDashboardPage";
import ViewTutorPage from "./pages/ViewTutorPage";
import HomePage from "./pages/HomePage";
import { Route, Switch, Redirect } from "react-router-dom";
import SearchMain from "./components/SearchMain";
import TutorDashboardPage from "./pages/TutorDashboardPage.js";
import Login from "./components/login/Login";
import SignUp from "./components/login/SignUp"
import Flip from "./components/login/Login2"
import { isLoggedIn, isTutee, isViewedTutorSet } from "./util/authenticationFunctions";

export default class Router extends Component {

  render() {
    return (
      <main>
        <Switch>
          <Route path="/" component={HomePage} exact />

          <Route path="/login" component={Login} exact />
          <Route path="/signup" component={SignUp} exact />
          {/* flip route */}
          <Route path="/Flip" component={Flip} exact /> 

          <Route path="/profile" exact
            render={() => {
              return isLoggedIn() ? <ProfilePage /> : <Redirect to="/login" />;
            }} />

          <Route path="/dashboard" exact
            render={() => {
              if (!isLoggedIn())
                return <Redirect to="/login" />;
              else
                return isTutee() ? <TuteeDashboardPage /> : <TutorDashboardPage />;

            }} />

          <Route path="/viewTutor" exact
            render={() => {
              if (!isLoggedIn())
                return <Redirect to="/login" />;
              else
                return isViewedTutorSet() ? <ViewTutorPage /> : <Redirect to="/profile" />;

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