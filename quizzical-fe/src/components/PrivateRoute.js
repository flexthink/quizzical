import React from 'react';
import { Route, Redirect } from 'react-router';
import { connect } from 'react-redux';


export const PrivateRoute = ({ component: Component, isLoggedOn, ...rest }) => (
    <Route {...rest} render={
        (props) => (
            isLoggedOn
              ? <Component {...props} />
              : <Redirect to='/login' />
          )
    } />
)

const mapStateToProps = state => {
    const { users } = state
    return { isLoggedOn: users.login.loggedOn }
}

export default connect(mapStateToProps)(PrivateRoute);