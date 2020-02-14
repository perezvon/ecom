/**
 * Layout component
 * 
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Grommet } from 'grommet';
import { grommet } from 'grommet/themes';

import SiteHeader from './header';
// import './layout.css';

const Layout = ({ children }) => {
  const title = 'ecom'
  return (
    <Grommet theme={grommet} full={true}>
      <SiteHeader siteTitle={title} />
      <div
        style={{
          margin: `0 auto`,
          maxWidth: 960,
          padding: `0px 1.0875rem 1.45rem`,
          paddingTop: 0,
        }}
      >
        <main>{children}</main>
        <footer>
          © {new Date().getFullYear()}{' '}
          <a href="https://distantbluesoftware.com">distantbluesoftware</a>
        </footer>
      </div>
    </Grommet>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
