import React from 'react';
import { css } from 'styled-components';
import 'styled-components/macro';
import TaskListPicker from './task-list-picker/task-list-picker.js';
import TaskItem from './task-item/task-item.js';

const mainCss = css``;

function TaskList({ list, items }) {
    return <div css={mainCss}>
        <TaskListPicker></TaskListPicker>
        {[...Array(5)].map((item, index) => <TaskItem key={index} title='ddd' notes={notes}></TaskItem>)}
    </div>;
}

export default TaskList;

var notes = `asdfsfasdfasdfasdfasdfasdfasdfasdfasdfasdfas
asfdasfasfdasdfasdfasdf
asdfasdfasfasfdasdfasd
fasfasdfasfdasfasdf`;
