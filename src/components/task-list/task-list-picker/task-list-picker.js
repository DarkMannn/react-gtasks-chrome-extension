import React, {
    useState,
    useImperativeHandle,
    forwardRef
} from 'react';
import { css } from 'styled-components';
import 'styled-components/macro';

const headingCss = css`
    padding: 15px 0 15px 0;
    border-top: 4px double black;
    border-bottom: 4px double black;
    outline: ${({ isHovered }) => isHovered ? '1px solid blue' : 'none'}
`;
const taskListCss = css`
    padding: 10px 0 10px 50px;
    border-bottom: 1px solid black;
    text-align: left;
    outline: ${({ isHovered }) => isHovered ? '1px solid blue' : 'none'}
`;

function TaskListPicker({ isActive, isHovered, taskLists, cursor }, ref) {

    const [taskList, setTaskList] = useState('Initial Task List');
    useImperativeHandle(ref, () => ({ listName: taskList, setTaskList: () => setTaskList(taskLists[cursor]) }));
    if (isActive) {
        return <div>
            <div css={headingCss}>Select a Task List</div>
            <div>{
                taskLists.map((item, index) =>
                    <div key={index} isHovered={index === cursor} css={taskListCss}>{item}</div>
                )
            }</div>
        </div>;
    }
    return <div css={headingCss} isHovered={isHovered}>{taskList}</div>;
}

export default forwardRef(TaskListPicker);
