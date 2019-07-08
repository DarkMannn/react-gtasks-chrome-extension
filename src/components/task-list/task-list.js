import React from 'react';
import { css } from 'styled-components';
import 'styled-components/macro';
import TaskItem from './task-item/task-item.js';

const mainCss = css`
`;
const headingCss = css`
    padding: 15px 0 15px 0;
    border-top: 4px double black;
    border-bottom: 4px double black;
`;

function TaskList({ list, items }) {
    return <div css={mainCss}>
        <div css={headingCss}>{list}</div>
        {[...Array(5)].map((item, index) => <TaskItem key={index} title='ddd' notes={notes}></TaskItem>)}
    </div>;
}

export default TaskList;

var notes = `asdfsfasdfasdfasdfasdfasdfasdfasdfasdfasdfas
asfdasfasfdasdfasdfasdf
asdfasdfasfasfdasdfasd
fasfasdfasfdasfasdf`;
