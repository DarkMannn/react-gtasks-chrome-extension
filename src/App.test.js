import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import App from './App';

it('renders without crashing', async () => {
    const div = document.createElement('div');
    await act(async () => {
        ReactDOM.render(<App />, div)
    });
    ReactDOM.unmountComponentAtNode(div);
});
