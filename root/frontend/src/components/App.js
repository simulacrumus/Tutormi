import React from "react";

//import { LoginVeryfier } from "./LoginVeryfier";
import {
  BrowserRouter,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import MainNavigation from "./navigation/MainNavigation";
import Login from "./login/Login";
import SingUp from "../components/login/SignUp"

const App = () => {
  return (
    <BrowserRouter>
      <MainNavigation />
      <main className = "main-class-app">
        <Switch>
          <Route path="/" exact>
            <Login />
          </Route>
          <Route path="/components/login/SignUp.js" exact>
           <SingUp />
          </Route> 
          <Redirect to="/" />
        </Switch>
      </main>
    </BrowserRouter>
  );
};

export default App;
