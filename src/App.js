import React from "react";
import { Link, Route, Switch } from "react-router-dom";
import Home from "./Components/Home";
import Register from "./Components/Register";
import Dashboard from "./Components/Dashboard";

const App = () => {
  return (
    <>
      <nav className="navbar sticky-top navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            <ul className="navbar-nav mr-auto">
              <li className="nav-brand">
                <Link className="nav-link" to="/home">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register">
                  Register
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <Switch>
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/register" component={Register} />
        <Route path="/" component={Home} />
      </Switch>
    </>
  );
};

export default App;
