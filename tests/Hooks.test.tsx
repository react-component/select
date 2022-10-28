import React from 'react';
import { render } from '@testing-library/react';
import useLock from '../src/hooks/useLock';
import { injectRunAllTimers } from './utils/common';

describe('Hooks', () => {
  injectRunAllTimers(jest);

  it('useLock', () => {
    jest.useFakeTimers();
    const clearTimeoutSpy = jest.spyOn(window, 'clearTimeout');

    let outSetLock: (newLock: boolean) => void;

    const Component: React.FC<{}> = () => {
      const [, setLock] = useLock();
      outSetLock = setLock;
      return null;
    };

    const { unmount } = render(<Component />);

    clearTimeoutSpy.mockReset();
    outSetLock(true);
    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();

    clearTimeoutSpy.mockRestore();

    jest.runAllTimers();
    jest.useRealTimers();
  });
});
