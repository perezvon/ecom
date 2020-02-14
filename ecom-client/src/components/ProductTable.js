import React, { useState, useContext } from "react";
import styled from "styled-components";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
  Layer
} from "grommet";
import { Context as StoreContext } from "../context/StoreContext";
import ProductDetail from "./ProductDetail";

const StyledTable = styled(Table)`
  width: 80vw;
`;

const ClickableRow = styled(TableRow)`
  cursor: pointer;
`;

const ProductTable = ({ products, currentStore }) => {
  const [showDetail, setShowDetail] = useState(false);
  const [currentItem, setCurrentItem] = useState({});
  const { state: stores } = useContext(StoreContext);
  const openProductDetail = item => {
    setCurrentItem(item);
    setShowDetail(true);
  };
  return (
    <>
      {products.length > 0 && (
        <StyledTable>
          <TableHeader>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Available Stores</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map(item => (
              <ClickableRow
                key={item.productID}
                onClick={() => openProductDetail(item)}
              >
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.price}</TableCell>
                {!currentStore && item.availableStores.length && (
                  <TableCell>
                    {item.availableStores
                      .map(s => stores.find(store => store.storeID === s)?.name)
                      .join(", ")}
                  </TableCell>
                )}
              </ClickableRow>
            ))}
          </TableBody>
        </StyledTable>
      )}
      {showDetail && (
        <Layer
          onEsc={() => setShowDetail(false)}
          onClickOutside={() => setShowDetail(false)}
        >
          <ProductDetail item={currentItem} />
        </Layer>
      )}
    </>
  );
};

export default ProductTable;
