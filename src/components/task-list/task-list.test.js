import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import TaskList from './task-list.js';
import TaskListPicker from './task-list-picker/task-list-picker.js';
import TaskItem from './task-item/task-item.js';

Enzyme.configure({ adapter: new Adapter() });

describe('TaskList component', () => {
    it('renders properly', async () => {
        const wrapper = shallow(<TaskList></TaskList>);
        expect(wrapper.find('div')).toBeTruthy();
        expect(wrapper.find(TaskListPicker)).toBeTruthy();
        expect(wrapper.find(TaskItem)).toBeTruthy();
    });
});
