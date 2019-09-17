import { mount } from 'enzyme';
import React from 'react';
import Select, { Option, SelectProps } from '../../src';
import { injectRunAllTimers, toggleOpen, selectItem, findSelection } from '../utils/common';

export default function dynamicChildrenTest(mode: any, props?: Partial<SelectProps>) {
  injectRunAllTimers(jest);

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
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

      public select: any;

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
            mode={mode}
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
    toggleOpen(wrapper);
    selectItem(wrapper, 1);
    expect(onChange).toHaveBeenCalledWith(
      ['1', '3'],
      [expect.anything(), expect.objectContaining({ value: '3', children: '3-label' })],
    );
    expect(onSelect).toHaveBeenCalledWith(
      '3',
      expect.objectContaining({ value: '3', children: '3-label' }),
    );
  });

  it('value label update with dynamic children', () => {
    class App extends React.Component {
      public state = {
        value: mode === 'multiple' ? [1] : 1,
        options: [
          <Option key="0" value={0} testprop="test">
            0-label
          </Option>,
          <Option key="1" value={1}>
            1-label
          </Option>,
        ],
      };

      public select: any;

      public componentDidMount() {
        setTimeout(() => {
          this.updateChildren();
        }, 10);
      }

      public updateChildren = () => {
        this.setState({
          value: mode === 'multiple' ? [0] : 0,
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
            mode={mode}
            {...props}
          >
            {this.state.options}
          </Select>
        );
      }
    }

    const wrapper = mount(<App />);
    jest.runAllTimers();
    wrapper.update();
    expect(findSelection(wrapper).text()).toEqual('0-label-new');
  });

  it('defaultValue label update with dynamic children', () => {
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

      public select: any;

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
            mode={mode}
            {...props}
          >
            {this.state.options}
          </Select>
        );
      }
    }

    const wrapper = mount(<App />);
    jest.runAllTimers();
    expect(findSelection(wrapper).text()).toEqual('1-label-new');
  });
}
