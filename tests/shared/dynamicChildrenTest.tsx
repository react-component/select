import { mount } from 'enzyme';
import React from 'react';
import Option from '../../src/Option';
import Select from '../../src/Select';

export default function dynamicChildrenTest(mode, props?) {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  it('dynamic children', () => {
    const onChange = jest.fn();
    const onSelect = jest.fn();

    class App extends React.Component {
      public state = {
        value: ['1'],
        options: [
          <Option key="1" testprop="test">
            1-label
          </Option>,
          <Option key="2">2-label</Option>,
        ],
      };
      public select: Select;

      public componentDidMount() {
        setTimeout(() => {
          this.updateChildren();
        }, 10);
      }

      public updateChildren = () => {
        this.setState({
          options: [<Option key="2">2-label</Option>, <Option key="3">3-label</Option>],
        });
      };

      public render() {
        return (
          <Select
            value={this.state.value}
            ref={node => {
              this.select = node;
            }}
            {...{ [mode]: true }}
            {...props}
            onChange={onChange}
            onSelect={onSelect}
          >
            {this.state.options}
          </Select>
        );
      }
    }

    const wrapper = mount(<App />);
    jest.runAllTimers();
    wrapper.update();
    wrapper.find('.rc-select').simulate('click');
    wrapper
      .find('MenuItem')
      .at(1)
      .simulate('click');
    expect(onChange).toBeCalledWith(
      ['1', '3'],
      [
        <Option key="1" testprop="test">
          1-label
        </Option>,
        <Option key="3">3-label</Option>,
      ],
    );
    expect(onSelect).toBeCalledWith('3', <Option key="3">3-label</Option>);
  });

  it('value label update with dynamic children', () => {
    // tslint:disable-next-line:max-classes-per-file
    class App extends React.Component {
      public state = {
        value: 1,
        options: [
          <Option key="0" value={0} testprop="test">
            0-label
          </Option>,
          <Option key="1" value={1}>
            1-label
          </Option>,
        ],
      };
      public select: Select;

      public componentDidMount() {
        setTimeout(() => {
          this.updateChildren();
        }, 10);
      }

      public updateChildren = () => {
        this.setState({
          value: 0,
          options: [
            <Option key="0" value={0}>
              0-label-new
            </Option>,
            <Option key="1" value={1}>
              1-label-new
            </Option>,
          ],
        });
      };

      public render() {
        return (
          <Select
            optionLabelProp="children"
            value={this.state.value}
            ref={node => {
              this.select = node;
            }}
            {...{ [mode]: true }}
            {...props}
          >
            {this.state.options}
          </Select>
        );
      }
    }

    const wrapper = mount(<App />);
    jest.runAllTimers();
    expect(
      wrapper
        .update()
        .find('.rc-select-selection__choice__content')
        .text(),
    ).toEqual('0-label-new');
  });

  it('defaultValue label update with dynamic children', () => {
    // tslint:disable-next-line:max-classes-per-file
    class App extends React.Component {
      public state = {
        value: ['1'],
        options: [
          <Option key="1" testprop="test">
            1-label
          </Option>,
          <Option key="2">2-label</Option>,
        ],
      };
      public select: Select;

      public componentDidMount() {
        setTimeout(() => {
          this.updateChildren();
        }, 10);
      }

      public updateChildren = () => {
        this.setState({
          options: [<Option key="1">1-label-new</Option>, <Option key="2">2-label</Option>],
        });
      };

      public render() {
        return (
          <Select
            optionLabelProp="children"
            defaultValue={this.state.value}
            ref={node => {
              this.select = node;
            }}
            {...{ [mode]: true }}
            {...props}
          >
            {this.state.options}
          </Select>
        );
      }
    }

    const wrapper = mount(<App />);
    jest.runAllTimers();
    expect(
      wrapper
        .update()
        .find('.rc-select-selection__choice__content')
        .text(),
    ).toEqual('1-label-new');
  });
}
