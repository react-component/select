import React from 'react';
import { mount } from 'enzyme';
import useLock from '../src/hooks/useLock';
import { injectRunAllTimers } from './utils/common';

describe('Hooks', () => {
  injectRunAllTimers(jest);

  it('useLock', () => {
    jest.useFakeTimers();

    let outSetLock: (newLock: boolean) => void;

    const Component: React.FC<{}> = () => {
      const [, setLock] = useLock();
      outSetLock = setLock;
      return null;
    };

    const wrapper = mount(<Component />);

    outSetLock(true);
    wrapper.unmount();

    expect(window.clearTimeout).toHaveBeenCalled();

    jest.runAllTimers();
    jest.useRealTimers();
  });
});
