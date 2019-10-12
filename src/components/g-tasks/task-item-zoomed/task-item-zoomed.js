import React, {
    useState, useEffect, useRef
} from 'react';
import { css } from 'styled-components';
import 'styled-components/macro';
import setCursorAtTheEnd from '../../../util/set-cursor-at-the-end.js';

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

    const titleRef = useRef(null);
    const notesRef = useRef(null);
    const dueRef = useRef(null);
    const inputs = [titleRef, notesRef, dueRef];

    useEffect(function focusOneInput() {

        if (isEditingActive && inputs[cursor - 1]) {
            inputs[cursor - 1].current.focus();
            setCursorAtTheEnd(inputs[cursor - 1].current);
        }
    }, [cursor, inputs, isEditingActive]);

    const [onTitleChange, onNotesChange, onDueChange] =
        [setTitle, setNotes, setDue].map(makeOnChangeFunction);
    const onBlur = () => {

        const propertyByInputIndex = () =>
            cursor === 1 ? 'title'
            : cursor === 2 ? 'notes'
            : cursor === 3 ? 'due'
            : null;
        const valueByInputIndex = () => cursor === 3
            ? new Date(inputs[cursor - 1].current.value).toISOString()
            : inputs[cursor - 1].current.value

        onBlurCallback({ [propertyByInputIndex()]: valueByInputIndex() });
    };

    return <div css={mainCss}>
        <input
            ref={titleRef} css={titleCss} type="text" tabIndex="-1" isHovered={cursor === 1}
            id='title' value={title} onChange={onTitleChange} onBlur={onBlur}
        />
        <textarea
            ref={notesRef} css={notesCss} rows='20' tabIndex="-1" isHovered={cursor === 2}
            id='notes' value={notes} onChange={onNotesChange} onBlur={onBlur}
        />
        <input
            ref={dueRef} css={dueCss} type="date" tabIndex="-1" isHovered={cursor === 3}
            id='due' value={due} onChange={onDueChange} onBlur={onBlur}
        />
    </div>;
}

export default TaskItemZoomed;
