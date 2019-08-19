import * as React from 'react';
import Select, { Option, OptGroup } from '../src';
import '../assets/index.less';
import './common.less';

const focusProps = {
  onFocus: ({ target }) => {
    console.log('Focus:', target);
  },
  onBlur: ({ target }) => {
    console.log('Blur:', target);
  },
};

const consoleEvent = (name: string) => {
  return (...args: any[]) => {
    console.log(name, ':', ...args);
  };
};

const Demo = () => {
  const selectProps = {
    onChange: consoleEvent('Change'),
    onSelect: consoleEvent('Select'),
    onDeselect: consoleEvent('Deselect'),
  };

  return (
    <div>
      <h1>Basic</h1>
      <div style={{ border: '1px solid rgba(255, 0, 0, .5)' }}>
        <input placeholder="tab usage" {...focusProps} />
        <span>I am span</span>
        <Select
          {...focusProps}
          {...selectProps}
          mode="multiple"
          showSearch
          labelInValue
          options={[
            { value: 'light' },
            { value: 'bamboo' },
            {
              value: 'dog',
              label: <span style={{ color: 'red' }}>Dog</span>,
              options: [
                { value: 'small' },
                { value: 'golden', label: <span style={{ color: 'orange' }}>GOLDEN</span> },
              ],
            },
          ]}
        />
        <Select {...focusProps} {...selectProps} showSearch>
          <Option value={1}>Value 1</Option>
          <OptGroup label={<span>Group Title</span>}>
            <Option value={2}>Value 2</Option>
          </OptGroup>
          <Option value="light">String Value</Option>
          <Option value={903}>Number Value</Option>
          <Option value={1128} disabled>
            Disabled Value
          </Option>
        </Select>
        <input type="hidden" />
        <button type="button" {...focusProps}>
          tab button
        </button>
        <input placeholder="tab usage" {...focusProps} />
        <select>
          <option>233</option>
          <option disabled>1222</option>
          <option>ddd</option>
        </select>
      </div>
    </div>
  );
};

export default Demo;
