import React from 'react';
import { css } from 'styled-components';
import 'styled-components/macro';

const mainCss = css`
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: white;
`;
const titleCss = css`
    height: 28px;
    background-color: #282c34;
    color: white;
`;
const instructionsCss = css`
    width: 100%;
    height: ${({ showFor, showInstructions }) =>
        !showInstructions ? 0
        : showFor === 'tasklist' ? '72px'
        : showFor === 'tasks' ? '108px'
        : '36px'
    };
    opacity: ${({ showInstructions }) => showInstructions ? 1 : 0 };
    display: flex;
    justify-content: left;
    flex-wrap: wrap;
    text-align: left;
    transition: opacity, height 0.15s linear 0s;
`;
const instructionCss = css`
    flex-grow: 1;
    border: 1px solid black;
    height: 30px;
    width: 65px;
    padding: 2px;
    font-size: 10px;
    text-align: center;
    overflow: hidden;
`;

const isMac = navigator.appVersion.includes("Mac");
const generalKeybindings = [
    [`${isMac ? '⌘' : 'ctrl'}+shift+K`, 'toggle popup'],
    ['↑', 'scroll up'],
    ['↓', 'scroll down']
];
const tasklistKeybindings = [
    ...generalKeybindings,
    ['enter', 'edit tasklist'],
    ['ctrl + enter', 'create tasklist'],
    ['shift + enter', 'load tasks'],
    ['ctrl + del', 'delete tasklist']
];
const tasksKeybindings = [
    ...generalKeybindings,
    ['shift + ↑', 'move up'],
    ['shift + ↓', 'move down'],
    ['enter', 'edit task'],
    ['ctrl + enter', 'create task'],
    ['shift+enter', 'expand task'],
    ['ctrl + del', 'delete task'],
    ['ctrl + space', 'complete task'],
    ['ctrl + shift + H', 'hide completed']
];
const taskKeybindings = [
    ...generalKeybindings,
    ['enter', 'edit task']
];

const keybindingsByShowForHash = {
    'tasklist' : tasklistKeybindings,
    'tasks': tasksKeybindings,
    'task': taskKeybindings
};

function Instructions({ showFor, showInstructions }) {

    const keybindings = keybindingsByShowForHash[showFor] || [];
    const arrow = showInstructions ? '↓' : '↑';
    return <div data-testid="instructions" css={mainCss}>
        <div css={titleCss}>{arrow} Keybindings {arrow} - [ctrl + I]</div>
        <div showFor={showFor} showInstructions={showInstructions} css={instructionsCss}>
            {keybindings.map(([key, instr], ind) =>
            <div key={ind} css={instructionCss}>
                <div><b>[{key}]</b></div>
                <div>{instr}</div>
            </div>
            )}
        </div>
    </div>;
}

export default Instructions;
