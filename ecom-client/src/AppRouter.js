import React, { useContext } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Context as AuthContext } from './context/AuthContext';
import StateLoader from './components/StateLoader';
import PrivateRoute from './components/PrivateRoute';
import AdminHome from './components/AdminHome';
import Uploader from './components/Uploader';
import LoginRegister from './components/LoginRegister';
import MainLandingPage from './pages/mainLanding';
import NotFoundPage from './pages/404';
import StorePage from './pages/store';
import InventoryPage from './pages/inventory';
import SettingsPage from './pages/settings';
import ShopRouter from './components/shop/ShopRouter';

const AppRouter = () => {
  const {
    state: { isAuthenticated, role },
  } = useContext(AuthContext);
  return (
    <Router>
      <StateLoader>
        <Switch>
          <Route path="/login">
            <LoginRegister />
          </Route>
          <Route path="/register">
            <LoginRegister />
          </Route>
          <Route path="/shop">
            <ShopRouter />
          </Route>
          <PrivateRoute exact path="/">
            <StateLoader type="admin">
              <AdminHome />
            </StateLoader>
          </PrivateRoute>
          <PrivateRoute path="/store">
            <StorePage />
          </PrivateRoute>
          <PrivateRoute path="/inventory">
            <InventoryPage />
          </PrivateRoute>
          <PrivateRoute exact path="/admin/home">
            <AdminHome />
          </PrivateRoute>
          <PrivateRoute exact path="/upload">
            <Uploader />
          </PrivateRoute>
          <PrivateRoute exact path="/settings">
            <SettingsPage />
          </PrivateRoute>
          <Route path="*">
            <NotFoundPage />
          </Route>
        </Switch>
      </StateLoader>
    </Router>
  );
};

export default AppRouter;
