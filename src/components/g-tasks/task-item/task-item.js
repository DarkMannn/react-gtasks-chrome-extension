import React, { useRef } from 'react';
import { css } from 'styled-components';
import 'styled-components/macro';
import setCursorAtTheEnd from '../../../util/set-cursor-at-the-end.js';

const mainCss = css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    text-align: left;
    overflow: hidden;
    border-bottom: 1px solid black;
    outline: ${({ isHovered }) => isHovered ? '3px solid khaki' : 'none'};
    outline-offset: -3px;
`;
const firstRowCss = css`
    display: flex;
    height: 30px;
    padding-top: 5px;
    font-size: 1.5vh;
`;
const secondRowCss = css`
    display: flex;
    height: 30px;
    padding-bottom: 5px;
    font-size: 1.2vh;
`;
const checkboxCss = css`
    display: inline-block;
    width: 70px;
    text-align: center;
    color: ${({ isChecked }) => isChecked ? 'grey' : 'black'};
`;
const titleCss = css`
    display: inline-block;
    width: 230px;
    word-wrap: break-word;
    text-decoration-line: ${({ isChecked }) => isChecked ? 'line-through' : 'none'};
    color: ${({ isChecked }) => isChecked ? 'grey' : 'black'};
`;
const dueCss = css`
    display: inline-block;
    width: 70px;
    text-align: center;
`;
const notesCss = css`
    width: 230px;
    word-wrap: break-word;
    border-top: 1px solid black;
`;

function TaskItem({ title, status, notes, due, isHovered, isEditingActive, onBlurCallback }) {

    const titleRef = useRef();
    const isChecked = status === 'completed';
    const onBlur = async () => {

        await onBlurCallback(titleRef.current.innerText);
    };

    if (isEditingActive) {
        setTimeout(function focusAndSetCursorAtTheEnd() {

            titleRef.current.focus();
            setCursorAtTheEnd(titleRef.current);
        }, 0);
    }

    return <div isHovered={isHovered} css={mainCss}>
        <div css={firstRowCss}>
            <div isChecked={isChecked} css={checkboxCss}>{isChecked ? '\u2611' : '\u2610'}</div>
            <div
                ref={titleRef}
                css={titleCss}
                isChecked={isChecked}
                contentEditable={isHovered}
                suppressContentEditableWarning={true}
                onBlur={onBlur}>
                {title}
            </div>
        </div>
        {isHovered && <div css={secondRowCss}>
                {due && <div css={dueCss}>{due}</div>}
                {notes && <div css={notesCss}>{notes}</div>}
            </div>
        }
    </div>;
}

export default TaskItem;
