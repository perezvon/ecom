import React, { useContext } from 'react';
import compact from 'lodash/compact';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { Form, FormField, TextInput, Button } from 'grommet';
import { Context as AuthContext } from '../context/AuthContext';
import Layout from './layout';
import useForm from '../hooks/useForm';
import validate from '../lib/formValidate';

const LoginRegister = () => {
  const { url } = useRouteMatch();
  const pageType = compact(url.split('/'))[0];
  const {
    doLogin,
    doRegister,
    state: { isAuthenticated, fromSession },
  } = useContext(AuthContext);
  const handleFormSubmit = pageType === 'register' ? doRegister : doLogin;
  const { values, errors, handleChange, handleSubmit } = useForm(
    handleFormSubmit,
    validate.login
  );

  const history = useHistory();
  const location = useLocation();

  const redirect = (timeout = 0) => {
    const { from } = location.state || { from: { pathname: '/' } };
    setTimeout(() => history.replace(from), timeout);
  };

  return (
    <Layout>
      {isAuthenticated ? (
        fromSession ? (
          redirect()
        ) : (
          <div>
            <h1>Success, you're logged in! Redirecting you...</h1>
            {redirect(1500)}
          </div>
        )
      ) : (
        <Form onSubmit={handleSubmit}>
          <TextInput
            type="email"
            placeholder="email"
            name="email"
            value={values.email}
            onChange={handleChange}
          />
          <TextInput
            type="password"
            placeholder="password"
            name="password"
            value={values.password}
            onChange={handleChange}
          />
          <Button type="submit" label={pageType} />
        </Form>
      )}
    </Layout>
  );
};

export default LoginRegister;
