import createDataContext from './createDataContext';
import axios from 'axios';
import { serverURL, sessionAuth } from '../api';

const userReducer = (state, action) => {
  switch (action.type) {
    case 'create_user':
      console.log([...state, action.payload]);
      return [...state, action.payload];
    case 'batch_create_users':
      return [...state, ...action.payload];
    case 'remove_user':
      return state.filter(user => user.id !== action.payload);
    case 'get_all_users':
      return action.payload;
    default:
      return state;
  }
};

const getAllUsers = dispatch => {
  return async () => {
    const response = await axios.get(`${serverURL}/user`, {
      headers: sessionAuth(),
    });
    dispatch({ type: 'get_all_users', payload: response.data });
  };
};

const addNewUser = dispatch => {
  return async userObject => {
    const response = await axios.post(`${serverURL}/user/new`, userObject, { headers: sessionAuth() });
    dispatch({ type: 'create_user', payload: userObject });
  };
};

const addManyUsers = dispatch => {
  return async usersArray => {
    const response = await axios.post(`${serverURL}/user/new/batch`, usersArray, { headers: sessionAuth() });
    dispatch({ type: 'batch_create_users', payload: usersArray });
  };
};

const updateUser = dispatch => {
  return async (userObject, data) => {
    console.log(userObject, data);
    const response = await axios.put(
      `${serverURL}/user/${userObject.id}`,
      { userObject },
      { headers: sessionAuth() }
    );
    dispatch({ type: 'update_user', payload: userObject });
  };
};

const removeUser = dispatch => {
  return userID => {
    dispatch({ type: 'remove_user', payload: userID });
  };
};

export const { Context, Provider } = createDataContext(
  userReducer,
  { getAllUsers, addNewUser, addManyUsers, updateUser, removeUser },
  []
);
