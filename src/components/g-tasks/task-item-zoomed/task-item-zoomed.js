import React, { useState } from 'react';
import { css } from 'styled-components';
import 'styled-components/macro';

const mainCss = css`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    text-align: left;
    overflow: hidden;
    border-bottom: 1px solid black;
    outline-offset: -3px;
`;
const inputCss = css`
    flex-grow: 1;
    margin: 5px 10px 5px 10px;
    padding: 0 5px 0 5px;
`;
const titleCss = css`
    ${inputCss}
    display: flex;
    height: 30px;
    padding-top: 5px;
`;
const notesCss = css`
    ${inputCss}
    word-wrap: break-word;
`;
const dueCss = css`
    ${inputCss}
`;

const makeOnChangeFunction = (setter) =>
    (event) => {

        setter(event.target.value);
    };

function TaskItemZoomed({ title: initTitle, notes: initNotes, due: initDue }) {

    const [title, setTitle] = useState(initTitle);
    const [notes, setNotes] = useState(initNotes);
    const [due, setDue] = useState(initDue ? new Date(initDue).toISOString().split('T')[0] : '');

    const onTitleChange = makeOnChangeFunction(setTitle);
    const onNotesChange = makeOnChangeFunction(setNotes);
    const onDueChange = makeOnChangeFunction(setDue);

    return <div css={mainCss}>
        <input css={titleCss} type="text" value={title} onChange={onTitleChange} tabIndex="0"/>
        <textarea css={notesCss} rows='20' value={notes} onChange={onNotesChange} tabIndex="0"/>
        <input css={dueCss} type="date" value={due} onChange={onDueChange} tabIndex="0"/>
    </div>;
}

export default TaskItemZoomed;
