import createDataContext from "./createDataContext";
import axios from "axios";
import { serverURL, sessionAuth } from "../api";

const orderReducer = (state, action) => {
  switch (action.type) {
    case "create_order":
      return [...state, action.payload];
    case "update_order":
      const index = state.findIndex(order => order.id === action.payload.id);
      const newState = state.slice(0, index);

      newState.push(action.payload);

      return newState.concat(state.slice(index + 1));
    case "remove_order":
      return state.filter(order => order.id !== action.payload);
    case "get_all_orders":
    case "get_orders_for_store":
    case "clear_state":
      return action.payload;
    default:
      return state;
  }
};

const getAllOrders = dispatch => {
  return async () => {
    const response = await axios.get(`${serverURL}/orders`);
    dispatch({ type: "get_all_orders", payload: response.data });
  };
};

const getOrdersForStore = dispatch => {
  return async storeID => {
    const response = await axios.get(`${serverURL}/orders/${storeID}`);
    dispatch({ type: "get_orders_for_store", payload: response.data });
  };
};

const newOrder = dispatch => {
  return async orderObject => {
    await axios.post(`${serverURL}/orders/new`, orderObject, {
      headers: sessionAuth()
    });
    dispatch({ type: "create_order", payload: orderObject });
  };
};

const updateOrder = dispatch => {
  return orderObject => {
    dispatch({ type: "update_order", payload: orderObject });
  };
};

const removeOrder = dispatch => {
  return orderID => {
    dispatch({ type: "remove_order", payload: orderID });
  };
};

const clearState = dispatch => {
  return () => dispatch({ type: "clear_state", payload: [] });
};

export const { Context, Provider } = createDataContext(
  orderReducer,
  {
    newOrder,
    updateOrder,
    removeOrder,
    getAllOrders,
    getOrdersForStore,
    clearState
  },
  []
);
