import React from 'react'
import { connect } from 'react-redux';
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';
import { Field, reduxForm } from 'redux-form';
import { Form, ButtonGroup, Button } from 'reactstrap';
import { goBack } from 'connected-react-router';
import { input } from '../field';
import AnswerChoices from './AnswerChoices';
import { addAnswer, deleteAnswer, updateAnswer, update, save } from '../../actions/questions';

const messages = defineMessages({
    question: {
        id: 'app.question.question',
        defaultMessage: 'Question'
    }
});

const QuestionEdit = injectIntl(({
    question,
    handleSubmit,
    onCancel,
    onAddAnswerChoice,
    onDeleteAnswerChoice,
    onUpdateAnswerChoice,
    onUpdate,
    intl}) => (

    <Form onSubmit={handleSubmit}>
        <Field 
            name="question"
            label={intl.formatMessage(messages.question)}
            component={input}
            type="textarea" />            
        <div className="p-3">
            <AnswerChoices 
                question={question} 
                onUpdateQuestion={onUpdate}
                onAdd={onAddAnswerChoice} 
                onDelete={onDeleteAnswerChoice}
                onChange={onUpdateAnswerChoice} /> 
        </div>

        <ButtonGroup>
            <Button color="primary" type="submit">
                <FormattedMessage id="app.actions.submit"
                    defaultMessage="Submit" />
            </Button>
            <Button color="secondary" onClick={onCancel}>
                <FormattedMessage id="app.actions.cancel"
                    defaultMessage="Cancel" />
            </Button>
        </ButtonGroup>            
    </Form>
));

const mapStateToProps = state => {
    const { courses, questions } = state;
    const {question} = questions.current || {};
    return { 
        course: courses.current, 
        question: questions.current, 
        initialValues: {question} 
    }
}

const mapDispatchToProps = dispatch => ({
    onSubmit: values => {
        const {question} = values;
        dispatch(save({question}))
    },
    onAddAnswerChoice: () => dispatch(addAnswer()),
    onDeleteAnswerChoice:  (answer) => dispatch(deleteAnswer(answer)),
    onUpdateAnswerChoice: (answer, value) => dispatch(updateAnswer(answer, value)),
    onUpdate: (question) => dispatch(update(question)),
    onCancel: () => dispatch(goBack())
});

export default connect(mapStateToProps, mapDispatchToProps)(
    reduxForm({form: 'questionEdit', enableReinitialize: true})(QuestionEdit));

