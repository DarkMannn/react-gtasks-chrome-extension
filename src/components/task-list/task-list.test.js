import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import TaskList from './task-list.js';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('TaskList component', () => {
    it('renders properly', async () => {
        const wrapper = shallow(<TaskList></TaskList>);
        expect(wrapper.find('div')).toBeTruthy();
    });
});
