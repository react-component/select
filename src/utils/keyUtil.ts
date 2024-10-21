import KeyCode from 'rc-util/lib/KeyCode';

/** keyCode Judgment function */
export function isValidateOpenKey(currentKeyCode: number): boolean {
  // https://github.com/ant-design/ant-design/issues/45609
  return [
    KeyCode.ENTER
  ].includes(currentKeyCode);
}
