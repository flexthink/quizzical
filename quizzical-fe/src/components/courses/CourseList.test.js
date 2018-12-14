import { CourseList } from './CourseList';
import { setupEnzyme, componentTest } from '../../testUtils';

setupEnzyme();

const setup = componentTest(CourseList, {addTodo: jest.fn()});
describe('CourseList component', () => {
    it('should render an alert if there are no courses', () => { 
        const props = {
            courses: []
        };
        const {wrapper} = setup(props);
        expect(wrapper.exists('table')).toBe(false);
        expect(wrapper.exists('div.alert')).toBe(true);
    })

    it('should render a course list', () => {
        const props = {
            courses: [
                {
                    'uuid': '1aae457a-274d-40cd-bc12-311f6050fbe8',
                    'title': 'algebra',
                    'summary': 'Exes and whys',
                    'description': 'foo bar'
                },
                {
                    'uuid': 'cbe3fbd3-0b07-42b7-95cb-1a3a88e7b34b',
                    'title': 'calculus',
                    'summary': 'Dee over deeex',
                    'description': 'foo bar'
                }                
            ]
        };
        const {wrapper} = setup(props);
        expect(wrapper.exists('div.alert')).toBe(false);
        expect(wrapper.exists('div.card-deck')).toBe(true);
        expect(wrapper.find('div.card')).toHaveLength(2);
    })

})