import React, { useContext, useEffect } from "react";
import { Box, Form, TextInput, TextArea, Button } from "grommet";
import styled from "styled-components";
import useForm from "../hooks/useForm";
import validate from "../lib/formValidate";

import { Context as ProductContext } from "../context/ProductContext";
import { Context as StoreContext } from "../context/StoreContext";
import { Context as SessionContext } from "../context/SessionContext";

const StyledForm = styled(Form)`
  display: flex;
  flex-flow: column;
  justify-content: space-around;
  align-items: center;
  input,
  textarea {
    margin: 10px 0;
  }
`;

const AddProduct = () => {
  const { state: products, addNewProduct } = useContext(ProductContext);
  const { state: stores } = useContext(StoreContext);
  const {
    state: { store: currentStore }
  } = useContext(SessionContext);
  const { values, errors, handleChange, handleFileChange, setInitialValues, handleSubmit } = useForm(
    addNewProduct,
    validate.product
  );
  
  useEffect(() => {
    const mapStores = () => currentStore.storeID === 0 ? stores.map(s => s.storeID) : currentStore.storeID;
    setInitialValues({ availableStores: mapStores() })
  }, [currentStore])
  const storeName =
    currentStore.name === "All" ? "all stores" : currentStore.name;
  return (
    <Box pad="medium">
      <h3>New Product [{storeName}]</h3>
      <StyledForm onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="name"
          name="name"
          value={values.name}
          onChange={handleChange}
        />
        <TextInput
          type="text"
          placeholder="SKU"
          name="baseSKU"
          value={values.baseSKU}
          onChange={handleChange}
        />
        <TextInput
          type="number"
          step=".01"
          placeholder="price"
          name="price"
          value={values.price}
          onChange={handleChange}
        />
        <TextInput
          type="number"
          step=".01"
          placeholder="List price (MSRP)"
          name="listPrice"
          value={values.listPrice}
          onChange={handleChange}
        />
        <TextInput
          type="file"
          name="image"
          accept="image/*"
          value={values.image}
          onChange={handleFileChange}
        />
        <TextArea
          placeholder="description"
          name="description"
          value={values.description}
          onChange={handleChange}
        />
        <Button type="submit" label="Add product" />
      </StyledForm>
    </Box>
  );
};

export default AddProduct;
