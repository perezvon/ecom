import React, { useState } from "react";
import { Table } from "./Table";
import { TextArea, TableRow, TableCell } from "grommet";
import { DetailModal } from "./DetailModal";
import { Button } from "grommet";
import styled from "styled-components";

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
  input {
    display: none;
  }
  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #540b0e;
    border-radius: 34px;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }

  span:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    border-radius: 50%;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }
  input:checked + span {
    background-color: #0f6d46;
  }

  input:focus + span {
    box-shadow: 0 0 1px #0f6d46;
  }

  input:checked + span:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
  }
`;

const ApproveDeny = ({ orderData }) => {
  const [showModal, setShowModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState({});
  const handleInput = (e, index) => {
    let field, value;
    if (e.target.type === "checkbox") {
      field = "approved";
      value = e.target.checked;
    } else {
      field = "approve_deny_notes";
      value = e.target.value;
    }
    console.log(field, value);
  };
  const handleSubmit = e => {
    e.preventDefault();
  };
  const headers = ["Order", "Name", "Total", "Approved?", "Notes"].map(i => (
    <TableCell>{i}</TableCell>
  ));
  const tableData = orderData.map((order, index) => (
    <TableRow key={order.orderID}>
      <TableCell onClick={setCurrentOrder}>{order.orderID}</TableCell>
      <TableCell onClick={setCurrentOrder}>{order.name}</TableCell>
      <TableCell onClick={setCurrentOrder}>{`$${order.total}`}</TableCell>
      <TableCell>
        <ToggleSwitch>
          <input
            type="checkbox"
            checked={order.approved}
            onChange={e => handleInput(e, index)}
          />
          <span></span>
        </ToggleSwitch>
      </TableCell>
      <TableCell>
        <TextArea
          placeholder="Enter notes for employee here (optional)"
          value={order.notes}
          onChange={e => handleInput(e, index)}
        ></TextArea>
      </TableCell>
    </TableRow>
  ));
  if (orderData.length > 0) {
    return (
      <div>
        <Table headers={headers} tableData={tableData} />
        <Button onClick={handleSubmit}>Submit</Button>
        <DetailModal
          modalTitle={`Order #${currentOrder.orderID}`}
          orderData={currentOrder}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      </div>
    );
  } else {
    return <h3>No Orders to Approve!</h3>;
  }
};

export default ApproveDeny;
