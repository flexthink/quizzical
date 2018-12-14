import React, { PureComponent } from 'react';
import { Redirect } from 'react-router';
import { logout } from '../../actions/users';
import { connect } from 'react-redux';

/**
 * The logout component
 */
export class Logout extends PureComponent {
    /**
     * Dispatches the logout function
     */
    componentDidMount() {
        this.props.logout();      
    }
    render() {
        return <Redirect to="/" />
    }
}

const mapDispatchToProps = dispatch => ({
    logout: () =>  dispatch(logout())
})

export default connect(null, mapDispatchToProps)(Logout);