export function expectOpen(wrapper: any, open: boolean = true) {
  const expectWrapper = expect(wrapper.find('.rc-select').hasClass('rc-select-open'));

  if (open) {
    expectWrapper.toBeTruthy();
  } else {
    expectWrapper.toBeFalsy();
  }
}
