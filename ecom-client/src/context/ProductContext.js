import createDataContext from "./createDataContext";
import axios from "axios";
import { serverURL, sessionAuth } from '../api';

const productReducer = (state, action) => {
  switch (action.type) {
    case "get_all_products":
      return action.payload;
    case "create_product":
      return [...state, action.payload];
    case "remove_product":
      return state.filter(products => products.id !== action.payload);
    default:
      return state;
  }
};

const getAllProducts = dispatch => {
  return async () => {
    const response = await axios.get("http://localhost:3001/products");
    dispatch({ type: "get_all_products", payload: response.data });
  };
};

const addNewProduct = dispatch => {
  return async productObject => {
    const response = await axios.post(`${serverURL}/product/new`, productObject, {headers: sessionAuth()});
    dispatch({ type: "create_product", payload: response.data });
  };
};

const removeProduct = dispatch => {
  return productID => {
    dispatch({ type: "remove_product", payload: productID });
  };
};

export const { Context, Provider } = createDataContext(
  productReducer,
  { getAllProducts, addNewProduct, removeProduct },
  []
);
