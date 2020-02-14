import React from 'react';
import { UserDetails } from './UserDetails';
import LoadingSpinner from '../LoadingSpinner';
import {
  Button,
  Layer,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  Box,
} from 'grommet';
import styled from 'styled-components';

const StyledLayer = styled(Layer)`
  padding: 20px 30px 30px 30px;
  min-width: 300px;
  min-height: 400px;
  overflow: auto;

  @media (min-width: 650px) {
    width: 600px;
  }
`;

const CenteredBox = styled(Box)`
  justify-content: center;
  align-items: center;
`;

const CloseButton = styled(Button)`
  background: #f25454;
  color: white;
  border-radius: 100px;
  padding: 8px 15px;
  transition: background 0.3s;
  &:hover {
    background: #bc3232;
  }
`;

const Footer = styled.footer`
  display: flex;
  justify-content: flex-end;
`;

export const DetailModal = ({
  modalLoading,
  modalTitle,
  orderData,
  showModal,
  setShowModal,
  userDetails,
}) =>
  showModal && (
    <StyledLayer
      onEsc={() => setShowModal(false)}
      onClickOutside={() => setShowModal(false)}
    >
      {modalLoading && (
        <CenteredBox>
          <h2>Loading...</h2>
          <LoadingSpinner size="xlarge" />
        </CenteredBox>
      )}
      {!modalLoading && (
        <div>
          <header>
            <h2>{modalTitle}</h2>
          </header>
          <main>
            {userDetails && <UserDetails userDetails={userDetails} />}
            {orderData && orderData.items.length > 0 && (
              <Table>
                <TableHeader className="thead-default">
                  <TableRow>
                    <TableCell>SKU</TableCell>
                    <TableCell>Product Name</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>QTY</TableCell>
                    <TableCell>Subtotal</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderData.items.map(i => (
                    <TableRow>
                      <TableCell>{i.sku}</TableCell>
                      <TableCell>{i.name}</TableCell>
                      <TableCell>{i.price}</TableCell>
                      <TableCell>{i.qty}</TableCell>
                      <TableCell>{i.price * i.qty}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </main>
          <Footer>
            <CloseButton onClick={() => setShowModal(false)}>Close</CloseButton>
          </Footer>
        </div>
      )}
    </StyledLayer>
  );
