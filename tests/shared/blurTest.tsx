import React, { createElement } from 'react';
import Option from '../../src/Option';
import Select from '../../src/Select';
import { injectRunAllTimers } from '../utils/common';
import { type RenderResult, render, fireEvent, createEvent } from '@testing-library/react';

export default function blurTest(mode: any) {
  describe(`blur of ${mode}`, () => {
    injectRunAllTimers(jest);

    let wrapper: RenderResult;
    let container;
    const selectRef = React.createRef<any>();

    const renderDemo = (props?: any) => (
      <Select ref={selectRef} mode={mode} {...props}>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>
    );

    beforeEach(() => {
      container = document.createElement('div');
      document.body.appendChild(container);

      wrapper = render(renderDemo());
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('clears inputValue', () => {
      // wrapper.find('input').simulate('change', { target: { value: '1' } });
      fireEvent.change(wrapper.container.querySelector('input'), { target: { value: '1' } });
      // wrapper.find('input').simulate('blur');
      fireEvent.blur(wrapper.container.querySelector('input'));

      // expect(wrapper.find('input').getDOMNode().value).toBe('');
      expect(wrapper.container.querySelector('input').value).toBe('');
    });

    it('blur()', () => {
      const handleBlur = jest.fn();
      // wrapper.setProps({ onBlur: handleBlur });
      wrapper.rerender(renderDemo({ onBlur: handleBlur }));
      selectRef.current.focus();
      selectRef.current.blur();
      expect(handleBlur).toHaveBeenCalled();
    });

    if (mode === 'multiple' || mode === 'tags') {
      it('wont blur when click input box', () => {
        jest.useFakeTimers();
        const handleBlur = jest.fn();
        // wrapper.setProps({ onBlur: handleBlur });
        wrapper.rerender(renderDemo({ onBlur: handleBlur }));
        // wrapper.find('input').instance().focus();
        fireEvent.focus(wrapper.container.querySelector('input'));
        expect(handleBlur).not.toHaveBeenCalled();

        // wrapper.find('input').simulate('blur');
        fireEvent.blur(wrapper.container.querySelector('input'));
        expect(handleBlur).toHaveBeenCalled();

        // wrapper.update();
        // wrapper.find('input').instance().blur();
        fireEvent.blur(wrapper.container.querySelector('input'));
        jest.runAllTimers();
        handleBlur.mockReset();

        const preventDefault = jest.fn();
        const mouseDownEvent = createEvent.mouseDown(
          wrapper.container.querySelector('.rc-select-selector'),
        );
        mouseDownEvent.preventDefault = preventDefault;
        // wrapper.find('.rc-select-selector').simulate('mousedown', {
        //   preventDefault,
        // });
        fireEvent(wrapper.container.querySelector('.rc-select-selector'), mouseDownEvent);
        expect(preventDefault).toHaveBeenCalled();
        expect(handleBlur).not.toHaveBeenCalled();

        jest.useRealTimers();
      });
    }
  });
}
