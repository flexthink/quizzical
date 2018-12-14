import React from 'react';
import { Row, Col, Button, Input } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AnswerCheckbox from '../common/AnswerCheckbox';

export const AnswerChoiceEdit = ({answerChoice, onDelete, onChange, allowDelete}) => (
    <Row className="py-1">
        <Col xs="1">
            <AnswerCheckbox checked={answerChoice.checked} onChange={value => onChange(answerChoice, {checked: value})} />
        </Col>
        <Col xs="9">
            <Input type="textarea" value={answerChoice.answer} onChange={event => onChange(answerChoice, {answer: event.target.value})} />
        </Col>
        <Col xs="2">
            {(allowDelete && 
            <Button color="danger" onClick={() => onDelete(answerChoice)}>
                <FontAwesomeIcon icon="trash" />
            </Button>)}
        </Col>
    </Row>
)


export default AnswerChoiceEdit;