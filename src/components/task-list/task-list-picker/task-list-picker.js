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
    outline: ${({ isHovered }) => isHovered ? '3px solid grey' : 'none'};
    outline-offset: -3px;
`;
const taskListItemCss = css`
    display: flexbox;
    align-items: center;
    height: ${({ isHovered }) => isHovered ? '60px' : '30px'};
    padding: 3px 0 2px 50px;
    border-bottom: 1px solid black;
    outline: ${({ isHovered }) => isHovered ? '3px solid blue' : 'none'};
    outline-offset: -3px;
`;

function TaskListPicker({ isExpanded, isHovered, tasklists, cursor, shouldRender }, ref) {

    const [tasklist, setTasklist] = useState('tasklist');
    useImperativeHandle(ref, () => ({
        listName: tasklist,
        setTasklist: () => setTasklist(tasklists[cursor].title)
    }));
    if (isExpanded) {
        return <div>
            <div css={headingCss}>Select a Task List</div>
            <div>{
                tasklists.map((item, index) =>
                    shouldRender(index) && <div
                        key={item.id}
                        isHovered={index === cursor}
                        css={taskListItemCss}>
                        <span>{item.title}</span>
                    </div>
                )
            }</div>
        </div>;
    }
    return <div css={headingCss} isHovered={isHovered}>{tasklist}</div>;
}

export default forwardRef(TaskListPicker);
