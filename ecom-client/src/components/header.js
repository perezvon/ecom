import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import React, { useContext } from "react";
import { Button } from "grommet";
import { Context as AuthContext } from "../context/AuthContext";
import styled from "styled-components";
import { FiSettings, FiLogIn, FiLogOut } from "react-icons/fi";

const StyledHeader = styled.header`
  background: rgb(25, 25, 25);
  margin-bottom: 1.45rem;
  max-width: 960;
  padding: 1.45rem 1.0875rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const RightSideContainer = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  svg {
    margin-left: 15px;
    stroke: white;
    /* path {
      stroke-width: 1;
    } */
  }
`;

const Header = ({ siteTitle }) => {
  const {
    doRegister,
    doLogin,
    doLogout,
    state: { username, isAuthenticated }
  } = useContext(AuthContext);
  return (
    <StyledHeader>
      <h1 style={{ margin: 0 }}>
        <Link
          to="/"
          style={{
            color: `white`,
            textDecoration: `none`
          }}
        >
          {siteTitle}
        </Link>
      </h1>
      {!isAuthenticated && (
        <RightSideContainer>
          <Link to='/login'>
          <FiLogIn size={32} />
          </Link>
        </RightSideContainer>
      )}

      {isAuthenticated && (
        <RightSideContainer>
          <Link to="/settings">
            <FiSettings size={32} />
          </Link>

          <FiLogOut size={32} onClick={doLogout} />
        </RightSideContainer>
      )}
    </StyledHeader>
  );
};

Header.propTypes = {
  siteTitle: PropTypes.string
};

Header.defaultProps = {
  siteTitle: ``
};

export default Header;
