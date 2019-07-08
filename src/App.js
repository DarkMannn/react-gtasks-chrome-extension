import React, { useEffect } from 'react';
import { css } from 'styled-components';
import 'styled-components/macro';
import TaskListPicker from './components/task-list-picker/task-list-picker.js';
import TaskList from './components/task-list/task-list.js';

const mainCss = css`
    position: fixed;
    top: 0;
    left: 0;
    width: 300px;
    height: 100vh;
    text-align: center;
`;
const headerCss = css`
    background-color: #282c34;
    width: 100%;
    height: 10vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 2.5vh;
`;
const bodyCss = css`
    width: 100%;
    height: 100%;
    background-color: #2d6570;
    color: #282c34;
    font-size: 2vh;
`;

function App() {
    return <div css={mainCss}>
        <header css={headerCss}>
            Google Tasks Power Mode
        </header>
        <div css={bodyCss}>
            {/* <TaskListPicker></TaskListPicker> */}
            <TaskList list="ovo je lista"></TaskList>
        </div>
    </div>;
}

export default App;
