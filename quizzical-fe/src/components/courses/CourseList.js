import React from 'react';
import { ButtonGroup, Button, CardDeck, Card, CardTitle, CardText, Alert } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { push } from 'connected-react-router';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

export const CourseList = ({courses, onNewCourse, onCourseHome})  => (
    <> 
        <ButtonGroup className="py-3">
            <Button color="primary" onClick={onNewCourse}>
                <FontAwesomeIcon icon="plus-square" />                    
                <FormattedMessage id="app.courses.new" defaultMessage="New Course" />
            </Button>
        </ButtonGroup>

        {(courses && courses.length > 0) ? (
            <CardDeck>
                {courses.map(course => <CourseCard course={course} onCourseHome={onCourseHome} />)}
            </CardDeck>            
        ) : (
            <Alert color="info"><FontAwesomeIcon icon="info-circle" />
                <FormattedMessage id="app.courses.notavailable" 
                    defaultMessage="There are no courses available" /></Alert>
        )}
    </>
);

const CourseCard = ({course, onCourseHome}) => (
    <Card className="p-4"> 
        <CardTitle>{course.title}</CardTitle>
        <CardText>{course.summary}</CardText>
        <ButtonGroup>
            <Button color="primary" tag={() => <Link to={`/courses/${course.uuid}/learn`} />}>
                <FormattedMessage id="app.courses.learn" defaultMessage="Learn" />                
            </Button>
            <Button onClick={() => onCourseHome(course.uuid)}>
                <FormattedMessage id="app.courses.go" defaultMessage="Go" />
            </Button>
        </ButtonGroup>
    </Card>
)

CourseList.propTypes = {
    courses: PropTypes.array
}

const mapStateToProps = state => {
    const { courses } = state
    return { courses: courses.allIds.map(id => courses.byId[id]) }
}
  
const mapDispatchToProps = dispatch => ({
    onNewCourse: () => dispatch(push('/courses/new')),
    onCourseHome: (courseId) => dispatch(push(`/courses/${courseId}`))
});

export default connect(mapStateToProps, mapDispatchToProps)(CourseList);
