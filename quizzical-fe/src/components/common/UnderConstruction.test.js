import { setupEnzyme, componentTest } from '../../testUtils';
import UnderConstruction from './UnderConstruction';

setupEnzyme();

const setup = componentTest(UnderConstruction);

describe('UnderConstruction', () => {
    it('should render an alert', () => {
        const {wrapper} = setup();
        expect(wrapper.exists('div.alert')).toBe(true);
    })
})