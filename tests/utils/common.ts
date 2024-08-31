import { act } from 'react';
import { createEvent, fireEvent } from '@testing-library/react';

export function expectOpen(wrapper: any, open: boolean = true) {
  if (wrapper instanceof HTMLElement) {
    expect(!!wrapper.querySelector('.rc-select-open')).toBe(open);
    return;
  }

  const expectWrapper = expect(wrapper.find('.rc-select').hasClass('rc-select-open'));

  if (open) {
    expectWrapper.toBeTruthy();
  } else {
    expectWrapper.toBeFalsy();
  }
}

export function toggleOpen(wrapper: any) {
  if (wrapper instanceof HTMLElement) {
    fireEvent.mouseDown(wrapper.querySelector('.rc-select-selector'));
    return;
  }
  wrapper.find('.rc-select-selector').simulate('mousedown');
}

export function selectItem(wrapper: any, index: number = 0) {
  if (wrapper instanceof HTMLElement) {
    fireEvent.click(wrapper.querySelectorAll('.rc-select-item-option-content')[index]);
    return;
  }
  wrapper.find('div.rc-select-item-option-content').at(index).simulate('click');
}

export function findSelection(wrapper: any, index: number = 0) {
  if (wrapper instanceof HTMLElement) {
    const itemNode = wrapper.querySelectorAll('.rc-select-selection-item')[index];
    const contentNode = itemNode.querySelector('.rc-select-selection-item-content');

    if (contentNode) {
      return contentNode;
    }

    return itemNode;
  } else {
    const itemNode = wrapper.find('.rc-select-selection-item').at(index);
    const contentNode = itemNode.find('.rc-select-selection-item-content');

    if (contentNode.length) {
      return contentNode;
    }

    return itemNode;
  }
}

export function removeSelection(wrapper: any, index: number = 0) {
  const preventDefault = jest.fn();

  if (wrapper instanceof HTMLElement) {
    const ele = wrapper.querySelectorAll('.rc-select-selection-item-remove')[index];
    const mouseDownEvent = createEvent.mouseDown(ele);
    mouseDownEvent.preventDefault = preventDefault;

    fireEvent(ele, mouseDownEvent);
    fireEvent.click(wrapper.querySelectorAll('.rc-select-selection-item-remove')[index]);
  } else {
    wrapper
      .find('.rc-select-selection-item')
      .at(index)
      .find('.rc-select-selection-item-remove')
      .last()
      .simulate('mousedown', { preventDefault })
      .simulate('click');
  }

  expect(preventDefault).toHaveBeenCalled();
}

type Jest = typeof jest;

export function injectRunAllTimers(jest: Jest) {
  let originRunAllTimers: typeof jest.runAllTimers;

  beforeAll(() => {
    originRunAllTimers = jest.runAllTimers;

    jest.runAllTimers = () => {
      let result;
      act(() => {
        result = originRunAllTimers();
      });
      return result;
    };
  });

  afterAll(() => {
    jest.runAllTimers = originRunAllTimers;
  });
}

export function keyDown(element: HTMLElement, keyCode: number) {
  const event = createEvent.keyDown(element, { keyCode });

  act(() => {
    fireEvent(element, event);
  });
}

export function keyUp(element: HTMLElement, keyCode: number) {
  const event = createEvent.keyUp(element, { keyCode });

  act(() => {
    fireEvent(element, event);
  });
}
