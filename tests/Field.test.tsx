/* eslint-disable import/no-named-as-default-member */
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import * as React from 'react';
import Select from '../src';
import { injectRunAllTimers } from './utils/common';

describe('Select.Field', () => {
  injectRunAllTimers(jest);

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('fieldNames should work', () => {
    // Use special name to avoid compatible match
    const wrapper = mount(
      <Select
        open
        options={
          [
            {
              bambooLabel: 'Bamboo',
              bambooChildren: [
                { bambooLabel: 'Light', bambooValue: 'light' },
                { bambooLabel: 'Little', bambooValue: 'little' },
              ],
            },
          ] as any
        }
        fieldNames={{
          label: 'bambooLabel',
          value: 'bambooValue',
          children: 'bambooChildren',
        }}
      />,
    );

    act(() => {
      jest.runAllTimers();
    });

    // expect(wrapper.);
    console.log('>>>', wrapper.find('.rc-virtual-list-holder-inner').html());
  });
});
