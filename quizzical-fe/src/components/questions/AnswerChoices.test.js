import { setupEnzyme, componentTest, SHALLOW } from '../../testUtils';
import { AnswerChoices } from './AnswerChoices';

setupEnzyme();

const setup = componentTest(AnswerChoices);

describe('AnswerChoicesEdit', () => {
    it('should render answers', () => {
        const answers = [
            {
                answer: 'foo',
                correct: false
            },
            {
                answer: 'bar',
                correct: true
            }
        ];
        const question = {
            question: 'The answer is',
            answers
        };
        const { wrapper } = setup({question}, {mode: SHALLOW});
        expect(wrapper.find('Row')).toHaveLength(2);
    });
});