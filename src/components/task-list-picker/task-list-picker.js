import React from 'react';
import { css } from 'styled-components';
import 'styled-components/macro';

const bodyCss = css`
`;
const headingCss = css`
    padding: 15px 0 15px 0;
    border-top: 4px double black;
    border-bottom: 4px double black;
`;
const taskListCss = css`
    padding: 10px 0 10px 50px;
    border-bottom: 2px solid black;
    text-align: left;
`;

function TaskListPicker() {
    return <div>
        <div css={headingCss}>Task List Picker</div>
        <div css={bodyCss}>
            {dummyTaskListItems.map((item, index) => <div key={index} css={taskListCss}>{item}</div>)}
        </div>
    </div>;
}

export default TaskListPicker;

let dummyTaskListItems = [...Array(10)].map((_, ind) => `List${ind}`);
