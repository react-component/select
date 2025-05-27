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

    keyDown(container.querySelector('input')!, KeyCode.ENTER);
    expectOpen(container, false);

    // Next Match
    fireEvent.change(container.querySelector('input')!, { target: { value: '' } });
    await act(async () => {
      await Promise.resolve();
    });
    expect(onActive).toHaveBeenCalledWith('bamboo');

    fireEvent.change(container.querySelector('input')!, { target: { value: 'not exist' } });
    await act(async () => {
      await Promise.resolve();
    });
    expect(onActive).toHaveBeenCalledWith(null);

    fireEvent.change(container.querySelector('input')!, { target: { value: 'g' } });
    await act(async () => {
      await Promise.resolve();
    });
    expect(onActive).toHaveBeenCalledWith('light');

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
});
