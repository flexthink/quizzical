import { setupEnzyme, componentTest, SHALLOW } from '../../testUtils';
import { AnswerChoiceEdit } from './AnswerChoiceEdit';

setupEnzyme();
const setup = componentTest(AnswerChoiceEdit);

describe('AnswerChoiceEdit', () => {
    it('should render an answer choice', () => {
        const answer = {
            answer: '2x + 3',
            checked: true
        }

        const { wrapper } = setup({answerChoice: answer}, {mode: SHALLOW});
        expect(wrapper.find('Col')).toHaveLength(3);
        expect(wrapper.find('Input').text()).toEqual('2x + 3');
    });
});