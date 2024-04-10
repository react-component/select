import * as React from 'react';
import Select, { OptGroup, Option } from '../src';
import { fireEvent, render } from '@testing-library/react';

describe('Select.Group', () => {
  it('group name support search', () => {
    const { container } = render(
      <Select showSearch>
        <OptGroup label="zombiej">
          <Option value="1">1</Option>
          <Option value="2">2</Option>
        </OptGroup>
      </Select>,
    );

    fireEvent.change(container.querySelector('input'), { target: { value: 'zombiej' } });

    expect(document.querySelector('.rc-select-item-group').textContent).toEqual('zombiej');
    expect(document.querySelectorAll('.rc-select-item-option-content')[0].textContent).toEqual('1');
    expect(document.querySelectorAll('.rc-select-item-option-content')[1].textContent).toEqual('2');
  });

  it('group child option support search', () => {
    const { container } = render(
      <Select showSearch>
        <OptGroup label="zombiej">
          <Option value="1">1</Option>
          <Option value="2">2</Option>
        </OptGroup>
      </Select>,
    );

    fireEvent.change(container.querySelector('input'), { target: { value: '1' } });
    expect(document.querySelector('.rc-select-item-group')).toBeTruthy();
    expect(document.querySelectorAll('.rc-select-item-option-content')).toHaveLength(1);
  });

  describe('group title', () => {
    it('label as title', () => {
      const { container } = render(
        <Select open>
          <OptGroup label="zombiej" />
        </Select>,
      );

      expect(container.querySelector('.rc-select-item-group').getAttribute('title')).toEqual(
        'zombiej',
      );
    });

    it('customize title', () => {
      const { container } = render(
        <Select open>
          <OptGroup label="zombiej" title="bamboo" />
        </Select>,
      );

      expect(container.querySelector('.rc-select-item-group').getAttribute('title')).toEqual(
        'bamboo',
      );
    });

    it('title as undefined', () => {
      const { container } = render(
        <Select open>
          <OptGroup label={<span>zombiej</span>} />
        </Select>,
      );

      expect(container.querySelector('.rc-select-item-group').getAttribute('title')).toBeNull();
    });
  });

  it('group options exist undefined/null', () => {
    const { container } = render(
      <Select
        open
        options={[
          {
            label: 'zombiej',
            options: [{ label: 'jackson', value: 'jackson' }],
          },
          {
            label: 'bamboo',
            options: undefined,
          },
          {
            label: 'mocha',
            options: null,
          },
        ]}
      />,
    );

    expect(container.querySelectorAll('.rc-select-item-group')).toHaveLength(3);
    expect(container.querySelectorAll('.rc-select-item-option')).toHaveLength(1);

    expect(container.querySelectorAll('.rc-select-item')[2].getAttribute('title')).toEqual(
      'bamboo',
    );
    expect(container.querySelectorAll('.rc-select-item')[3].getAttribute('title')).toEqual('mocha');
  });
});
