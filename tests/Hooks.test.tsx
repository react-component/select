import React, { useState } from 'react';
import { mount } from 'enzyme';
import useLock from '../src/hooks/useLock';
import useEffectAfterInit from '../src/hooks/useEffectAfterInit';
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

  it('useEffectAfterInit', () => {
    const MyComponent = () => {
      const [dependencyProp, setDependencyProp] = useState('a');
      const [state, setState] = useState(1);
      useEffectAfterInit(() => {
        setState(2);
      }, [dependencyProp]);

      return (
        <div>
          <span className="state">{state}</span>
          <span className="dependencyProp"  onClick={() => setDependencyProp('b')}>
            {dependencyProp}
          </span>
        </div>
      );
    };

    const wrapper = mount(<MyComponent />);
    expect(wrapper.find('.state').text()).toBe('1');
    wrapper.find('.dependencyProp').simulate('click');
    expect(wrapper.find('.state').text()).toBe('2');
  });
});
