import React from "react";
import {
  Box,
  Table,
  TableHeader,
  TableRow,
  TableBody,
  TableCell
} from "grommet";
import moment from "moment";

const OrderDetail = ({ order }) => {
  const {
    orderID,
    user,
    status,
    items,
    shippingMethod,
    billingMethod,
    orderDate
  } = order;
  return (
    <Box pad="large" background="light-3">
      <h3>Order Details - #{orderID}</h3>
      <p>Order Date: {moment(orderDate).format("MM/DD/YYYY")}</p>
      <p>Name: {user && user.name}</p>
      <p>Status: {status}</p>
      <p>Shipping Method: {shippingMethod}</p>
      <p>Billing Method: {billingMethod}</p>
      {items.length && (
        <div>
          <h3>Items</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>Qty</TableCell>
                <TableCell>Price</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map(({ name, qty, price }) => (
                <TableRow>
                  <TableCell>{name}</TableCell>
                  <TableCell>{qty}</TableCell>
                  <TableCell>{price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </Box>
  );
};

export default OrderDetail;
