import { mount, render } from 'enzyme';
import { Item as MenuItem, ItemGroup as MenuItemGroup } from 'rc-menu';
import React from 'react';
import DropdownMenu from '../src/DropdownMenu';

describe('DropdownMenu', () => {
  it('renders correctly', () => {
    const menuItems = [
      <MenuItemGroup key="group1">
        <MenuItem key="1">1</MenuItem>
      </MenuItemGroup>,
      <MenuItemGroup key="group2">
        <MenuItem key="2">2</MenuItem>
      </MenuItemGroup>,
    ];

    const wrapper = render(<DropdownMenu menuItems={menuItems} value={['1']} />);

    expect(wrapper).toMatchSnapshot();
  });

  it('save first active item', () => {
    const menuItems = [<MenuItem key="1">1</MenuItem>, <MenuItem key="2">2</MenuItem>];

    const wrapper = mount<DropdownMenu>(<DropdownMenu menuItems={menuItems} value={['1']} />);

    expect(wrapper.instance().firstActiveItem.props.children).toBe('1');
  });

  it('set active key to menu', () => {
    const menuItems = [<MenuItem key="1">1</MenuItem>, <MenuItem key="2">2</MenuItem>];

    const wrapper = mount<DropdownMenu>(<DropdownMenu menuItems={menuItems} value={['1']} />);

    wrapper.setProps({ visible: true });
    expect((wrapper.find('Menu').props() as any).activeKey).toBe('1');

    wrapper.setProps({ inputValue: 'foo' });
    expect((wrapper.find('Menu').props() as any).activeKey).toBe('');
  });

  it('save firstActiveValue', () => {
    const menuItems = [<MenuItem key="1">1</MenuItem>, <MenuItem key="2">2</MenuItem>];

    const wrapper = mount<DropdownMenu>(
      <DropdownMenu menuItems={menuItems} firstActiveValue="2" />,
    );

    expect(wrapper.instance().firstActiveItem.props.children).toBe('2');
  });

  it('set firstActiveValue key to menu', () => {
    const menuItems = [<MenuItem key="1">1</MenuItem>, <MenuItem key="2">2</MenuItem>];

    const wrapper = mount(<DropdownMenu menuItems={menuItems} firstActiveValue="2" />);

    wrapper.setProps({ visible: true });
    expect(((wrapper.find('Menu').props() as any) as any).activeKey).toBe('2');

    wrapper.setProps({ inputValue: 'foo' });
    expect((wrapper.find('Menu').props() as any).activeKey).toBe('');
  });

  it('save value not firstActiveValue', () => {
    const menuItems = [<MenuItem key="1">1</MenuItem>, <MenuItem key="2">2</MenuItem>];

    const wrapper = mount<DropdownMenu>(
      <DropdownMenu value={['1']} menuItems={menuItems} firstActiveValue="2" />,
    );

    expect(wrapper.instance().firstActiveItem.props.children).toBe('1');
  });

  it('save visible and inputValue when update', () => {
    const wrapper = mount<DropdownMenu>(<DropdownMenu />);

    wrapper.setProps({ visible: true, inputValue: 'foo' });

    expect(wrapper.instance().lastVisible).toBe(true);
    expect(wrapper.instance().lastInputValue).toBe('foo');
  });

  it('not update when next visible is false', () => {
    const wrapper = mount<DropdownMenu>(<DropdownMenu />);

    expect(wrapper.instance().shouldComponentUpdate({ visible: true })).toBe(true);
    expect(wrapper.instance().shouldComponentUpdate({ visible: false })).toBe(false);
  });

  it('should updated when input value change', () => {
    const wrapper = mount<DropdownMenu>(<DropdownMenu visible={false} inputValue="test" />);

    expect(wrapper.instance().shouldComponentUpdate({ inputValue: 'test2' })).toBe(true);
  });
});
