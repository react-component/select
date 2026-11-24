import React, { act } from 'react';
import { render, renderHook } from '@testing-library/react';
import useLock from '../src/hooks/useLock';
import useOpen from '../src/hooks/useOpen';
import { injectRunAllTimers } from './utils/common';

describe('Hooks', () => {
  injectRunAllTimers(jest);

  describe('useOpen', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.runAllTimers();
      jest.useRealTimers();
    });

    it.each([undefined, true])('unlocks a canceled close with open=%s', (open) => {
      const onOpen = jest.fn();
      const cancelFun = jest.fn(() => true);
      const { result } = renderHook(() => useOpen(true, open, onOpen, (value) => value));

      act(() => {
        result.current[2](false, { cancelFun });
      });
      expect(result.current[3]).toBe(true);
      expect(cancelFun).not.toHaveBeenCalled();

      jest.runAllTimers();

      expect(cancelFun).toHaveBeenCalledTimes(1);
      expect(result.current[0]).toBe(true);
      expect(result.current[1]).toBe(true);
      expect(result.current[3]).toBe(false);
      expect(onOpen).not.toHaveBeenCalled();
    });

    it('closes and unlocks when not canceled', () => {
      const onOpen = jest.fn();
      const { result } = renderHook(() => useOpen(true, undefined, onOpen, (value) => value));

      act(() => {
        result.current[2](false, { cancelFun: () => false });
      });
      expect(result.current[1]).toBe(true);
      expect(result.current[3]).toBe(true);

      jest.runAllTimers();

      expect(result.current[0]).toBe(false);
      expect(result.current[1]).toBe(false);
      expect(result.current[3]).toBe(false);
      expect(onOpen).toHaveBeenCalledTimes(1);
      expect(onOpen).toHaveBeenCalledWith(false);
    });

    it('unlocks immediately when reopened before a close completes', () => {
      const onOpen = jest.fn();
      const cancelFun = jest.fn(() => false);
      const { result } = renderHook(() => useOpen(true, undefined, onOpen, (value) => value));

      act(() => {
        result.current[2](false, { cancelFun });
      });
      expect(result.current[3]).toBe(true);

      act(() => {
        result.current[2](true);
      });
      expect(result.current[3]).toBe(false);

      jest.runAllTimers();

      expect(result.current[1]).toBe(true);
      expect(result.current[3]).toBe(false);
      expect(cancelFun).not.toHaveBeenCalled();
      expect(onOpen).not.toHaveBeenCalled();
    });

    it('does not let a stale close unlock a newer close', () => {
      const onOpen = jest.fn();
      const cancelFun = jest.fn(() => true);
      const { result } = renderHook(() => useOpen(true, undefined, onOpen, (value) => value));

      act(() => {
        result.current[2](false, { cancelFun });
        jest.advanceTimersByTime(5);
        result.current[2](false);
        jest.advanceTimersByTime(5);
      });

      expect(cancelFun).not.toHaveBeenCalled();
      expect(result.current[1]).toBe(true);
      expect(result.current[3]).toBe(true);
      expect(onOpen).not.toHaveBeenCalled();

      jest.runAllTimers();

      expect(result.current[1]).toBe(false);
      expect(result.current[3]).toBe(false);
      expect(onOpen).toHaveBeenCalledTimes(1);
      expect(onOpen).toHaveBeenCalledWith(false);
    });
  });

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
