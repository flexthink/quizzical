import React, { PureComponent } from 'react';
import { ButtonGroup, Button, Table, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';
import { connect } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { push } from 'connected-react-router';
import IfEmpty from '../common/IfEmpty';
import { promptDeleteQuestion, confirmDeleteQuestion, cancelDeleteQuestion, getList } from '../../actions/questions';

import autoBind from 'react-autobind';
import PaginatedTable from '../common/PaginatedTable';

const messages = defineMessages({
    noQuestions: {
        id: 'app.question.noquestions',
        defaultMessage: 'There are no questions'
    },
    email: {
        id: 'app.question.question',
        defaultMessage: 'Question'
    }
});

class QuestionListImpl extends PureComponent {
    constructor(props) {
        super(props);
        autoBind(this);
    }

    columns() {
        const { onEdit, onDelete, course, intl } = this.props;
        return [
            {
                dataField: 'question',
                text: intl.formatMessage(messages.email)
            },
            {
                dataField: 'actions',
                isDummyField: true,
                formatter: (cellContent, row) => (
                    <ButtonGroup>
                        <Button color="primary" onClick={() => onEdit(course, row)}>
                            <FontAwesomeIcon icon="edit" />
                            <FormattedMessage id="action.edit" defaultMessage="Edit" />
                        </Button>
                        <Button color="danger" onClick={() => onDelete(row)}>
                            <FontAwesomeIcon icon="trash" />
                            <FormattedMessage id="action.delete" defaultMessage="Delete" />
                        </Button>
                    </ButtonGroup>
                )
            }
        ];        
    }
    modal() {
        const {confirmDeleteOpen, onDeleteConfirm, onDeleteCancel} = this.props;
        return (   
            <Modal isOpen={confirmDeleteOpen}>
                <ModalHeader>
                    <FormattedMessage id="app.dialogs.confirm" defaultMessage="Please confirm" />
                </ModalHeader>
                <ModalBody>
                    <FormattedMessage id="app.question.delete.confirm" defaultMessage="Are you sure you want to delete this question?" />
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={onDeleteConfirm}>
                        <FontAwesomeIcon icon="trash" />
                        <FormattedMessage id="app.actions.delete" defaultMessage="Delete" />
                    </Button>
                    <Button color="secondary" onClick={onDeleteCancel}>
                        <FontAwesomeIcon icon="times" />
                        <FormattedMessage id="app.actions.cancel" defaultMessage="Cancel" />
                    </Button>
                </ModalFooter>
            </Modal>
        );

    }
    render() {
        const {questions, course, intl, onNewQuestion} = this.props;
        return <>
            <Button color="primary" onClick={() => onNewQuestion(course)}>
                <FontAwesomeIcon icon="plus-square" />
                <FormattedMessage id="app.question.new" defaultMessage="New Question" />
            </Button>
            <IfEmpty value={questions} emptyMessage={intl.formatMessage(messages.noQuestions)}>
                <PaginatedTable id="questions" keyField="uuid" data={questions} columns={this.columns()} fetch={getList} />
            </IfEmpty>
            {this.modal()}
        </>;
    }
}

const QuestionList = injectIntl(QuestionListImpl);
/*
export const QuestionList = ({
    course, questions, onNewQuestion, onEdit, onDelete, confirmDeleteOpen, onDeleteConfirm, onDeleteCancel}) => 
    <>
        <Button color="primary" onClick={() => onNewQuestion(course)}>
            <FontAwesomeIcon icon="plus-square" />
            <FormattedMessage id="app.question.new" defaultMessage="New Question" />
        </Button>
        <IfEmpty value={questions} emptyMessage="There are no questions">
            <Table>
                <thead>
                    <tr>
                        <th><FormattedMessage id="app.question.question" defaultMessage="Question" /></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {questions.map(question => QuestionListItem({course, question, onEdit, onDelete}))}
                </tbody>
            </Table>
        </IfEmpty>
        <Modal isOpen={confirmDeleteOpen}>
            <ModalHeader>
                <FormattedMessage id="app.dialogs.confirm" defaultMessage="Please confirm" />
            </ModalHeader>
            <ModalBody>
                <FormattedMessage id="app.dialogs.confirm" defaultMessage="Are you sure you want to delete this question?" />
            </ModalBody>
            <ModalFooter>
                <Button color="danger" onClick={onDeleteConfirm}>
                    <FontAwesomeIcon icon="trash" />
                    <FormattedMessage id="app.actions.delete" defaultMessage="Delete" />
                </Button>
                <Button color="secondary" onClick={onDeleteCancel}>
                    <FontAwesomeIcon icon="times" />
                    <FormattedMessage id="app.actions.cancel" defaultMessage="Cancel" />
                </Button>
            </ModalFooter>
        </Modal>
    </>;

const QuestionListItem = ({course, question, onEdit, onDelete}) => (
    <tr key={question.uuid}>
        <td>{question.question}</td>
        <td>
            <ButtonGroup>
                <Button color="primary" onClick={() => onEdit(course, question)}>
                    <FontAwesomeIcon icon="edit" />
                    <FormattedMessage id="action.edit" defaultMessage="Edit" />
                </Button>
                <Button color="danger" onClick={() => onDelete(question)}>
                    <FontAwesomeIcon icon="trash" />
                    <FormattedMessage id="action.delete" defaultMessage="Delete" />
                </Button>
            </ButtonGroup>
        </td>
    </tr>
)


*/

const mapStateToProps = state => {
    const { courses, questions } = state
    return { 
        confirmDeleteOpen: questions.confirmDeleteOpen,
        course: courses.current || {},
        questions: questions.allIds.map(id => questions.byId[id]) 
    }
};

const mapDispatchToProps = dispatch => ({
    onNewQuestion: (course) => dispatch(push(`/courses/${course.uuid}/questions/new`)),
    onEdit: (course, question) => dispatch(push(`/courses/${course.uuid}/questions/${question.uuid}`)),
    onDelete: question => dispatch(promptDeleteQuestion(question)),
    onDeleteConfirm: () => dispatch(confirmDeleteQuestion),
    onDeleteCancel: () => dispatch(cancelDeleteQuestion())
});

export default connect(mapStateToProps, mapDispatchToProps)(QuestionList);