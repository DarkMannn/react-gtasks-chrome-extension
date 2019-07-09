import React from 'react';
import { css } from 'styled-components';
import 'styled-components/macro';

const headingCss = css`
    padding: 15px 0 15px 0;
    border-top: 4px double black;
    border-bottom: 4px double black;
`;
const taskListCss = css`
    padding: 10px 0 10px 50px;
    border-bottom: 1px solid black;
    text-align: left;
`;

function TaskListPicker({ isActive }) {

    if (isActive) {
        return <div>
            <div css={headingCss}>Select a Task List</div>
            <div>
                {dummyTaskListItems.map((item, index) => <div key={index} css={taskListCss}>{item}</div>)}
            </div>
        </div>;
    }
    return <div css={headingCss}>Task 1</div>;
}

export default TaskListPicker;

let dummyTaskListItems = [...Array(20)].map((_, ind) => `List${ind}`);
