import { setupEnzyme, componentTest } from '../../testUtils';
import { AnswerCheckbox } from './AnswerCheckbox';

setupEnzyme();

const setup = componentTest(AnswerCheckbox);

describe('AnswerCheckbox', () => {
    it('should handle the correct case', () => {
        const {wrapper} = setup({checked: true});
        expect(wrapper.exists('.btn-success')).toBe(true);
        expect(wrapper.exists('.btn-danger')).toBe(false);
    });

    it('should handle the incorrect case', () => {
        const {wrapper} = setup({checked: false});
        expect(wrapper.exists('.btn-success')).toBe(false);
        expect(wrapper.exists('.btn-danger')).toBe(true);
    });
})