import { mount } from 'enzyme';
import * as React from 'react';
import Option from '../../src/Option';
import Select from '../../src/Select';

declare const global: any;

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
      public select: any;
      public componentDidMount() {
        this.select.focus();
      }

      public render() {
        return (
          <Select
            ref={node => {
              this.select = node;
            }}
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
      <Select {...{ [mode]: true }} {...props} autoFocus={true} onFocus={handleFocus}>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
      { attachTo: container },
    );

    jest.runAllTimers();

    expect(handleFocus).toBeCalled();
  });

  // https://github.com/ant-design/ant-design/issues/14254
  it('auto focus when defaultOpen is ture', () => {
    const handleFocus = jest.fn();

    mount(
      <Select {...{ [mode]: true }} {...props} defaultOpen={true} onFocus={handleFocus}>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
      { attachTo: container },
    );

    jest.runAllTimers();

    expect(handleFocus).toBeCalled();
  });
}
