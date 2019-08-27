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
