import React from 'react';
import AnswerCheckbox from '../common/AnswerCheckbox';
import { Row, Col } from 'reactstrap';
import { connect } from 'react-redux';
import uuid from 'uuid/v4';
import { updateAnswer } from '../../actions/learn';

export const AnswerChoice = ({answer, onChange}) => (
    <Row className="py-1" key={uuid()}>
        <Col xs="1">
            <AnswerCheckbox mode="select" checked={answer.checked} onChange={() => onChange(answer)} />
        </Col>
        <Col xs="11">
            {answer.answer}
        </Col>  
    </Row>
);

const mapDispatchToProps = dispatch => ({
    onChange: (answer) => dispatch(updateAnswer(answer))
})

export default connect(null, mapDispatchToProps)(AnswerChoice);