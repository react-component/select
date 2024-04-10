import React from 'react';
import SelectTrigger from '../src/SelectTrigger';
import { render } from '@testing-library/react';

// Mock Trigger module
jest.mock('@rc-component/trigger', () => {
  const OriTrigger = jest.requireActual('@rc-component/trigger').default;

  const MockTrigger = (props: any) => {
    global.triggerProps = props;
    return <OriTrigger {...props} />;
  };

  return MockTrigger;
});

describe('Select.Trigger', () => {
  it('set popupTransitionName if animation given', () => {
    const SimpleSelectTrigger = SelectTrigger as any;

    render(
      <SimpleSelectTrigger prefixCls="rc-select" animation="slide-up">
        <div>foo</div>
      </SimpleSelectTrigger>,
    );

    expect(global.triggerProps.popupTransitionName).toBe('rc-select-dropdown-slide-up');
  });
});
