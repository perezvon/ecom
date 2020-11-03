import createDataContext from "./createDataContext";
import axios from "axios";
import { serverURL, sessionAuth } from '../api';

const authReducer = (state, action) => {
  switch (action.type) {
    case "register":
    case "login":
      return action.payload;
    case "logout":
      return {};
    case "update_data":
      return {
        ...state,
        [action.subvalue]: {
          ...state[action.subvalue],
          ...action.payload[action.subvalue]
        }
      };
    default:
      return state;
  }
};

const doRegister = dispatch => {
  return async (userData) => {
    const response = await axios.post("http://localhost:3001/auth/register", userData);
    dispatch({ type: "register", payload: response.data });
  };
};

const doLogin = dispatch => {
  return async (userData) => {
    const response = await axios.post("http://localhost:3001/auth/login", userData);
    localStorage.setItem("sessionAuth", response.data.token);
    dispatch({ type: "login", payload: { ...response.data, isAuthenticated: true } });
  };
};

const doLogout = dispatch => {
  return async () => {
    const response = await axios.get("http://localhost:3001/auth/logout");
    localStorage.clear();
    dispatch({ type: "logout", payload: response.data });
  };
};

const rehydrateAuth = dispatch => {
  return async () => {
    const token = localStorage.getItem("sessionAuth");
    if (token) {
    const response = await axios.post(`${serverURL}/auth/restoreSession`, {}, { headers: {'Authorization': token}});
    dispatch({ type: "login", payload: { ...response.data, isAuthenticated: true, fromSession: true } });
  }
    else dispatch({ type: "login", payload: { isAuthenticated: false } });
  };
};

const updateUserData = dispatch => {
  return async (user, data) => {
    let subvalue = Object.keys(data)[0];
    const response = await axios.put(`${serverURL}/user`, data, {
      headers: sessionAuth()
    });
    dispatch({ type: "update_data", subvalue, payload: data });
  };
};

export const { Context, Provider } = createDataContext(
  authReducer,
  { doRegister, doLogin, doLogout, rehydrateAuth, updateUserData },
  {}
);
