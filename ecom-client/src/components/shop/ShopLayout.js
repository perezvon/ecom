import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Grommet } from 'grommet';
import { grommet } from 'grommet/themes';
import { Context as StoreContext } from "../../context/StoreContext";
import { Context as SessionContext } from "../../context/SessionContext";
import SiteHeader from "./header";

const Container = styled.div`
  font-family: Lato, Helvetica Neue, Arial, Helvetica, sans-serif;
  max-width: 1000px;
  line-height: 1.5;
  font-size: 1.14285714rem;
  margin-left: auto !important;
  margin-right: auto !important;
`;

const ShopLayout = ({ children }) => {
  const [store, setStore] = useState({});
  const { state: sessionState, setCurrentStore } = useContext(SessionContext);
  const { state: stores } = useContext(StoreContext);
  const { pathname } = window.location;
  const pathArr = pathname.split("/");
  const storePath = pathArr.slice(0, 3).join("/");
  useEffect(() => {
    if (sessionState.store.storeID) return setStore(sessionState.store);
    const currentStore = stores.find(s => s.url === storePath);
    if (currentStore) {
      setStore(currentStore);
      setCurrentStore(currentStore);
    }
  }, [stores]);
  return (
    <Grommet theme={grommet} full={true}>
      <SiteHeader siteTitle={store.name} url={store.url} />
      <Container>
        <main>{children}</main>
        <footer>© {new Date().getFullYear()} Aspen Mills</footer>
      </Container>
    </Grommet>
  );
};

ShopLayout.propTypes = {
  children: PropTypes.node.isRequired,
  storeData: PropTypes.object
};

export default ShopLayout;
