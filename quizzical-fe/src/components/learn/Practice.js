import React from 'react';
import IfEmpty from '../common/IfEmpty';
import Question from './Question';
import { defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

const messages = defineMessages({
    noQuestion: {
        id: 'app.learn.noquestion',
        defaultMessage: 'No practice questions are available',
    }
});

const Practice = injectIntl(({question, intl}) => <>
        <IfEmpty value={question} emptyMessage={intl.formatMessage(messages.noQuestion)}>
            <Question question={question} />
        </IfEmpty>
    </>
);

const mapStateToProps = state => {
    const { courses, learn } = state
    return { 
        course: courses.current || {},
        question: learn.question || {} 
    }
}
export default connect(mapStateToProps)(Practice);    