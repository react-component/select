import { mount } from 'enzyme';
import React from 'react';
import Option from '../../src/Option';
import Select from '../../src/Select';

export default function focusTest(mode: any, props: any) {
  describe(`focus of ${mode}`, () => {
    let container;

    beforeEach(() => {
      container = document.createElement('div');
      document.body.appendChild(container);
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('focus()', () => {
      const handleFocus = jest.fn();
      const selectRef = React.createRef<any>();

      mount(
        <div>
          <Select ref={selectRef} mode={mode} {...props} onFocus={handleFocus}>
            <Option value="1">1</Option>
            <Option value="2">2</Option>
          </Select>
        </div>,
        { attachTo: container },
      );

      selectRef.current.focus();

      expect(handleFocus).toHaveBeenCalled();
    });

    it('autoFocus', () => {
      const handleFocus = jest.fn();

      mount(
        <Select mode={mode} {...props} autoFocus onFocus={handleFocus}>
          <Option value="1">1</Option>
          <Option value="2">2</Option>
        </Select>,
        { attachTo: container },
      );

      expect(handleFocus).toHaveBeenCalled();
    });

    // TODO: Cancel comment this test
    // https://github.com/ant-design/ant-design/issues/14254
    it.skip('auto focus when defaultOpen is true', () => {
      const handleFocus = jest.fn();

      mount(
        <Select mode={mode} {...props} defaultOpen onFocus={handleFocus}>
          <Option value="1">1</Option>
          <Option value="2">2</Option>
        </Select>,
        { attachTo: container },
      );

      jest.runAllTimers();

      expect(handleFocus).toHaveBeenCalled();
    });
  });
}
