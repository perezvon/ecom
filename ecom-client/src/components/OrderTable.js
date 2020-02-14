import React, { useState, useContext, useEffect } from "react";
import moment from "moment";
import { Table, TableHeader, TableRow, TableCell, TableBody } from "grommet";
import styled from "styled-components";
import Modal from "./framework/Modal";
import { Context as OrderContext } from "../context/OrderContext";
import OrderDetail from "./OrderDetail";

const ClickableRow = styled(TableRow)`
  cursor: pointer;
`;

const OrderTable = ({ store }) => {
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [order, setOrder] = useState({});
  const { state: orders } = useContext(OrderContext);
  const openOrders = orders
    .filter(o => o.status === "open" || o.status === "pending")
    .sort((a, b) => b.orderID - a.orderID);

  const openOrderDetail = orderData => {
    setOrder(orderData);
    setShowOrderDetail(true);
  };
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell scope="col" border="bottom">
              Order #
            </TableCell>
            <TableCell scope="col" border="bottom">
              Status
            </TableCell>
            <TableCell scope="col" border="bottom">
              Date
            </TableCell>
            <TableCell scope="col" border="bottom">
              Name
            </TableCell>
            <TableCell scope="col" border="bottom">
              Total
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {openOrders.length > 0 &&
            openOrders.map(o => (
              <ClickableRow onClick={() => openOrderDetail(o)}>
                <TableCell>{o.orderID}</TableCell>
                <TableCell>{o.status}</TableCell>
                <TableCell>
                  {moment(o.orderDate).format("MM/DD/YYYY")}
                </TableCell>
                <TableCell>{o.user && (o.user.name || o.user.email)}</TableCell>
                <TableCell>{o.total}</TableCell>
              </ClickableRow>
            ))}
        </TableBody>
      </Table>
      {showOrderDetail && (
        <Modal
          setModalOpen={setShowOrderDetail}
          onEsc={() => setShowOrderDetail(false)}
          onClickOutside={() => setShowOrderDetail(false)}
        >
          <OrderDetail order={order} />
        </Modal>
      )}
    </>
  );
};

export default OrderTable;
