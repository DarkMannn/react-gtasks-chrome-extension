import React, { useRef } from 'react';
import { css } from 'styled-components';
import 'styled-components/macro';
import useFocusAndSetCursor from '../../hooks/use-focus-and-set-cursor.js';

const tasklistItemCss = css`
    display: flexbox;
    align-items: center;
    height: ${({ isHovered }) => isHovered ? '60px' : '30.5px'};
    padding: 2px 0 2px 50px;
    border-bottom: 1px solid black;
    box-shadow: ${({ isHovered }) => !isHovered
        ? 'none'
        : '0 -3px 0 0 cadetblue, 0 2px 0 0 cadetblue'
    };
    transition: box-shadow 0.15s linear 0s;
    outline-offset: -3px;
    text-align: left;
    ${({ isEditingActive }) => isEditingActive && `
        overflow: hidden;
        white-space: nowrap;
    `};
`;

function TasklistItem({ title, isHovered, isEditingActive, onBlurCallback }) {

    const titleRef = useRef(null);
    useFocusAndSetCursor(titleRef, isEditingActive);

    const truncatedTitle = isEditingActive
        ? title
        : title.substring(0, 22);
    const optionalThreeDots = !isEditingActive && title.length > 22 ? '...' : '';
    const formatedTitle = `${truncatedTitle}${optionalThreeDots}`;
    const onBlur = async () => {

        await onBlurCallback(titleRef.current.textContent);
    };
    return <div
        data-testid='tasklistItem'
        isHovered={isHovered}
        css={tasklistItemCss}>
            <div
                ref={titleRef}
                contentEditable={isHovered}
                suppressContentEditableWarning={true}
                onBlur={onBlur}>
                {formatedTitle}
            </div>
    </div>;
}

export default TasklistItem;
