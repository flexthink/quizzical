import React from 'react'
import { goBack, go } from 'connected-react-router';
import { Form, ButtonGroup, Button } from 'reactstrap'
import { connect } from 'react-redux';
import { input } from '../field'
import { Field, reduxForm } from 'redux-form'

import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { required } from 'redux-form-validators';
import { save } from '../../actions/courses';

const messages = defineMessages({
    title: {
        id: 'app.course.title',
        defaultMessage: 'Title',
    },
    summary: {
        id: 'app.course.summary',
        defaultMessage: 'Summary'
    },
    description: {
        id: 'app.course.description',
        defaultMessage: 'Description'
    }
});

export const CourseEdit = injectIntl(({onSubmit, onCancel, handleSubmit, intl}) => (
    <Form onSubmit={handleSubmit}>
        <h2><FormattedMessage id="app.course.details" defaultMessage="Course Details" /></h2>
        <Field name="title" label={intl.formatMessage(messages.title)} component={input} validate={required()}/>
        <Field name="summary" label={intl.formatMessage(messages.summary)} component={input} type="textarea" />
        <Field name="description" label={intl.formatMessage(messages.description)} component={input} type="textarea" />
                
        
        <ButtonGroup>
            <Button color="primary" type="submit">
                <FormattedMessage id="app.actions.save" defaultMessage="Save" />
            </Button>
            <Button color="secondary" onClick={onCancel}>
                <FormattedMessage id="app.actions.cancel" defaultMessage="Cancel" />
            </Button>
        </ButtonGroup>
    </Form>
));

  

const mapStateToProps = state => {
    return {initialValues: state.courses.current};
};

const mapDispatchToProps = dispatch => ({
   onSubmit: (values) => {dispatch(save(values))},
   onCancel: () => {dispatch(goBack()); },
});

export default 
    connect(mapStateToProps, mapDispatchToProps)(reduxForm({
        form: 'courseEdit'
    })(CourseEdit))