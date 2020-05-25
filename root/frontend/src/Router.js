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

class Router extends Component {

  isTutee = () => this.props.user.user.type === "tutee";
  isAuthenticated = () => this.props.token !== null && this.props.token !== undefined;

  render() {
    return (
      <main>
        <Switch>
          <Route path="/" component={Login} exact />

          <Route path="/login" component={Login} exact />

          <Route path="/profile" exact
            render={() => {
              return this.isAuthenticated() ? <ProfilePage /> : <Redirect to="/login" />;
            }} />

          <Route path="/dashboard" exact
            render={() => {
              if (!this.isAuthenticated())
                return <Redirect to="/login" />;
              else
                return this.isTutee() ? <DashboardPage /> : <TutorDashboardPage />;

            }} />

          <Route path="/viewTutor" exact component={TutorViewPage} />

          <Route
            path="/search"
            render={() => {
              if (!this.isAuthenticated())
                return <Redirect to="/login" />;
              else
                return this.isTutee() ? <SearchMain /> : <Redirect to="/profile" />;

            }} />

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
    token: state.userReducer.token
  };
}

export default connect(mapStateToProps)(Router);
