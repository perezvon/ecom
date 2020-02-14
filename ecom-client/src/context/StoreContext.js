import createDataContext from './createDataContext';
import axios from 'axios';
import { serverURL, sessionAuth } from '../api';

const slugify = string => `/store?name=${string.replace(/\s/g, '_')}`;
const snakeCaseify = string => string.replace(/\s/g, '-');

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

const storeReducer = (state, action) => {
  switch (action.type) {
    case 'get_stores':
      return action.payload;
    case 'create_store':
      return [...state, action.payload];
    case 'update_store':
      const index = state.findIndex(store => store.id === action.payload.id);
      const newState = state.slice(0, index);
      newState.push(action.payload);
      return newState.concat(state.slice(index + 1));
    case 'remove_store':
      return state.filter(store => store.id !== action.payload);
    default:
      return state;
  }
};

const getStores = dispatch => {
  return async () => {
    const response = await axios.get(`${serverURL}/stores`);
    await asyncForEach(response.data, async store => {
      const { data: products } = await axios.get(
        `${serverURL}/products/${store.storeID}`
      );
      store.products = products;
    });
    dispatch({
      type: 'get_stores',
      payload: response.data.map(store => {
        return {
          ...store,
          slug: slugify(store.name),
          url: `/shop/${snakeCaseify(store.name)}`,
        };
      }),
    });
  };
};

const addNewStore = dispatch => {
  return async storeObject => {
    const response = await axios.post(`${serverURL}/stores/new`, storeObject, {
      headers: sessionAuth(),
    });
    if (response.status === 200)
      dispatch({ type: 'create_store', payload: storeObject });
    // else dispatch({ type: 'error', payload: 'Something went wrong and the store could not be created.' })
  };
};

const updateStore = dispatch => {
  return async storeObject => {
    const response = await axios.post(
      `${serverURL}/stores/${storeObject.storeID}`,
      storeObject,
      { headers: sessionAuth() }
    );
    if (response.status === 200)
      dispatch({ type: 'update_store', payload: storeObject });
  };
};

const removeStore = dispatch => {
  return storeID => {
    dispatch({ type: 'remove_store', payload: storeID });
  };
};

export const { Context, Provider } = createDataContext(
  storeReducer,
  { getStores, addNewStore, updateStore, removeStore },
  []
);
