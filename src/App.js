import React, { useState, useEffect } from 'react';
import { css } from 'styled-components';
import 'styled-components/macro';
import GTasks from './components/g-tasks/g-tasks.js';
import loadGapi from './util/load-gapi.js';

const mainCss = css`
    position: fixed;
    top: 0;
    left: 0;
    width: 300px;
    height: 100vh;
    border: 2px solid black;
    text-align: center;
`;
const headerCss = css`
    background-color: #282c34;
    width: 100%;
    height: 33px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 24px;
`;
const bodyCss = css`
    width: 100%;
    height: 100%;
    color: black;
    font-size: 19px;
`;

function App() {

    const [gapi, setGapi] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [hasErrored, setHasErrored] = useState(false);

    useEffect(function () {

        (async function loadGapiAndSetState() {

            try {
                const initializedGapi = await loadGapi();
                setGapi(initializedGapi);
                setIsLoading(false);
            }
            catch (err) {
                setHasErrored(true);
            }
        })();
    }, []);

    let body;
    if (isLoading) {
        body = <div>Loading...</div>;
    }
    else if (hasErrored) {
        body = <div>Something happened. Please reload page. :/</div>;
    }
    else {
        body = <GTasks gapiTasks={gapi.client.tasks}></GTasks>;
    }

    return <div css={mainCss}>
        <header css={headerCss}>Google Tasks Popup</header>
        <div css={bodyCss}>{body}</div>
    </div>;
}

export default App;
