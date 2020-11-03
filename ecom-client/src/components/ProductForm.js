import React from 'react';
import FormBuilder from './FormBuilder';

const ProductForm = ({ onSubmit, currentStore }) => {
  const stores = [currentStore.storeID];
  const userID = Math.floor(Math.random() * 12308590);
  return (
    <FormBuilder
      fieldsList={[
        { name: 'baseSKU', label: 'Base SKU' },
        { name: 'name', label: 'Name' },
        { name: 'price', label: 'Price', type: 'number', step: '.01' },
        { name: 'description', label: 'description', type: 'textarea' },
      ]}
      formState={{
        userID,
        stores,
      }}
      button={{ label: 'Add' }}
      onSubmit={onSubmit}
    />
  );
};

export default ProductForm;
