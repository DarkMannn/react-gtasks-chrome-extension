import React, { useRef } from 'react';
import { css } from 'styled-components';
import 'styled-components/macro';
import useFocusAndSetCursor from '../../hooks/use-focus-and-set-cursor.js';

const mainCss = css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: left;
    border-bottom: 1px solid black;
    box-shadow: ${({ isHovered, isOnTopFaded, isChecked }) =>
        (isOnTopFaded || (isHovered && isChecked)) ? '0 -3px 0 0 lightgrey, 0 2px 0 0 lightgrey'
        : isHovered ? '0 -3px 0 0 cadetblue, 0 2px 0 0 cadetblue'
        : 'none'
    };
    transition: box-shadow 0.15s linear 0s;
    outline-offset: -3px;
`;
const firstRowCss = css`
    display: flex;
    align-items: center;
    height: ${({ isHovered, secondRowHidden }) =>
        !isHovered ? '30px'
        : secondRowHidden ? '60px'
        : '35px'
    };
    padding: ${({ isHovered, secondRowHidden }) => (!isHovered || secondRowHidden)
        ? '2px 0 2px 0'
        : '0'
    };
    font-size: 14px;
    overflow: hidden;
`;
const secondRowCss = css`
    display: flex;
    height: 25px;
    padding-bottom: 5px;
    font-size: 10px;
    overflow: hidden;
`;
const checkboxCss = css`
    display: inline-block;
    width: 70px;
    text-align: center;
    color: ${({ isChecked }) => isChecked ? 'lightgrey' : 'black'};
`;
const titleCss = css`
    display: inline-block;
    width: 230px;
    ${({ isEditingActive }) => isEditingActive && `
        overflow: hidden;
        white-space: nowrap;
    `}
    text-decoration-line: ${({ isChecked }) => isChecked ? 'line-through' : 'none'};
    color: ${({ isChecked }) => isChecked ? 'lightgrey' : 'black'};
`;
const dueCss = css`
    display: inline-block;
    padding-top: 4px;
    width: 70px;
    text-align: center;
`;
const notesCss = css`
    display: inline-block;
    padding-top: 2px;
    width: 230px;
    border-top: 1px solid black;
`;

function TaskItem({
    title, status, notes, due, isHovered, isOnTopFaded, isEditingActive, onBlurCallback
}) {

    const titleRef = useRef(null);
    useFocusAndSetCursor(titleRef, isEditingActive);

    const isChecked = status === 'completed';
    const truncatedTitle =
        isEditingActive ? title
        : !isHovered || (due || notes) ? title.substring(0, 27)
        : title.substring(0, 57);
    const optionalThreeDots = !isEditingActive && title.length > 27 ? '...' : '';
    const formatedTitle = `${truncatedTitle}${optionalThreeDots}`;
    const onBlur = async () => {

        await onBlurCallback(titleRef.current.textContent);
    };
    return <div
        data-testid="task-item"
        isHovered={isHovered}
        isOnTopFaded={isOnTopFaded}
        isChecked={isChecked}
        css={mainCss}>
        <div isHovered={isHovered || isOnTopFaded} secondRowHidden={!due && !notes} css={firstRowCss}>
            <div
                data-testid="checkbox"
                isChecked={isChecked}
                css={checkboxCss}>
                {isChecked ? '\u2611' : '\u2610'}
            </div>
            <div
                data-testid="title"
                ref={titleRef}
                css={titleCss}
                isChecked={isChecked}
                contentEditable={isHovered}
                isEditingActive={isEditingActive}
                suppressContentEditableWarning={true}
                onBlur={onBlur}>
                {formatedTitle}
            </div>
        </div>
        {isHovered && (due || notes) &&
        <div css={secondRowCss}>
            <div data-testid="due" css={dueCss}>{due}</div>
            <div data-testid="notes" css={notesCss}>{notes}</div>
        </div>
        }
    </div>;
}

export default TaskItem;
