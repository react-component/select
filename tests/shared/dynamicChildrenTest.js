/* eslint-disable no-undef */
import React from 'react';
import Select from '../../src/Select';
import Option from '../../src/Option';
import { mount } from 'enzyme';

export default function dynamicChildrenTest(mode, props) {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  it('dynamic children', () => {
    const onChange = jest.fn();
    const onSelect = jest.fn();

    class App extends React.Component {

      state = {
        value: ['1'],
        options: [
          <Option key="1" testprop="test">1</Option>,
          <Option key="2">2</Option>,
        ],
      }

      componentDidMount() {
        setTimeout(() => {
          this.updateChildren();
        }, 10);
      }

      updateChildren = () => {
        this.setState({
          options: [
            <Option key="2">2</Option>,
            <Option key="3">3</Option>,
          ],
        });
      }

      render() {
        return (
          <Select
            value={this.state.value}
            ref={node => this.select = node}
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
    wrapper.find('.rc-select').simulate('click');
    wrapper.find('MenuItem').at(1).simulate('click');
    expect(onChange).toBeCalledWith(['1', '3'], [
      <Option key="1" testprop="test">1</Option>,
      <Option key="3">3</Option>,
    ]);
    expect(onSelect).toBeCalledWith('3', <Option key="3">3</Option>);
  });
}
