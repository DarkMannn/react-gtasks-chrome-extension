import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import TaskListPicker from './task-list-picker.js';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('TaskListPicker component', () => {
    it('renders properly', async () => {
        const wrapper = shallow(<TaskListPicker></TaskListPicker>);
        expect(wrapper.find('div')).toBeTruthy();
        expect(wrapper.find('ul')).toBeTruthy();
    });
});
