import React from 'react';
import AnswerChoices from './AnswerChoices';
import { ButtonGroup, Button, Card, Row, Col, Progress } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { submit, stopPractice } from '../../actions/learn';


// TODO: Modularize to allow for different types of questions
export const Question = ({question, onSubmit, onStop}) => <>
        <Card className="p-3 my-3">
            {question.question}
        </Card>
        <Card className="p-3 my-3">
            <AnswerChoices question={question} />
        </Card>
        <Card className="p-3 my-3">
            <Row>                
                <Col xs="2">
                    <FormattedMessage id="app.learn.difficulty" defaultMessage="Question Difficulty" />                    
                </Col>
                <Col xs="4">
                    <Progress value={question.level} max={5} />
                    {(question.level || 0.).toPrecision(2)}
                </Col>
            </Row>
        </Card>
        <ButtonGroup className="p-3">
            <Button color="primary" onClick={onSubmit}>
                <FormattedMessage id="app.learn.submit" defaultMessage="Submit Answer" />
            </Button>
            <Button color="danger" onClick={onStop}>
                <FormattedMessage id="app.learn.endpractice" defaultMessage="End Practice" />
            </Button>
        </ButtonGroup>
    </>;


const mapDispatchToProps = dispatch => ({
    onSubmit: (question, answer) => dispatch(submit(question, answer)),
    onStop: () => dispatch(stopPractice())
});

export default connect(null, mapDispatchToProps)(Question)
