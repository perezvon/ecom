import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";

import { Context as ProductContext } from "../context/ProductContext";
import { Context as StoreContext } from "../context/StoreContext";

import Layout from "../components/layout";
import SEO from "../components/seo";
import ProductOverview from "../components/ProductOverview";

const InventoryPage = () => {
  return (
    <Layout>
      <SEO title="Products" />
      <ProductOverview />
      <Link to="/">Go back to the homepage</Link>
    </Layout>
  );
};

export default InventoryPage;
