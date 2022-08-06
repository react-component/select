import type { DraftValueType } from '@/Select';

/**
 * @param inputNameAttributeVal - name value passed from <Select> component
 * @param value - the value or value(s) selected from the <Select> component
 * @param prefixCls
 *
 * @description
 * This function generates hidden `<input>` element(s) after a value is Selected from the <Select> component.
 * These hidden inputs serve as the value containers for the selected <Option>'s
 *
 * This is to achieve HTML5 `<form>` compatability & is an additive feature that is backwards compatiable with
 * existing ant's <Select> component. For morebackground context & history, see discussions below:
 *  - https://github.com/tailwindlabs/headlessui/pull/1214
 *  - https://github.com/react-component/select/issues/799
 */
export const generateHiddenInputs = (
  inputNameAttributeVal: string,
  value: string | string[] | DraftValueType[] | DraftValueType | any,
  prefixCls = 'rc-select',
) => {
  // We will append the hidden inputs below this element. The hidden inputs act as value container(s) for the selected option values.
  const rcSelectInputElement = document.querySelector(
    `.${prefixCls} input[class^="${prefixCls}"]`,
  ) as HTMLInputElement;
  if (!rcSelectInputElement) return;

  /**
   * Part 1:
   * Before creating any new hidden inputElements, first check if we have any existing inputs that were generated
   * from previously calling `onSelect`, `onDeselect`, `onChange` etc.
   */
  const hiddenInputCSSSelector = `.${prefixCls} input.hidden-input`;
  const hiddenInputElements = Array.from(document.querySelectorAll(hiddenInputCSSSelector));
  hiddenInputElements.forEach((hiddenInputElement) => hiddenInputElement.remove());

  // debugger;
  /**
   * Part 2:
   * Generate new hidden <input /> Elements and append them in the .rc-select container.
   */
  if (Array.isArray(value)) {
    value.forEach((val) => {
      const _val = val?.value ? val.value : val;
      const hiddenInputElement = document.createElement('input');
      hiddenInputElement.setAttribute('type', 'hidden');
      hiddenInputElement.setAttribute('name', inputNameAttributeVal);
      hiddenInputElement.setAttribute('value', _val);
      hiddenInputElement.setAttribute('class', 'hidden-input');
      rcSelectInputElement.insertAdjacentElement(`afterend`, hiddenInputElement);
    });
  } else {
    // Select value is single value
    const _val = value?.value ? value.value : value;
    const hiddenInputElement = document.createElement('input');
    hiddenInputElement.setAttribute('type', 'hidden');
    hiddenInputElement.setAttribute('name', inputNameAttributeVal);
    hiddenInputElement.setAttribute('value', _val);
    hiddenInputElement.setAttribute('class', 'hidden-input');
    rcSelectInputElement.insertAdjacentElement(`afterend`, hiddenInputElement);
  }
};
