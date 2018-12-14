import React from 'react';
import { connect } from 'react-redux';

const LoginRequired = ({isLoggedOn, children}) => <>
    {isLoggedOn && children}
</>;

const mapStateToProps = state => {
    const { users } = state
    return { isLoggedOn: users.login.loggedOn }
}

export default connect(mapStateToProps)(LoginRequired);