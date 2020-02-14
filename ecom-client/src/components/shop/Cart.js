import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FiXCircle } from "react-icons/fi";
import {
  Box,
  Button,
  Select,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell
} from "grommet";
import ShopLayout from "./ShopLayout";
import SEO from "../seo";
import { Context as CartContext } from "../../context/CartContext";
import { Context as OrderContext } from "../../context/OrderContext";
import { Context as AuthContext } from "../../context/AuthContext";
import { Context as SessionContext } from "../../context/SessionContext";
import { s3bucket, folder } from '../../config';
import formatCurrency from '../../lib/formatCurrency';

const CartContainer = styled(Box)`
  justify-content: space-around;
`;

const CartItem = styled(TableRow)``;

const CartItemImage = styled.div`
  width: 100px;
  height: 100px;
  img {
    width: 100px;
  }
`;

const StyledClose = styled(FiXCircle)`
  cursor: pointer;
`;

const RemoveItem = ({ item, removeFromCart }) => {
  return <StyledClose onClick={() => removeFromCart(item)} />;
};

const CheckoutButton = styled(Button)`
  padding: 16px;
  background: #30a930;
  color: white;
  border-color: white;
`;

const CartPage = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [shippingMethod, setShippingMethod] = useState("");
  const [billingMethod, setBillingMethod] = useState("");
  const { state: cart, clearCart, removeFromCart } = useContext(CartContext);
  const { newOrder } = useContext(OrderContext);
  const {
    state: { userID, firstName, lastName, wallet, isAuthenticated }
  } = useContext(AuthContext);
  const {
    state: { store = {} }
  } = useContext(SessionContext);
  const { shippingMethods, billingMethods, name, url } = store;
  
  const getProductImage = (p) => {
    if (!p.images) return;
    return p.images[0] ? `${s3bucket}/${folder}/${p.images[0]}` : null;
  }

  const total = cart.reduce((a, c) => c.price * c.qty + a, 0).toFixed(2);

  const doCheckout = () => {
    if (isAuthenticated) {
      setLoading(true);
      setTimeout(() => {
        const items = cart.map(c => {
          const { itemID, name, size, qty, price } = c;
          return { itemID, name, size, qty, price };
        });
        newOrder({
          storeID: store.storeID,
          total,
          status: "open",
          shippingMethod,
          billingMethod,
          items,
          user: {
            name: `${firstName} ${lastName}`,
            userID
          }
        });
        clearCart();
        setLoading(false);
      }, 500);
    } else {
      console.log("guest checkout flow maybe?");
      return; //redirect to login;
    }
  };
  return (
    <ShopLayout>
      <SEO title={`Cart - ${name}`} />
      {cart.length > 0 && (
        <CartContainer direction="row">
          <div>
            <h3>Items</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>Qty</TableCell>
                  <TableCell>Item</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Item Total</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.map((c, i) => (
                  <CartItem>
                    <TableCell>
                      <CartItemImage>
                        <img src={getProductImage(c) || "https://picsum.photos/100"} />
                      </CartItemImage>
                    </TableCell>
                    <TableCell>{c.qty}</TableCell>
                    <TableCell>{c.name}</TableCell>
                    <TableCell>{c.size}</TableCell>
                    <TableCell>{formatCurrency(c.price)}</TableCell>
                    <TableCell>{formatCurrency(c.qty * c.price)}</TableCell>
                    <TableCell>
                      <RemoveItem item={c} removeFromCart={removeFromCart} />
                    </TableCell>
                  </CartItem>
                ))}
              </TableBody>
            </Table>
          </div>
          <Box gap="medium">
            <h3>Total: ${total} </h3>
            <h3>Wallet Balance: ${formatCurrency(wallet)}</h3>
            <label htmlFor="shippingMethod">Shipping method:</label>

            <Select
              name="shippingMethod"
              options={shippingMethods}
              value={shippingMethod}
              onChange={({ option }) => setShippingMethod(option)}
              isRequired
            />
            <label htmlFor="billingMethod">Billing method:</label>
            <Select
              name="billingMethod"
              options={billingMethods}
              value={billingMethod}
              onChange={({ option }) => setBillingMethod(option)}
              isRequired
            />
            <CheckoutButton
              label={loading ? "loading" : "Checkout"}
              onClick={doCheckout}
            />
          </Box>
        </CartContainer>
      )}
      {!cart.length && <h3>Cart is empty!</h3>}
      <Link to={url}>Back</Link>
    </ShopLayout>
  );
};

export default CartPage;
