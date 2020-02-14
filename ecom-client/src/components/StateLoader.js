import React, { useContext, useEffect } from "react";
import { Context as StoreContext } from "../context/StoreContext";
import { Context as ProductContext } from "../context/ProductContext";
import { Context as UserContext } from "../context/UserContext";
import { Context as AuthContext } from "../context/AuthContext";

const StateLoader = ({ type, children }) => {
  const { getStores } = useContext(StoreContext);
  const { getAllProducts } = useContext(ProductContext);
  const { getAllUsers } = useContext(UserContext);
  const { rehydrateAuth } = useContext(AuthContext);
  useEffect(() => {
    rehydrateAuth();
    getStores();
    getAllProducts();
    if (type === 'admin') {
      getAllUsers();
    }
  }, []);
  return <>{children}</>;
};

export default StateLoader;
