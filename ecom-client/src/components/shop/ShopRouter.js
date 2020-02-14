import React from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import PrivateRoute from "../PrivateRoute";
import ShopHome from "./ShopHome";
import Profile from "./Profile";
import Cart from "./Cart";
import ProductPage from "./ProductPage";
import Dashboard from "../managerPortal/Dashboard";
import LoginRegister from "../LoginRegister";

const ShopRouter = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}/:store/profile`}>
        <Profile />
      </Route>
      <Route path={`${path}/:store/cart`}>
        <Cart />
      </Route>
      <Route path={`${path}/:store/product/:id`}>
        <ProductPage />
      </Route>
      <Route path={`${path}/:store/login`}>
        <LoginRegister />
      </Route>
      <Route path={`${path}/:store/register`}>
        <LoginRegister />
      </Route>
      <PrivateRoute
        path={`${path}/:store/quartermaster`}
        requires={`quartermaster`}
        redirect={`${path}/:store/login`}
      >
        <Dashboard />
      </PrivateRoute>
      <Route path={path}>
        <ShopHome />
      </Route>
    </Switch>
  );
};

export default ShopRouter;
