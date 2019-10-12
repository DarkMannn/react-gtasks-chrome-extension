import React, { useState, useRef } from 'react';
import { css } from 'styled-components';
import 'styled-components/macro';
import useFocusAndSetCursor from '../../hooks/use-focus-and-set-cursor.js';

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
    box-shadow: ${({ isHovered }) => !isHovered
        ? 'none'
        : '0 -3px 0 0 salmon, 0 2px 0 0 salmon'
    };
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

function TaskItemZoomed({
    title: initTitle, notes: initNotes, due: initDue, cursor, onBlurCallback, isEditingActive
}) {

    const [title, setTitle] = useState(initTitle);
    const [notes, setNotes] = useState(initNotes);
    const [due, setDue] = useState(initDue ? new Date(initDue).toISOString().split('T')[0] : '');

    const inputs = [
        { prop: 'title', ref: useRef(null) },
        { prop: 'notes', ref: useRef(null) },
        { prop: 'due', ref: useRef(null) }
    ];
    const { prop: activeProp, ref: activeRef } = inputs[cursor - 1] || {};
    const condition = isEditingActive && inputs[cursor - 1];
    useFocusAndSetCursor(activeRef, condition);

    const [onTitleChange, onNotesChange, onDueChange] =
        [setTitle, setNotes, setDue].map(makeOnChangeFunction);
    const onBlur = () => {

        const formattedRefValue = cursor === 3
            ? new Date(activeRef.current.value).toISOString()
            : activeRef.current.value
        onBlurCallback({ [activeProp]: formattedRefValue });
    };
    return <div css={mainCss}>
        <input
            ref={inputs[0].ref} css={titleCss} type="text" tabIndex="-1" isHovered={cursor === 1}
            id='title' value={title} onChange={onTitleChange} onBlur={onBlur}
        />
        <textarea
            ref={inputs[1].ref} css={notesCss} rows='20' tabIndex="-1" isHovered={cursor === 2}
            id='notes' value={notes} onChange={onNotesChange} onBlur={onBlur}
        />
        <input
            ref={inputs[2].ref} css={dueCss} type="date" tabIndex="-1" isHovered={cursor === 3}
            id='due' value={due} onChange={onDueChange} onBlur={onBlur}
        />
    </div>;
}

export default TaskItemZoomed;
