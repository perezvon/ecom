import React, { useState, useContext } from "react";
import { Box, Button, Select, Layer } from "grommet";

import { Context as ProductContext } from "../context/ProductContext";
import { Context as StoreContext } from "../context/StoreContext";
import { Context as SessionContext } from "../context/SessionContext";

import ProductTable from "./ProductTable";
import AddProduct from "./AddProduct";
import Modal from "./framework/Modal";

const ProductOverview = () => {
  const [showProductModal, setShowProductModal] = useState(false);
  const { state: products, addNewProduct } = useContext(ProductContext);
  const { state: stores } = useContext(StoreContext);
  const {
    state: { store: currentStore }
  } = useContext(SessionContext);
  const addItem = () => {
    const name = Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, "");
    const price = (Math.random() * 100).toFixed(2);
    addNewProduct({
      name,
      price,
      availableStores:
        currentStore.storeID !== 0
          ? [currentStore.storeID]
          : stores.map(s => s.storeID)
    });
  };

  const setFilters = products => {
    if (currentStore) {
      if (currentStore.storeID === 0) return products;
      return products.filter(
        i => ~i.availableStores.indexOf(currentStore.storeID)
      );
    }
    return products;
  };
  return (
    <Box>
      <h1>Products</h1>
      <Button onClick={() => setShowProductModal(true)} label="Add product" />
      {products.length > 0 && <ProductTable products={setFilters(products)} />}
      {showProductModal && (
        <Modal
          setModalOpen={setShowProductModal}
          onEsc={() => setShowProductModal(false)}
          onClickOutside={() => setShowProductModal(false)}
        >
          <AddProduct />
        </Modal>
      )}
    </Box>
  );
};

export default ProductOverview;
