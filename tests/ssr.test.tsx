import { render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import Select from '../src';
import { injectRunAllTimers } from './utils/common';

// Mock rc-util `canUseDom`
jest.mock('rc-util/lib/Dom/canUseDom', () => {
  return () => global.canUseDom;
});

jest.mock('@rc-component/trigger', () => {
  return jest.requireActual('@rc-component/trigger');
});

describe('Select.SSR', () => {
  injectRunAllTimers(jest);

  beforeEach(() => {
    global.canUseDom = true;
  });

  it('should work', () => {
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    global.canUseDom = false;

    const Demo = () => <Select open />;
    const htmlStr = renderToString(<Demo />);
    expect(htmlStr).toMatchSnapshot();

    // Hydrate
    global.canUseDom = true;
    const container = document.createElement('div');
    container.innerHTML = htmlStr;
    document.body.appendChild(container);
    render(<Demo />, { container, hydrate: true });

    expect(errSpy).not.toHaveBeenCalled();
    errSpy.mockRestore();
  });
});
