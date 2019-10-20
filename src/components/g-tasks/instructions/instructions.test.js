import React from 'react';
import Instructions from './instructions.js';
import { render } from '@testing-library/react';
import { toHaveTextContent } from '@testing-library/jest-dom';

expect.extend({ toHaveTextContent });

describe('Instructions component', () => {

    it('renders properly', async () => {

        const { findByTestId } = render(
            <Instructions></Instructions>
        );

        await findByTestId('instructions');
    });
});
