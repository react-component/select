import focusTest from './shared/focusTest';
import blurTest from './shared/blurTest';
import keyDownTest from './shared/keyDownTest';
import inputFilterTest from './shared/inputFilterTest';

describe('Select', () => {
  focusTest('single', {});
  blurTest('single');
  keyDownTest('single');
  inputFilterTest('single');
});
