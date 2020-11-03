import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag } from 'react-icons/fi';
import { Tabs, Tab, Box, Button, CheckBox, TextInput, Layer } from 'grommet';
import { Context as StoreContext } from '../context/StoreContext';
import { Context as OrderContext } from '../context/OrderContext';
import { Context as ProductContext } from '../context/ProductContext';
import { Context as UserContext } from '../context/UserContext';
import { FiPlusCircle } from 'react-icons/fi';
import Layout from '../components/layout';

import SEO from '../components/seo';
import styled from 'styled-components';

import Table from '../components/framework/Table';
import ProductTable from '../components/ProductTable';
import ProductForm from '../components/ProductForm';
import UserForm from '../components/UserForm';
import SalesChart from '../components/SalesChart';
import OrderTable from '../components/OrderTable';

const UserModal = styled(Layer)`
  padding: 40px;
`;

const ProductModal = styled(Layer)`
  padding: 20px 40px;
`;

const StoreHeader = styled.h1`
  display: flex;
  align-items: center;
  svg {
    margin-right: 10px;
  }
`;

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledFiPlusCircle = styled(FiPlusCircle)`
  cursor: pointer;
`;

const unslugify = (str) => str.replace(/_/g, ' ');

const StorePage = ({ location }) => {
  const [store, setStore] = useState({});
  const [contactEmail, setContactEmail] = useState('');
  const [allowance, setAllowance] = useState(0);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const { state: stores, updateStore } = useContext(StoreContext);
  const { state: products, addNewProduct } = useContext(ProductContext);
  const { state: users, addNewUser } = useContext(UserContext);
  const { getOrdersForStore, clearState } = useContext(OrderContext);
  useEffect(() => {
    if (stores.length && window.location.search) {
      const storeFromUrl = stores.find(
        (s) => s.name === unslugify(window.location.search.slice(6))
      );
      if (!storeFromUrl) return;
      setStore(storeFromUrl);
      setContactEmail(
        storeFromUrl.managerPortal && storeFromUrl.managerPortal.contactEmail
      );
      setAllowance(+storeFromUrl.allowance);
      getOrdersForStore(storeFromUrl.storeID);
      return () => clearState();
    }
  }, [stores]);
  const storeProducts = products.filter(
    (item) => ~item.availableStores.indexOf(store.storeID)
  );

  const handleEmailChange = (e) => {
    setContactEmail(e.target.value);
    updateStore({
      ...store,
      managerPortal: { ...store.managerPortal, contactEmail: e.target.value },
    });
  };

  let id = users.length + 1;

  console.log(stores);
  console.log(users);
  console.log(products);

  return (
    <Layout>
      <SEO title={`Admin - ${store.name || 'Store'}`} />
      {!store && <p>No store selected!</p>}
      <div>
        <StoreHeader>
          <FiShoppingBag />
          {store.name}
        </StoreHeader>
        <p>{store.description}</p>
        <Tabs>
          <Tab title="Overview">
            <Box pad="medium" round="xsmall">
              {/* <SalesChart store={store} /> */}
              <OrderTable store={store} />
            </Box>
          </Tab>
          <Tab title="Users">
            <Box pad="medium">
              <Button
                icon={<FiPlusCircle />}
                label="Add a User"
                onClick={
                  () => setShowUserModal(true)
                  /*addNewUser({ id, name: 'jorg Borgson', stores: [store.id] })*/
                }
              />
              {users.length > 0 && (
                <>
                  <FlexContainer>
                    <h2>Users</h2>
                    <StyledFiPlusCircle
                      className="icon"
                      size={32}
                      onClick={() =>
                        addNewUser({
                          id,
                          name: 'smorg florgson',
                          stores: [store.storeID],
                        })
                      }
                    />
                  </FlexContainer>
                  <Table
                    headers={['name', 'email', 'rank']}
                    data={users
                      .filter((u) => ~u.stores.indexOf(store.storeID))
                      .map(({ name, email, rank }) => ({ name, email, rank }))}
                  />
                </>
              )}
            </Box>
          </Tab>
          <Tab title="Products">
            <Box pad="medium">
              <FlexContainer>
                <h2>Store Inventory</h2>
                <StyledFiPlusCircle
                  className="icon"
                  size={32}
                  onClick={() => setShowProductModal(true)}
                />
              </FlexContainer>
              {storeProducts.length > 0 && (
                <ProductTable products={storeProducts} currentStore={store} />
              )}
            </Box>
          </Tab>
          <Tab title="Settings">
            <Box pad="medium">
              <CheckBox
                checked={store.hasManagerPortal}
                label="Has QM"
                onChange={(e) =>
                  updateStore({
                    ...store,
                    hasManagerPortal: e.target.checked,
                    managerPortal: {},
                  })
                }
              />
              {store.hasManagerPortal && (
                <>
                  <CheckBox
                    checked={
                      store.managerPortal && store.managerPortal.approval
                    }
                    label="Needs Approval"
                    onChange={(e) =>
                      updateStore({
                        ...store,
                        managerPortal: {
                          ...store.managerPortal,
                          approval: e.target.checked,
                        },
                      })
                    }
                  />
                  {store.managerPortal.approval && (
                    <TextInput
                      placeholder="QM contact"
                      value={contactEmail}
                      onChange={handleEmailChange}
                    />
                  )}
                </>
              )}
              <CheckBox
                checked={store.hasAllowance}
                label="Has Allowance"
                onChange={(e) =>
                  updateStore({ ...store, hasAllowance: e.target.checked })
                }
              />
              {store.hasAllowance && (
                <TextInput
                  placeholder="amount"
                  name="amount"
                  type="number"
                  value={allowance}
                  onChange={(e) =>
                    updateStore({
                      ...store,
                      allowance: e.target.value,
                    })
                  }
                />
              )}
            </Box>
          </Tab>
        </Tabs>

        <a href={store.url} target="_blank">
          Go to storefront
        </a>
      </div>

      <Link to="/">Go back to the homepage</Link>
      {showUserModal && (
        <UserModal
          onEsc={() => setShowUserModal(false)}
          onClickOutside={() => setShowUserModal(false)}
        >
          <h3>Add New User</h3>
          <UserForm
            onSubmit={(data) => {
              addNewUser(data);
              setShowUserModal(false);
            }}
            currentStore={store}
          />
        </UserModal>
      )}
      {showProductModal && (
        <ProductModal
          onEsc={() => setShowProductModal(false)}
          onClickOutside={() => setShowProductModal(false)}
        >
          <h3>Add New Product</h3>
          <ProductForm
            onSubmit={(data) => {
              addNewProduct(data);
              setShowProductModal(false);
            }}
            currentStore={store}
          />
        </ProductModal>
      )}
    </Layout>
  );
};
export default StorePage;
