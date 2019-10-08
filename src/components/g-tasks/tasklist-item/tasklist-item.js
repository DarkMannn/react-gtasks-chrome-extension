import React, { useRef } from 'react';
import { css } from 'styled-components';
import 'styled-components/macro';
import setCursorAtTheEnd from '../../../util/set-cursor-at-the-end.js';

const tasklistItemCss = css`
    display: flexbox;
    align-items: center;
    height: ${({ isHovered }) => isHovered ? '60px' : '30px'};
    padding: 3px 0 2px 50px;
    border-bottom: 1px solid black;
    box-shadow: ${({ isHovered }) => !isHovered
        ? 'none'
        : '0 -3px 0 0 cadetblue, 0 2px 0 0 cadetblue'
    };
    outline-offset: -3px;
`;

function TasklistItem({ title, isHovered, isEditingActive, onBlurCallback }) {

    const titleRef = useRef();
    const onBlur = async () => {

        await onBlurCallback(titleRef.current.textContent);
    };

    if (isEditingActive) {
        setTimeout(function focusAndSetCursorAtTheEnd() {

            titleRef.current.focus();
            setCursorAtTheEnd(titleRef.current);
        }, 0);
    }

    return <div
        data-testid='tasklistItem'
        isHovered={isHovered}
        css={tasklistItemCss}>
            <div
                ref={titleRef}
                contentEditable={isHovered}
                suppressContentEditableWarning={true}
                onBlur={onBlur}>
                {title}
            </div>
    </div>;
}

export default TasklistItem;
