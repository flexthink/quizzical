import React from 'react';
import { componentTest, setupEnzyme } from '../../testUtils';
import IfEmpty from './IfEmpty';

setupEnzyme();

const setup = componentTest(IfEmpty);

describe('IfEmpty component', () => {
    const nonEmpty = <div className="items">items</div>;

    it('should render an alert if empty', () => {
        const {wrapper} = setup({value: [], children: nonEmpty});
        expect(wrapper.exists('div.alert')).toBe(true);
        expect(wrapper.exists('div.items')).toBe(false);
    })

    it('should render children if not empty', () => {
        const {wrapper} = setup({value: [{title: 'one'}, {title: 'two'}], children: nonEmpty});
        expect(wrapper.exists('div.alert')).toBe(false);
        expect(wrapper.exists('div.items')).toBe(true);
    })
})