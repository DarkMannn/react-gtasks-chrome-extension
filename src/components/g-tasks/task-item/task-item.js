import React, { useRef } from 'react';
import { css } from 'styled-components';
import 'styled-components/macro';

const mainCss = css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    text-align: left;
    overflow: hidden;
    border-bottom: 1px solid black;
    outline: ${({ isHovered }) => isHovered ? '3px solid gold' : 'none'};
    outline-offset: -3px;
`;
const firstRowCss = css`
    display: flex;
    height: 30px;
    padding-top: 5px;
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
`;
const titleCss = css`
    display: inline-block;
    width: 230px;
    word-wrap: break-word;
    text-decoration-line: ${({ isChecked }) => isChecked ? 'line-through' : 'none'};
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
    const onBlur = () => {

        onBlurCallback(titleRef.current.innerText);
    };

    if (isEditingActive) {
        setTimeout(function setCursorAtTheEnd() {

            titleRef.current.focus();

            const range = document.createRange();
            const sel = window.getSelection();
            const childNodesLength = titleRef.current.childNodes.length;
            const lastNode = titleRef.current.childNodes[childNodesLength - 1];

            if (!lastNode) {
                return;
            }

            range.setStart(lastNode, lastNode.length);
            range.collapse(true);

            sel.removeAllRanges();
            sel.addRange(range);
        }, 0);
    }

    return <div isHovered={isHovered} css={mainCss}>
        <div css={firstRowCss}>
            <div css={checkboxCss}>{isChecked ? '\u2611' : '\u2610'}</div>
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
