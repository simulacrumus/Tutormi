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

class Router extends Component {
  render() {
    return (
      <main>
        <Switch>
          <Route path="/" component={ProfilePage} exact />
          <Route path="/profile" component={ProfilePage} exact />
          <Route path="/login" component={Login} exact />
          <Route
            path="/dashboard"
            render={() =>
              this.props.user.user.type === "tutee" ? (
                <DashboardPage />
              ) : (
                  <TutorDashboardPage />
                )
            }
          />
          <Route path="/viewTutor" component={TutorViewPage} />
          <Route
            path="/search"
            render={() =>
              this.props.user.user.type === "tutee" ? (
                <SearchMain />
              ) : (
                  <Redirect to="/dashboard" />
                )
            }
          />
          <Route path ="/login" component={Login} exact />
          <Route path="*" render={() => <h1>404 Page Not Found!</h1>} />{" "}
          {/* Need to make an error component later */}
        </Switch>
      </main>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.userReducer.user,
  };
}

export default connect(mapStateToProps)(Router);
