import * as React from 'react';
import Select, { Option, OptGroup } from '../src';
import '../assets/index.less';
import './common.less';
import { RefSelectProps } from '../src/Select';

const focusProps = {
  onFocus: ({ target }) => {
    console.log('Focus:', target);
  },
  onBlur: ({ target }) => {
    console.log('Blur:', target);
  },
};

const consoleEvent = (name: string) => (...args: any[]) => {
  console.log(name, ':', ...args);
};

const Demo = () => {
  const selectProps = {
    onChange: consoleEvent('Change'),
    onSelect: consoleEvent('Select'),
    onDeselect: consoleEvent('Deselect'),
    onSearch: consoleEvent('Search'),
  };

  // const [search, setSearch] = React.useState('');
  const selectRef = React.useRef<RefSelectProps>(null);

  return (
    <div>
      <h1>Basic</h1>
      <div style={{ border: '1px solid rgba(255, 0, 0, .5)' }}>
        <input placeholder="tab usage" {...focusProps} />
        <span>I am span</span>
        <Select
          {...focusProps}
          {...selectProps}
          ref={selectRef}
          defaultActiveFirstOption={false}
          mode="multiple"
          showSearch
          labelInValue
          // allowClear
          // showArrow
          placeholder="ddd"
          style={{ width: 200 }}
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
          dropdownRender={node => (
            <div>
              <h1>23333</h1>
              <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
                a link
              </a>
              {node}
              <input />
              <button type="button">A BUTTON</button>
            </div>
          )}
        />
        <Select
          {...focusProps}
          {...selectProps}
          showSearch
          // searchValue={search}
          // onSearch={setSearch}
          defaultValue={2}
          backfill
        >
          <Option value={1}>Value 1</Option>
          <OptGroup label={<span>Group Title</span>}>
            <Option value={2}>Value 2</Option>
          </OptGroup>
          <Option value="light">String Value</Option>
          <Option value={903}>Number Value</Option>
          <Option value={1128} disabled>
            Disabled Value
          </Option>
          <Option value="111">111!</Option>
          <Option value="122">122!</Option>
        </Select>
        <input type="hidden" />
        <button
          type="button"
          {...focusProps}
          onClick={() => {
            selectRef.current.focus();
          }}
        >
          Focus first
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
