import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { IntlProvider } from 'react-intl';
import { StaticRouter } from 'react-router';
import { shallowWithIntl, mountWithIntl } from 'enzyme-react-intl';

const SHALLOW = 'shallow',
      MOUNT = 'mount';

export function setupEnzyme() {
    Enzyme.configure({ adapter: new Adapter() });
}

const wrappers = {
    [SHALLOW]: shallowWithIntl,
    [MOUNT]: mountWithIntl,
}

export function componentTest(component, mockProps) {
    return (props, options={}) => { 
        const {mode = MOUNT} = options;
        const wrap = wrappers[mode];
        const effectiveProps = {...mockProps, ...props};
        const wrapper = wrap(
            <StaticRouter location="test" context={{}}>
                <IntlProvider locale="en">
                    {React.createElement(component, effectiveProps)}
                </IntlProvider>
            </StaticRouter>
         )
    
        return {
          props,
          wrapper
        }    
    }
  }