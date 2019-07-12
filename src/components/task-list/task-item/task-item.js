import React from 'react';
import { css } from 'styled-components';
import 'styled-components/macro';

const mainCss = css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    text-align: left;
    border-bottom: 1px solid black;
`;
const firstRowCss = css`
    display: flex;
    padding-top: 5px;
`;
const secondRowCss = css`
    display: flex;
    padding-bottom: 5px;
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
    font-size: 1.2vh;
`;
const notesCss = css`
    width: 230px;
    word-wrap: break-word;
    border-top: 1px solid black;
`;

function TaskItem({ title, status, notes, due, isHovered }) {

    const isChecked = status === 'completed';

    return <div css={mainCss}>
        <div css={firstRowCss}>
            <div css={checkboxCss}>{isChecked ? '\u2611' : '\u2610'}</div>
            <div css={titleCss} isChecked={isChecked}>{title}</div>
        </div>
        {isHovered &&
            <div css={secondRowCss}>
                {due && <div css={dueCss}>{due}</div>}
                {notes && <div css={notesCss}>{notes}</div>}
            </div>
        }
    </div>;
}

export default TaskItem;
