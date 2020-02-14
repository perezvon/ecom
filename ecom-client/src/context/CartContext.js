import createDataContext from './createDataContext';

const cartReducer = (state, action) => {
  let newCart;
  switch (action.type) {
    case 'add_to_cart':
      newCart = [...state, action.payload];
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    case 'remove_from_cart':
      newCart = state.filter(item => item.productID !== action.payload.productID);
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    case 'update_cart':
      const index = state.findIndex(item => item.id === action.payload.id);
      const newState = state.slice(0, index);
      newState.push(action.payload);
      newCart = newState.concat(state.slice(index + 1));
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    case 'clear_cart':
      localStorage.removeItem('cart');
      return action.payload;
    default:
      return state;
  }
};

const addToCart = dispatch => {
  return cartObject => {
    dispatch({ type: 'add_to_cart', payload: cartObject });
  };
};

const updateCart = dispatch => {
  return cartObject => {
    dispatch({ type: 'update_cart', payload: cartObject });
  };
};

const removeFromCart = dispatch => {
  return cartID => {
    dispatch({ type: 'remove_from_cart', payload: cartID });
  };
};

const clearCart = dispatch => {
  return () => {
    dispatch({ type: 'clear_cart', payload: [] });
  };
};

const rehydrateCart = () => {
  if (localStorage.cart) {
    return JSON.parse(localStorage.cart);
  }
  return [];
};

export const { Context, Provider } = createDataContext(
  cartReducer,
  { addToCart, updateCart, removeFromCart, clearCart },
  rehydrateCart()
);
