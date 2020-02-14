import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Box, Tabs, Tab, Select } from "grommet";
import { Context as StoreContext } from "../context/StoreContext";
import { Context as ProductContext } from "../context/ProductContext";
import { Context as UserContext } from "../context/UserContext";
import { Context as OrderContext } from "../context/OrderContext";
import { Context as SessionContext } from "../context/SessionContext";

import Layout from "./layout";
import SEO from "./seo";
import StoreInfo from "./StoreInfo";
import DataBlock from "./DataBlock";
import ProductOverview from "./ProductOverview";

const slugify = string => `/store?name=${string.replace(/\s/g, "_")}`;
const snakeCaseify = string => string.replace(/\s/g, "-");

const AdminHome = () => {
  const { state: stores, addNewStore } = useContext(StoreContext);
  const { state: orders, getAllOrders } = useContext(OrderContext);
  const { state: inventory } = useContext(ProductContext);
  const { state: users, getAllUsers } = useContext(UserContext);
  const {
    state: { store: currentStore },
    setCurrentStore
  } = useContext(SessionContext);
  const [showStoreCreator, setShowStoreCreator] = useState(false);

  useEffect(() => {
    getAllUsers();
    getAllOrders();
  }, []);

  const totalOrders = (
    <DataBlock label="Total orders" value={orders.length}></DataBlock>
  );
  const salesForPeriod = (
    <DataBlock
      label="Sales"
      value={`$${orders.reduce((a, c) => a + +c.total, 0).toFixed(2)}`}
    ></DataBlock>
  );
  const inventoryCount = (
    <DataBlock label="Product count" value={inventory.length}></DataBlock>
  );
  const userCount = <DataBlock label="Users" value={users.length}></DataBlock>;

  const createNewStore = name => {
    const newStore = {
      id: stores.length + 1,
      name,
      url: `/shop/${snakeCaseify(name)}`,
      slug: slugify(name)
    };
    // add store to list of stores
    addNewStore(newStore);
    setShowStoreCreator(false);

    // generate store template page
  };
  return (
    <Layout>
      <SEO title="Admin" />
      <p>Filter by store</p>
      <Select
        value={currentStore}
        options={[
          { storeID: 0, name: "All" },
          ...stores.map(s => ({ storeID: s.storeID, name: s.name }))
        ]}
        labelKey="name"
        onChange={({ option }) => setCurrentStore(option)}
      />
      <h1>Dashboard</h1>
      <Tabs>
        <Tab title="Overview">
          <Box direction="row-responsive">
            {totalOrders}
            {salesForPeriod}
            {inventoryCount}
            {userCount}
          </Box>
          <Box>
            {stores.length > 0 && (
              <>
                <h3>Stores</h3>
                <ul>
                  {" "}
                  {stores.map(store => (
                    <li key={store.storeID}>
                      <Link to={store.slug}>{store.name}</Link>
                    </li>
                  ))}{" "}
                </ul>
              </>
            )}
            <Button
              onClick={() => setShowStoreCreator(true)}
              label="Create New Store"
            />
            {showStoreCreator && <StoreInfo onSubmit={createNewStore} />}
          </Box>
        </Tab>
        <Tab title="Products">
          <ProductOverview />
        </Tab>
      </Tabs>
    </Layout>
  );
};

export default AdminHome;
