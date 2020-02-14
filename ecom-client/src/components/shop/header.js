import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import React, { useContext, useEffect } from "react";
import styled from "styled-components";
import { FiUser, FiShoppingCart } from "react-icons/fi";
import { Context as CartContext } from "../../context/CartContext";
import { Context as AuthContext } from "../../context/AuthContext";
import { Box } from "grommet";
import { FiLogIn, FiBarChart2 } from "react-icons/fi";
import _ from 'lodash';

const HeaderContainer = styled.header`
  background: rgb(25, 25, 25);
  margin-bottom: 1.45rem;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
  padding: 1.45rem 1.0875rem;

  svg {
    color: white;
    margin-left: 20px;
  }
`;

const LoginButton = styled(Link)`
  color: white;
  display: flex;
  align-items: center;
`;

const CartIcon = styled(Link)`
  position: relative;
  color: white;
`;

const StyledCartBadge = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  top: -8px;
  right: -10px;
  border-radius: 100%;
  background: #30a931;
  border: 1px solid white;
  font-size: 12px;
`;

const CartBadge = ({ count }) => <StyledCartBadge>{count}</StyledCartBadge>;

const Header = ({ siteTitle, url }) => {
  const { state: user, doLogout, rehydrateAuth } = useContext(AuthContext);
  const { state: cart } = useContext(CartContext);
  const { isAuthenticated, role } = user;
  const hasManagerPortalAccess = role === 1; //TODO: match to store managerPortal info
  
  const getBadgeCount = () => {
    const totalCount = cart.reduce((a, c) => a + +c.qty, 0);
    return totalCount > 99 ? '...' : totalCount;
  }
  
  useEffect(() => {
    if (_.isEmpty(user)) rehydrateAuth();
  }, [user])
  return (
    <HeaderContainer>
      <h1 style={{ margin: 0 }}>
        <Link
          to={url}
          style={{
            color: `white`,
            textDecoration: `none`
          }}
        >
          {siteTitle}
        </Link>
      </h1>
      <Box direction="row">
        {isAuthenticated ? (
          <>
            {hasManagerPortalAccess && (
              <Link to={`${url}/quartermaster`}>
                <FiBarChart2 size={32} />
              </Link>
            )}
            <Link to={`${url}/profile`}>
              <FiUser size={32} />
            </Link>
          </>
        ) : (
          <LoginButton to='/login'>
            <span>Login</span>
            <FiLogIn />
          </LoginButton>
        )}
        <CartIcon to={`${url}/cart`}>
          <FiShoppingCart size={32} />
          {cart.length > 0 && (
            <CartBadge count={getBadgeCount()} />
          )}
        </CartIcon>
      </Box>
    </HeaderContainer>
  );
};

Header.propTypes = {
  siteTitle: PropTypes.string
};

Header.defaultProps = {
  siteTitle: `Store`
};

export default Header;
