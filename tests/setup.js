(function polyfill() {
  let lastTime = 0;
  const vendors = ['ms', 'moz', 'webkit', 'o'];
  let x;
  let length;
  let currTime;
  let timeToCall;

  for (x = 0, length = vendors.length; x < length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[`${vendors[x]}RequestAnimationFrame`];
    window.cancelAnimationFrame =
    window[`${vendors[x]}CancelAnimationFrame`] ||
    window[`${vendors[x]}CancelRequestAnimationFrame`];
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function requestAnimationFrame(callback) {
      currTime = new Date().getTime();
      timeToCall = Math.max(0, 16 - (currTime - lastTime));
      lastTime = currTime + timeToCall;
      return window.setTimeout(() => { callback(currTime + timeToCall); },
        timeToCall);
    };
  }

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function cancelAnimationFrame(id) {
      clearTimeout(id);
    };
  }
}());

const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

Enzyme.configure({ adapter: new Adapter() });
