import React, { useState } from 'react';

import { Form, TextInput, Button } from 'grommet';

const StoreInfo = ({ onSubmit }) => {
  const [name, setName] = useState('');
  return (
    <Form onSubmit={() => onSubmit(name)}>
      <TextInput
        placeholder="store name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <Button type="submit" label="Create" />
    </Form>
  );
};

export default StoreInfo;
