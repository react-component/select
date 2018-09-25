/* eslint-disable no-undef */
import React from 'react';
import { mount } from 'enzyme';
import Select from '../../src/Select';
import Option from '../../src/Option';

export default function focusTest(mode, props) {
  let container;

  beforeEach(() => {
    container = global.document.createElement('div');
    global.document.body.appendChild(container);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('focus()', () => {
    const handleFocus = jest.fn();

    class App extends React.Component {
      componentDidMount() {
        this.select.focus();
      }

      render() {
        return (
          <Select
            ref={node => { this.select = node; }}
            {...{ [mode]: true }}
            {...props}
            onFocus={handleFocus}
          >
            <Option value="1">1</Option>
            <Option value="2">2</Option>
          </Select>
        );
      }
    }

    mount(<App />, { attachTo: container });

    jest.runAllTimers();

    expect(handleFocus).toBeCalled();
  });

  it('autoFocus', () => {
    const handleFocus = jest.fn();

    mount(
      <Select
        {...{ [mode]: true }}
        {...props}
        autoFocus
        onFocus={handleFocus}
      >
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
      { attachTo: container }
    );

    jest.runAllTimers();

    expect(handleFocus).toBeCalled();
  });
}
