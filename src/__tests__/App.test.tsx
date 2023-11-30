import React from 'react';
import { render } from '@testing-library/react';
import App from '../App';

test('Smoke test application as a whole', () => {
  render(<App />);
});
