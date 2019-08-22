import React from 'react';
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
    outline-offset: -3px;
`;
const titleCss = css`
    display: flex;
    height: 30px;
    padding-top: 5px;
`;
const notesCss = css`
    ${'' /* display: inline-block;
    width: 230px; */}
    word-wrap: break-word;
`;
const dateCss = css`
    width: 230px;
    word-wrap: break-word;
    border-top: 1px solid black;
`;

function TaskItemZoomed({ title, status, notes, due }) {

    return <div css={mainCss}>
        <div css={titleCss}>
            <input type="text" name="" id=""/>
        </div>
        <div css={notesCss}>
            <input type="text" name="" id=""/>
        </div>
        <div css={dateCss}>
            <input type="datetime" name="" id=""/>
        </div>
    </div>;
}

export default TaskItemZoomed;
