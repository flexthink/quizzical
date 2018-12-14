import React from 'react';
import { Form, ButtonGroup, Button } from 'reactstrap';
import { input } from '../field';
import { Field, reduxForm } from 'redux-form';
import { required, email } from 'redux-form-validators';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { save } from '../../actions/users';

const messages = defineMessages({
    email: {
        id: 'app.user.email',
        defaultMessage: 'Email',
    },
    firstName: {
        id: 'app.user.firstname',
        defaultMessage: 'First Name'
    },
    lastName: {
        id: 'app.user.lastname',
        defaultMessage: 'Last Name'
    }
});

export const UserEdit = injectIntl(({handleSubmit, onSave, onCancel, intl}) => <>
    <h2><FormattedMessage id="app.user.details" defaultMessage="User Details"/></h2>
    <Form onSubmit={handleSubmit}>
        <Field name="email" label={intl.formatMessage(messages.email)} component={input} validate={[required(), email()]} />
        <Field name="first_name" label={intl.formatMessage(messages.firstName)} component={input} validate={required()} />
        <Field name="last_name" label={intl.formatMessage(messages.lastName)} component={input} validate={required()} />

        <ButtonGroup>
            <Button color="primary" onClick={onSave}>
                <FormattedMessage id="app.action.save" defaultMessage="Save" />            
            </Button>
            <Button onClick={onCancel}>
                <FormattedMessage id="app.action.cancel" defaultMessage="Cancel" />
            </Button>
        </ButtonGroup>
    </Form>
</>);

const mapStateToProps = state => {
    const { users } = state
    return { initialValues: users.current }
}

const mapDispatchToProps = dispatch => ({
    onSubmit: (values) => dispatch(save(values)),
    onCancel: () => dispatch(push('/users'))
});

export default connect(mapStateToProps, mapDispatchToProps)(
    reduxForm({form: 'userEdit'})(UserEdit)
);