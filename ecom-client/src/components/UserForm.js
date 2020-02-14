import React from 'react';
import FormBuilder from './FormBuilder';

const UserForm = ({ onSubmit, currentStore }) => {
  const stores = [currentStore.storeID];
  const userID = Math.floor(Math.random() * 12308590);
  return (
    <FormBuilder
      fieldsList={[
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'name', label: 'Name' },
        { name: 'supervisor', label: 'Supervisor' },
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

export default UserForm;
