import React from 'react';
import { css } from 'styled-components';
import 'styled-components/macro';

const tasklistItemCss = css`
    display: flexbox;
    align-items: center;
    height: ${({ isHovered }) => isHovered ? '60px' : '30px'};
    padding: 3px 0 2px 50px;
    border-bottom: 1px solid black;
    outline: ${({ isHovered }) => isHovered ? '3px solid cadetblue' : 'none'};
    outline-offset: -3px;
`;

function TasklistItem({ title, isHovered }) {

    return <div
        isHovered={isHovered}
        css={tasklistItemCss}>
        <span>{title}</span>
    </div>;
}

export default TasklistItem;
