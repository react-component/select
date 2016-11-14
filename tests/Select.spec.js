/* eslint-disable no-undef */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import TestUtils, { Simulate } from 'react-addons-test-utils';
import Select, { Option } from 'rc-select';
import $ from 'jquery';
import { mount, render } from 'enzyme';
import { renderToJson } from 'enzyme-to-json';

describe('Select', () => {
  let instance;
  let div;

  beforeEach(() => {
    div = document.createElement('div');
    document.body.appendChild(div);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
  });

  it('render to body works', (done) => {
    instance = ReactDOM.render(
      <Select
        value="2"
      >
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
      div);
    instance.setState({
      open: true,
    }, () => {
      expect(instance.getPopupDOMNode().parentNode
        .parentNode.parentNode.nodeName.toLowerCase()).toBe('body');
      expect(instance.getPopupDOMNode().className).not.toContain('hidden');
      done();
    });
  });

  it('renders correctly', () => {
    const wrapper = render(
      <Select className="forTest" openClassName="my-open" value="2">
        <Option value="1">1</Option>
        <Option value="2" disabled>2</Option>
      </Select>
    );

    expect(renderToJson(wrapper)).toMatchSnapshot();
  });

  it('should default select the right option', (done) => {
    instance = ReactDOM.render(
      <Select defaultValue="2">
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>, div);
    instance.setState({
      open: true,
    }, () => {
      expect(instance.getPopupMenuComponent().instanceArray[0].isSelected()).toBe(false);
      expect(instance.getPopupMenuComponent().instanceArray[1].isSelected()).toBe(true);
      done();
    });
  });

  it('should can select multiple items', (done) => {
    instance = ReactDOM.render(
      <Select multiple value={['1', '2']}>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
        <Option value="3">2</Option>
      </Select>, div);
    instance.setState({
      open: true,
    }, () => {
      expect(instance.getPopupMenuComponent().instanceArray[0].isSelected()).toBe(true);
      expect(instance.getPopupMenuComponent().instanceArray[1].isSelected()).toBe(true);
      expect(instance.getPopupMenuComponent().instanceArray[2].isSelected()).toBe(false);
      done();
    });
  });

  it('should show clear button', () => {
    instance = ReactDOM.render(
      <Select value="1" allowClear>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
      div);
    expect(TestUtils.scryRenderedDOMComponentsWithClass(instance,
      'rc-select-selection__clear')[0].style.display).toBe('block');
  });

  it('should hide clear button', () => {
    instance = ReactDOM.render(
      <Select allowClear>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
      div);
    expect(TestUtils.scryRenderedDOMComponentsWithClass(instance,
      'rc-select-selection__clear')[0].style.display).toBe('none');
  });

  it('should not response click event when select is disabled', (done) => {
    instance = ReactDOM.render(
      <Select disabled defaultValue="2">
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>, div);
    Simulate.click(ReactDOM.findDOMNode(instance.refs.selection));
    expect(instance.state.open).not.toBeTruthy();
    done();
  });

  it('should show selected value in singleMode when close', (done) => {
    instance = ReactDOM.render(
      <Select value="1">
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>, div);
    expect($(ReactDOM.findDOMNode(instance))
      .find('.rc-select-selection-selected-value').length).toBe(1);
    done();
  });

  it('should show placeholder in singleMode when value is undefined', (done) => {
    instance = ReactDOM.render(
      <Select placeholder="aaa">
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>, div);
    expect($(ReactDOM.findDOMNode(instance))
      .find('.rc-select-selection__placeholder').length).toBe(1);
    done();
  });

  describe('when open', () => {
    // this.timeout(400000);

    beforeEach((done) => {
      div = document.createElement('div');

      div.tabIndex = 0;
      document.body.appendChild(div);

      instance = ReactDOM.render(
        <Select>
          <Option value="1">1</Option>
          <Option value="2">2</Option>
        </Select>,
        div);


      Simulate.click(ReactDOM.findDOMNode(instance.refs.selection));
      done();
    });

    afterEach(() => {
      ReactDOM.unmountComponentAtNode(div);
    });

    it('should show not found', (done) => {
      instance.getInputDOMNode().value = '4';
      Simulate.change(instance.getInputDOMNode());
      setTimeout(() => {
        expect($(instance.getPopupDOMNode())
          .find('.rc-select-dropdown-menu-item').length).toBe(1);
        expect($(instance.getPopupDOMNode())
          .find('.rc-select-dropdown-menu-item')[0].innerHTML).toBe('Not Found');
        done();
      }, 100);
    });

    it('should show search input in single selection trigger', (done) => {
      expect($(instance.getInputDOMNode()).parents('.rc-select-open').length).toBe(1);
      done();
    });
  });

  describe('automatic tokenization ', () => {
    it('tokenize tag select', () => {
      const wrapper = mount(
        <Select tags tokenSeparators={[',']}>
          <Option value="1">1</Option>
          <Option value="2">2</Option>
        </Select>,
        div);

      wrapper.find('input').simulate('change', { target: {
        value: '2,3,4',
      } });

      expect(wrapper.state().value).toEqual([
        { key: '2', label: '2' },
        { key: '3', label: '3' },
        { key: '4', label: '4' },
      ]);
    });

    it('tokenize multiple select', () => {
      const wrapper = mount(
        <Select multiple optionLabelProp="children" tokenSeparators={[',']}>
          <Option value="1">One</Option>
          <Option value="2">Two</Option>
        </Select>,
      );

      const input = wrapper.find('input');

      input.simulate('change', { target: {
        value: 'One',
      } });

      input.simulate('change', { target: {
        value: 'One,Two,Three',
      } });

      expect(wrapper.state().value).toEqual([
        { key: '1', label: 'One' },
        { key: '2', label: 'Two' },
      ]);
    });
  });

  it('display correct combobox label when it\'s under controllered', (done) => {
    class App extends Component {
      state = {
        value: {
          label: '',
          key: '',
        },
      }

      render() {
        return (
          <Select
            combobox
            labelInValue
            value={this.state.value}
            optionLabelProp="children"
          >
            <Option value="1">One</Option>
            <Option value="2">Two</Option>
          </Select>
        );
      }
    }

    const wrapper = mount(<App />);

    wrapper.setState({ value: { label: 'One', key: '1' } }, () => {
      expect(wrapper.find('input').props().value).toBe('One');
      done();
    });
  });
});
