import createDataContext from "./createDataContext";

const sessionReducer = (state, action) => {
  switch (action.type) {
    case "set_current_store":
      return { ...state, store: action.payload };
    default:
      return state;
  }
};

const setCurrentStore = dispatch => {
  return (storeObject = { storeID: 0, name: "All" }) => {
    dispatch({ type: "set_current_store", payload: storeObject });
  };
};

export const { Context, Provider } = createDataContext(
  sessionReducer,
  { setCurrentStore },
  { store: { storeID: 0, name: "All" } }
);
