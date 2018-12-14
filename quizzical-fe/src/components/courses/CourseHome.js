import React from 'react'

import { Nav, NavItem, NavLink, Button } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';


export const CourseHome = ({course}) => (
    <>
        <div className="description">
            {course.description}
        </div>
        <Nav vertical className="py-3">
            <NavItem>
                <NavLink href={`/courses/${course.uuid}/practice`}>
                    <FontAwesomeIcon icon="graduation-cap" size="4x" className="px-3" />
                    <FormattedMessage id="app.course.practice" defaultMessage="Practice" />
                </NavLink>
            </NavItem>
            <NavItem>
                <NavLink href={`/courses/${course.uuid}/questions`}>
                    <FontAwesomeIcon icon="chalkboard-teacher" size="4x" className="px-3" />
                    <FormattedMessage id="app.course.questions" defaultMessage="Questions" />
                </NavLink>
            </NavItem>
        </Nav>
    </>
);

const mapStateToProps = state => {
    const course  = state.courses.current || {};
    return { course }
}

export default connect(mapStateToProps)(CourseHome);