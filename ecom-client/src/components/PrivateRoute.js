import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { Context as AuthContext } from "../context/AuthContext";
import useAuth from "../hooks/useAuth";

const PrivateRoute = ({ children, requires, redirect, ...rest }) => {
  const {
    state: { isAuthenticated }
  } = useContext(AuthContext);
  const { hasPermissions } = useAuth();
  const isAllowed = requires
    ? isAuthenticated && hasPermissions(requires)
    : isAuthenticated;
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAllowed ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: redirect || "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
