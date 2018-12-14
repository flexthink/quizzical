import React from 'react';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';
import { Field, reduxForm } from 'redux-form';
import { Form, Button, Alert } from 'reactstrap';
import { input } from '../field';
import { required, email } from 'redux-form-validators';
import { connect } from 'react-redux';
import { authenticate } from '../../actions/users';

const messages = defineMessages({
    email: {
        id: 'app.user.email',
        defaultMessage: 'Email',
    },
    password: {
        id: 'app.user.password',
        defaultMessage: 'Password'
    }
});

export const Login = injectIntl(({failure, handleSubmit, onLogin, intl}) => <>
    <h2>
        <FormattedMessage id="app.action.login" defaultMessage="Login" />
    </h2>
    <Form onSubmit={handleSubmit}>
        {failure && (
            <Alert color="danger">
                <FormattedMessage id="app.user.loginfailure" defaultMessage="Unable to login. Please try again" />
            </Alert>
        )}
        <Field name="email" label={intl.formatMessage(messages.email)} component={input} validate={[required(), email()]} />
        <Field name="password" label={intl.formatMessage(messages.password)} component={input} validate={[required()]} type="password"/>
        <Button color="primary" onClick={onLogin}>
            <FormattedMessage id="app.action.login" defaultMessage="Login" />
        </Button>
    </Form>
</>);

const mapStateToProps = state => {
    const { users } = state
    return { failure: users.login.failure }
}

const mapDispatchToProps = dispatch => ({
    onSubmit: values => {
        dispatch(authenticate(values))
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(
    reduxForm({form: 'login'}
)(Login));