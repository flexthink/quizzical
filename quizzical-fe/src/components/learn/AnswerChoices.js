import React from 'react';
import AnswerChoice from './AnswerChoice';

const AnswerChoices = ({question}) => <>
    {(question.answers || []).map(answer => <AnswerChoice answer={answer} />)}
    </>;

export default AnswerChoices;