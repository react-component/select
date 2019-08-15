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

const Demo = () => (
  <div>
    <h1>Basic</h1>
    <div style={{ border: '1px solid rgba(255, 0, 0, .5)' }}>
      <input placeholder="tab usage" {...focusProps} />
      <span>I am span</span>
      <Select {...focusProps} showSearch>
        <Option value={1}>Value 1</Option>
        <OptGroup label={<span>Group Title</span>}>
          <Option value={2}>Value 2</Option>
        </OptGroup>
      </Select>
      <input type="hidden" />
      <button type="button" {...focusProps}>
        tab button
      </button>
      <input placeholder="tab usage" {...focusProps} />
      <select>
        <option>233</option>
      </select>
    </div>
  </div>
);

export default Demo;
