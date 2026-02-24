import * as React from 'react';
import KeyCode from '@rc-component/util/lib/KeyCode';
import Select from '../src';
import { injectRunAllTimers, expectOpen, keyDown } from './utils/common';
import { act, fireEvent, render } from '@testing-library/react';

describe('Select.Accessibility', () => {
  injectRunAllTimers(jest);

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('pass aria info to internal input', () => {
    const MySelect = Select as any;
    const { container } = render(<MySelect aria-label="light" data-attr="bamboo" useless="2333" />);
    expect(container.querySelector('input')!.getAttribute('aria-label')).toEqual('light');
  });

  // https://github.com/ant-design/ant-design/issues/56841
  it('spacebar opens dropdown (ARIA combobox)', () => {
    const { container } = render(
      <Select
        options={[
          { label: 'Bamboo', value: 'bamboo' },
          { label: 'Light', value: 'light' },
        ]}
      />,
    );

    const selector = container.querySelector('.rc-select') as HTMLElement;
    expectOpen(container, false);

    fireEvent.focus(container.querySelector('input')!);
    keyDown(selector, 32, { key: ' ' });
    act(() => {
      jest.runAllTimers();
    });
    expectOpen(container);
  });

  // https://github.com/ant-design/ant-design/issues/31850
  it('active index should keep', async () => {
    const onActive = jest.fn();

    const { container } = render(
      <Select
        showSearch
        options={[
          {
            label: 'Little',
            value: 'little',
          },
          {
            label: 'Bamboo',
            value: 'bamboo',
          },
          {
            label: 'Light',
            value: 'light',
          },
        ]}
        onActive={onActive}
      />,
    );

    // First Match
    fireEvent.change(container.querySelector('input')!, { target: { value: 'b' } });
    await act(async () => {
      jest.runAllTimers();
      await Promise.resolve();
    });

    expectOpen(container);
    expect(
      document.querySelector('.rc-select-item-option-active .rc-select-item-option-content')
        .textContent,
    ).toEqual('Bamboo');
    expect(onActive).toHaveBeenCalledWith('bamboo');
    expect(onActive).toHaveBeenCalledTimes(1);

    keyDown(container.querySelector('input')!, KeyCode.ENTER);
    await act(async () => {
      jest.runAllTimers();
      await Promise.resolve();
    });
    expectOpen(container, false);

    // Next Match
    fireEvent.change(container.querySelector('input')!, { target: { value: '' } });
    await act(async () => {
      await Promise.resolve();
    });
    expect(onActive).toHaveBeenCalledWith('bamboo');
    expect(onActive).toHaveBeenCalledTimes(2);

    fireEvent.change(container.querySelector('input')!, { target: { value: 'not exist' } });
    await act(async () => {
      await Promise.resolve();
    });
    expect(onActive).toHaveBeenCalledWith(null);
    expect(onActive).toHaveBeenCalledTimes(3);

    fireEvent.change(container.querySelector('input')!, { target: { value: 'g' } });
    await act(async () => {
      await Promise.resolve();
    });
    expect(onActive).toHaveBeenCalledWith('light');
    expect(onActive).toHaveBeenCalledTimes(4);

    await act(async () => {
      jest.runAllTimers();
      await Promise.resolve();
    });

    expectOpen(container);
    expect(
      document.querySelector('.rc-select-item-option-active .rc-select-item-option-content')!
        .textContent,
    ).toEqual('Light');
  });

  // https://github.com/ant-design/ant-design/issues/51292
  it('edge bug', () => {
    const { container } = render(
      <Select
        mode="combobox"
        options={[
          {
            value: '123',
          },
          {
            value: '1234',
          },
          {
            value: '12345',
          },
        ]}
        defaultValue="123"
      />,
    );

    // Invalid key
    keyDown(container.querySelector('input')!, undefined);
    act(() => {
      jest.runAllTimers();
    });
    expectOpen(container, false);

    // Valid key
    keyDown(container.querySelector('input')!, KeyCode.A);
    act(() => {
      jest.runAllTimers();
    });
    expectOpen(container);
  });

  // https://github.com/ant-design/ant-design/issues/53713
  describe('Select ARIA attributes', () => {
    it('should have correct aria and role attributes in virtual true', () => {
      render(
        <Select
          id="virtual-select"
          open={true}
          options={[
            {
              value: '123',
            },
            {
              value: '1234',
            },
            {
              value: '12345',
            },
          ]}
        />,
      );

      const dropdown = document.querySelector('#virtual-select_list');
      expect(dropdown).toHaveAttribute('role', 'listbox');

      const hiddenOptions = dropdown.querySelectorAll('div[style*="height: 0"] div[role="option"]');
      expect(hiddenOptions.length).toBeGreaterThan(0);
      hiddenOptions.forEach((option) => {
        expect(option).toHaveAttribute('role', 'option');
        const ariaSelected = option.getAttribute('aria-selected');
        if (ariaSelected !== null) {
          expect(['true', 'false']).toContain(ariaSelected);
        }
      });

      const rcVirtual = document.querySelector('.rc-virtual-list-holder-inner');
      expect(rcVirtual).not.toHaveAttribute('role');
      const rcOptionItem = rcVirtual.querySelectorAll('.rc-select-item-option');

      rcOptionItem.forEach((option) => {
        expect(option).not.toHaveAttribute('role');
        expect(option).not.toHaveAttribute('aria-selected');
      });
    });

    it('should have correct aria and role attributes in virtual false', () => {
      render(
        <Select
          id="virtual-select"
          open
          virtual={false}
          options={[
            {
              value: '123',
            },
            {
              value: '1234',
            },
            {
              value: '12345',
            },
          ]}
        />,
      );

      const dropdown = document.querySelector('#virtual-select_list');
      expect(dropdown).toHaveAttribute('role', 'listbox');

      const options = dropdown.querySelectorAll('.rc-select-item-option');
      options.forEach((option) => {
        expect(option).toHaveAttribute('role', 'option');
        const ariaSelected = option.getAttribute('aria-selected');
        if (ariaSelected !== null) {
          expect(['true', 'false']).toContain(ariaSelected);
        }
      });
    });

    it('should pass aria and role attributes to Input component', async () => {
      const { container } = render(
        <Select
          role="group"
          aria-required="true"
          options={[
            {
              value: '123',
            },
            {
              value: '1234',
            },
            {
              value: '12345',
            },
          ]}
        />,
      );

      const wrapper = container.querySelector('.rc-select');
      expect(wrapper).not.toHaveAttribute('role');
      expect(wrapper).not.toHaveAttribute('aria-required');

      const input = container.querySelector('input');
      expect(input).toHaveAttribute('role', 'group');
      expect(input).toHaveAttribute('aria-required', 'true');
    });
  });

  describe('Select Input attributes', () => {
    it('should have correct aria and role attributes by default', () => {
      const { container } = render(
        <Select
          options={[
            {
              value: '123',
            },
            {
              value: '1234',
            },
            {
              value: '12345',
            },
          ]}
        />,
      );

      const input = container.querySelector('input');
      expect(input).toHaveAttribute('role', 'combobox');
      expect(input).toHaveAttribute('aria-expanded', 'false');
      expect(input).toHaveAttribute('aria-haspopup', 'listbox');
      expect(input).not.toHaveAttribute('aria-owns');
      expect(input).toHaveAttribute('aria-autocomplete', 'list');
      expect(input).not.toHaveAttribute('aria-controls');
      expect(input).not.toHaveAttribute('aria-activedescendant');
    });

    it('should have correct aria and role attributes when open', () => {
      const { container } = render(
        <Select
          id="select"
          open
          options={[
            {
              value: '123',
            },
            {
              value: '1234',
            },
            {
              value: '12345',
            },
          ]}
        />,
      );

      const input = container.querySelector('input');
      expect(input).toHaveAttribute('role', 'combobox');
      expect(input).toHaveAttribute('aria-expanded', 'true');
      expect(input).toHaveAttribute('aria-haspopup', 'listbox');
      expect(input).toHaveAttribute('aria-owns', 'select_list');
      expect(input).toHaveAttribute('aria-autocomplete', 'list');
      expect(input).toHaveAttribute('aria-controls', 'select_list');
      expect(input).toHaveAttribute('aria-activedescendant', 'select_list_0');
    });

    // https://github.com/ant-design/ant-design/issues/xxxxx
    it('aria-disabled should be set on disabled options', () => {
      const { container } = render(
        <Select
          open
          options={[
            { label: 'Option A', value: 'a' },
            { label: 'Option B', value: 'b', disabled: true },
            { label: 'Option C', value: 'c' },
          ]}
        />,
      );

      const optionItems = container.querySelectorAll('[role="option"]');
      const optionA = Array.from(optionItems).find((el) => el.textContent === 'a');
      const optionB = Array.from(optionItems).find((el) => el.textContent === 'b');
      expect(optionA).not.toHaveAttribute('aria-disabled', 'true');
      expect(optionB).toHaveAttribute('aria-disabled', 'true');
    });
  });
});
