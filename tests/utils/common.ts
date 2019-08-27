import { act } from 'react-dom/test-utils';

export function expectOpen(wrapper: any, open: boolean = true) {
  const expectWrapper = expect(wrapper.find('.rc-select').hasClass('rc-select-open'));

  if (open) {
    expectWrapper.toBeTruthy();
  } else {
    expectWrapper.toBeFalsy();
  }
}

export function toggleOpen(wrapper: any) {
  wrapper.find('.rc-select-selector').simulate('mousedown');
}

export function selectItem(wrapper: any, index: number = 0) {
  wrapper
    .find('div.rc-select-item-option-content')
    .at(index)
    .simulate('click');
}

export function findSelection(wrapper: any, index: number = 0) {
  return wrapper.find('.rc-select-selection-item').at(index);
}

type Jest = typeof jest;

export function injectRunAllTimers(jest: Jest) {
  let originRunAllTimers: typeof jest.runAllTimers;

  beforeAll(() => {
    originRunAllTimers = jest.runAllTimers;

    jest.runAllTimers = () => {
      let result: typeof jest;
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
