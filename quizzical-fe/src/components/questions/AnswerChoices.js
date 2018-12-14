import React from 'react'

import AnswerChoiceEdit from "./AnswerChoiceEdit";
import { Button } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormGroup, Input, Label } from 'reactstrap';
import { update } from '../../actions/questions';


export const AnswerChoices = ({question, onAdd, onDelete, onChange, onUpdateQuestion}) => {
    const answers = question && question.answers ? question.answers : [];
    const allowDelete = answers.length > 2;
    
    return <>
        <Button color="primary" onClick={onAdd}>
            <FontAwesomeIcon icon="plus-square" />
            <FormattedMessage id="app.question.add" defaultMessage="Add" />
        </Button>
        <div className="p-3">
            <FormGroup>
                <Label check>
                    <Input type="checkbox" value={(question || {}).multiselect} onChange={(event) => onUpdateQuestion({multiple: event.target.checked})} />
                    <FormattedMessage id="app.question.multiselect" defaultMessage="Multiple selection" />
                </Label>
            </FormGroup>
            {(answers).map(answer => 
                <AnswerChoiceEdit
                    answerChoice={answer}
                    allowDelete={allowDelete}
                    onDelete={onDelete}
                    onChange={onChange} />)}
        </div>
    </>
};

export default AnswerChoices;