import React from 'react';
import { Form, FormField, TextInput, Button } from 'grommet';

const FormBuilder = ({ fieldsList, button, formState, onSubmit }) => {
  let state = formState || {};
  const setValue = (field, value) => {
    state[field] = value;
  };

  const handleSubmit = () => {
    onSubmit(state);
    state = formState || {};
  };
  return (
    <Form onSubmit={handleSubmit}>
      {fieldsList.map(f => (
        <FormField
          name={f.name}
          label={f.label}
          type={f.type || 'text'}
          step={f.type === 'number' && f.step}
          onChange={e => setValue(f.name, e.target.value)}
        />
      ))}
      <Button type="submit" primary label={button.label || 'Submit'} />
    </Form>
  );
};

export default FormBuilder;
