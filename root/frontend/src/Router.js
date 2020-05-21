import React, { Component } from "react";
import "./index.css";
import ProfilePage from "./pages/ProfilePage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import TutorViewPage from "./pages/TutorViewPage.jsx";
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import searchMain from "./components/SearchMain";
import TutorDashboardPage from "./pages/TutorDashboardPage.jsx";
import { connect } from "react-redux";

class Router extends Component {
    render() {
      return (
        <main>
          <Switch>
            <Route path='/' component={ProfilePage} exact />
            <Route path="/dashboard" render={() => ( this.props.user.type === "tutee" ? <DashboardPage /> : <TutorDashboardPage />) }  />
            <Route path="/viewTutor" component={TutorViewPage} />
            <Route path="/search" component={searchMain}/>
            <Route path="*" render={() => (<h1>404 Page Not Found!</h1>)} /> {/* Need to make an error component later */}
          </Switch>
        </main>
      );
    }
  }
  
  function mapStateToProps(state) {
    return {
        user: state.profileReducer.user,
    };
  }
  
  export default connect(mapStateToProps)(Router);