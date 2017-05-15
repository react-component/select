/* eslint-disable no-undef */
import React from 'react';
import PropTypes from 'prop-types';
import createClass from 'create-react-class';
import FilterMixin from '../src/FilterMixin';
import Menu from 'rc-menu';
import OptGroup from '../src/OptGroup';
import Option from '../src/Option';
import { render, mount } from 'enzyme';

describe('FilterMixin', () => {
  const Select = createClass({
    propTypes: {
      value: PropTypes.any,
      inputValue: PropTypes.string,
    },

    mixins: [FilterMixin],

    getDefaultProps() {
      return {
        optionFilterProp: 'value',
      };
    },

    getInitialState() {
      const value = this.props.value ? [{ key: this.props.value }] : null;
      return {
        inputValue: this.props.inputValue,
        value,
      };
    },

    render() {
      return (
        <Menu>
          {this.renderFilterOptions(this.state.inputValue)}
        </Menu>
      );
    },
  });

  describe('renderFilterOptionsFromChildren', () => {
    const filterFn = (input, child) => {
      return child.props.value.includes(input);
    };

    it('renders options correctly', () => {
      const wrapper = render(
        <Select inputValue="1">
          <OptGroup label="group1">
            <Option value="1">1</Option>
            <Option value="2">2</Option>
          </OptGroup>
          <OptGroup label="group2">
            <Option value="3" disabled>3</Option>
            <Option value="4">4</Option>
          </OptGroup>
        </Select>
      );

      expect(wrapper).toMatchSnapshot();
    });

    it('set label as key for OptGroup', () => {
      const wrapper = mount(
        <Select>
          <OptGroup key="group1">
            <Option value="1">1</Option>
            <Option value="2">2</Option>
          </OptGroup>
        </Select>
      );

      expect(wrapper.find('MenuItemGroup').props().title).toBe('group1');
    });

    it('filters children by inputValue', () => {
      const wrapper = render(
        <Select inputValue="1" filterOption={filterFn}>
          <Option value="1">1</Option>
          <Option value="2">2</Option>
          <Option value="11" disabled>11</Option>
        </Select>
      );

      expect(wrapper).toMatchSnapshot();
    });

    it('renders not found when search result is empty', () => {
      const wrapper = render(
        <Select inputValue="3" filterOption={filterFn} notFoundContent="not found">
          <Option value="1">1</Option>
          <Option value="2">2</Option>
        </Select>
      );

      expect(wrapper).toMatchSnapshot();
    });

    it('warns on invalid children', () => {
      const Foo = () => <div>foo</div>;
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mount(
        <Select>
          <Foo value="1" />
        </Select>
      );
      expect(spy.mock.calls.length).toBe(1);
      expect(spy.mock.calls[0][0]).toContain(
        'the children of `Select` should be `Select.Option` or `Select.OptGroup`, ' +
          `instead of \`Foo\`.`
      );
      spy.mockRestore();
    });

    it('filterOption could be true as described in default value', () => {
      const wrapper = render(
        <Select inputValue="3" filterOption>
          <Option value="1">1</Option>
          <Option value="2">2</Option>
        </Select>
      );

      expect(wrapper).toMatchSnapshot();
    });

    describe('tag mode', () => {
      it('renders unlisted item in value', () => {
        const wrapper = render(
          <Select tags value="3">
            <Option value="1">1</Option>
            <Option value="2">2</Option>
          </Select>
        );

        expect(wrapper).toMatchSnapshot();
      });

      it('renders search value when not fount', () => {
        const wrapper = render(
          <Select tags value="22" inputValue="2">
            <Option value="1">1</Option>
          </Select>
        );

        expect(wrapper).toMatchSnapshot();
      });

      it('use filterOption', () => {
        const filterOption = (inputValue, option) =>
          option.props.value
            .toLowerCase()
            .indexOf(inputValue.toLowerCase()) !== -1;

        const wrapper = render(
          <Select tags inputValue="red" filterOption={filterOption}>
            <Option value="Red">Red</Option>
          </Select>
        );

        expect(wrapper).toMatchSnapshot();
      });
    });
  });
});
