import React from 'react';
import { Button, ButtonGroup } from 'reactstrap';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import { push } from 'connected-react-router';

export const CoursePage = WrappedComponent => props => {
    const {course = {}, onHome, onEdit} = props;
    return (
        <div className="course">
            <ButtonGroup size="sm">
                <Button size="sm" color="primary" onClick={() => onHome(course)}>
                    <FontAwesomeIcon icon="home" size="xs" />
                </Button>
                <Button size="sm" onClick={() => onEdit(course)}>
                    <FontAwesomeIcon icon="edit" color="primary" size="xs" />
                    <FormattedMessage id="app.course.edit" defaultMessage="Edit" />
                </Button>
            </ButtonGroup>      
            <h2>
                {course.title}  
            </h2>                  
            <div className="summary">
                {course.summary}
            </div>
            <div className="contents">
                <WrappedComponent {...props} />
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    const { courses } = state;
    return { course: courses.current };
}

const mapDispatchToProps = dispatch => ({
    onHome: course => dispatch(push(`/courses/${course.uuid}`)), 
    onEdit: course => dispatch(push(`/courses/${course.uuid}/edit`)), 
});

export default WrappedComponent => connect(mapStateToProps, mapDispatchToProps)(CoursePage(WrappedComponent));