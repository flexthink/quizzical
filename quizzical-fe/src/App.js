import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Navbar, NavItem, NavLink, NavbarBrand, Nav } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import { ConnectedRouter } from 'connected-react-router';
import './icons';
import Routes from './routes';
import PropTypes from 'prop-types';
import LoginRequired from './components/LoginRequired';


export const App = ({history}) => (
  <div className="App">
    <ConnectedRouter history={history}>
      <div>
        <header className="App-header">
          <Navbar color="dark" dark expand="md">
              <NavbarBrand href="/">QuizzICAL</NavbarBrand>
              <Nav className="mr-auto" navbar>
                  <LoginRequired>
                    <NavItem>
                      <NavLink href="/courses">
                        <FormattedMessage id="app.nav.courses" defaultMessage="Courses" />
                      </NavLink>
                    </NavItem>
                  </LoginRequired>
                  <LoginRequired>
                    <NavItem>
                      <NavLink href="/users">
                        <FormattedMessage id="app.nav.users" defaultMessage="Users" />
                      </NavLink>
                    </NavItem>
                  </LoginRequired>
                  <NavItem>
                    <NavLink href="/about">
                      <FormattedMessage id="app.nav.about" defaultMessage="About" />
                    </NavLink>
                </NavItem>
              </Nav>
              <LoginRequired>
                <Nav navbar>
                  <NavItem>
                    <NavLink href="/logout">
                      <FormattedMessage id="app.nav.logout" defaultMessage="Logout" />
                    </NavLink>
                  </NavItem>
                </Nav>
              </LoginRequired>
          </Navbar>
        </header>            
        <section className="main">
          <Routes />
        </section>
      </div>
    </ConnectedRouter>
  </div>
);

App.propTypes = {
  history: PropTypes.object
}


export default App;
