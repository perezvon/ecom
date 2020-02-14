import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Button, TextInput } from "grommet";

import Layout from "../components/layout";
import SEO from "../components/seo";

const SettingsPage = () => {
  const [ordersEmail, setOrdersEmail] = useState("");
  return (
    <Layout>
      <SEO title="Settings" />
      <h1>Settings</h1>
      <label htmlFor="ordersEmail">Order department email:</label>
      <TextInput
        name="ordersEmail"
        type="email"
        value={ordersEmail}
        onChange={e => setOrdersEmail(e.target.value)}
      />
      <Link to="/">Go back to the homepage</Link>
    </Layout>
  );
};

export default SettingsPage;
