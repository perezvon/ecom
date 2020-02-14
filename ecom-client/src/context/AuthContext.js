import createDataContext from "./createDataContext";
import axios from "axios";
import { serverURL } from '../api';

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
    console.log('userData', userData)
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
    dispatch({ type: "login", payload: { ...response.data, isAuthenticated: true } });
  }
    else dispatch({ type: "login", payload: { isAuthenticated: false } });
  };
};

const updateUserData = dispatch => {
  return async (user, data) => {
    const parsedData = {};
    const splitName = data.name.split("::");
    const isSubObject = splitName.length > 1;
    let subvalue;
    if (isSubObject) {
      subvalue = splitName[0];
      parsedData[splitName[0]] = { [splitName[1]]: data.value };
    }
    const response = await axios.put(`${serverURL}/user/${user.userID}`);
    dispatch({ type: "update_data", subvalue, payload: parsedData });
  };
};

export const { Context, Provider } = createDataContext(
  authReducer,
  { doRegister, doLogin, doLogout, rehydrateAuth, updateUserData },
  {}
);
