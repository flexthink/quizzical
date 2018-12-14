import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import NoMatch from './components/NoMatch';
import CoursePage from './components/courses/CoursePage';
import CourseList from './components/courses/CourseList';
import CourseHome from './components/courses/CourseHome';
import CourseEdit from './components/courses/CourseEdit';
import QuestionList from './components/questions/QuestionList';
import QuestionEdit from './components/questions/QuestionEdit';
import UserList from './components/users/UserList';
import UserEdit from './components/users/UserEdit';
import Login from './components/users/Login';
import Logout from './components/users/Logout';
import Practice from './components/learn/Practice';
import About from './components/About';
import PrivateRoute from './components/PrivateRoute';
import * as courseActions from './actions/courses';
import * as userActions from './actions/users';
import * as questionActions from './actions/questions';
import { routeTo } from './util';
//import { fetchQuestionList, newQuestion, fetchQuestion } from './actions/questions';
import { startPractice } from './actions/learn';

const Routes = () => (
    <Switch>
        <Route exact path="/" render={() => (<Redirect to="/login" />)} />
        <Route exact path="/about" 
            component={About} />
        <PrivateRoute exact path="/courses" 
            component={routeTo(CourseList, courseActions.getList)} />
        <PrivateRoute exact path="/courses/new"
            component={CourseEdit} />
        <PrivateRoute exact path="/courses/:courseId"
            component={routeTo(CoursePage(CourseHome), courseActions.get, 'courseId')} />
        <PrivateRoute exact path="/courses/:courseId/edit" 
            component={routeTo(CoursePage(CourseEdit), courseActions.get, 'courseId')} />
        <PrivateRoute exact path="/courses/:courseId/questions/new" 
            component={routeTo(CoursePage(QuestionEdit), questionActions.newQuestion, 'courseId')} />
        <PrivateRoute exact path="/courses/:courseId/questions"
             component={routeTo(CoursePage(QuestionList), questionActions.getList, 'courseId')} />
        <PrivateRoute exact path="/courses/:courseId/questions/:questionId" component={routeTo(CoursePage(QuestionEdit), questionActions.get, 'questionId', 'courseId')} />
        <PrivateRoute exact path="/courses/:courseId/practice" component={routeTo(CoursePage(Practice), startPractice, 'courseId')} />
        <PrivateRoute exact path="/users" component={routeTo(UserList, userActions.getList)} />
        <PrivateRoute exact path="/users/new" component={UserEdit} />
        <PrivateRoute exact path="/users/:userId/edit" component={routeTo(UserEdit, userActions.get, 'userId')} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/logout" component={Logout} />

        <Route component={NoMatch} />              
    </Switch>        
);
export default Routes;