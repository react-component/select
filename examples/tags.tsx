/* eslint-disable no-console */
import React from 'react';
import Select, { Option } from '../src';
import '../assets/index.less';

const children = [];
for (let i = 10; i < 36; i += 1) {
  children.push(
    <Option key={i.toString(36) + i} test={i}>
      {i.toString(36) + i}
    </Option>,
  );
}

const Test: React.FC = () => {
  const [disabled, setDisabled] = React.useState(false);
  const [value, setValue] = React.useState<string[]>(['name2', 'name3']);
  const [maxTagCount, setMaxTagCount] = React.useState<number>(null);

  const toggleMaxTagCount = (count: number) => {
    setMaxTagCount(count);
  };

  return (
    <div>
      <h2>tags select（scroll the menu）</h2>

      <div>
        <Select
          placeholder="placeholder"
          mode="tags"
          style={{ width: 500 }}
          disabled={disabled}
          maxTagCount={maxTagCount}
          maxTagTextLength={10}
          value={value}
          onChange={(val: string[], option) => {
            console.log('change:', val, option);
            setValue(val);
          }}
          onSelect={(val, option) => {
            console.log('selected', val, option);
          }}
          onDeselect={(val, option) => {
            console.log('deselected', val, option);
          }}
          tokenSeparators={[' ', ',', '\n']}
          onFocus={() => console.log('focus')}
          onBlur={() => console.log('blur')}
        >
          {children}
        </Select>
      </div>
      <p>
        <button
          type="button"
          onClick={() => {
            setDisabled(!disabled);
          }}
        >
          toggle disabled
        </button>
        <button type="button" onClick={() => toggleMaxTagCount(0)}>
          toggle maxTagCount (0)
        </button>
        <button type="button" onClick={() => toggleMaxTagCount(1)}>
          toggle maxTagCount (1)
        </button>
        <button type="button" onClick={() => toggleMaxTagCount(null)}>
          toggle maxTagCount (null)
        </button>
      </p>
      <h2>tags select with open = false</h2>
      <div>
        <Select
          placeholder="placeholder"
          mode="tags"
          style={{ width: 500 }}
          disabled={disabled}
          maxTagCount={maxTagCount}
          maxTagTextLength={10}
          value={value}
          onChange={(val: string[], option) => {
            console.log('change:', val, option);
            setValue(val);
          }}
          onSelect={(val, option) => {
            console.log('selected', val, option);
          }}
          onDeselect={(val, option) => {
            console.log('deselected', val, option);
          }}
          tokenSeparators={[' ', ',']}
          onFocus={() => console.log('focus')}
          onBlur={() => console.log('blur')}
          open={false}
        >
          {children}
        </Select>
      </div>
    </div>
  );
};

export default Test;
/* eslint-enable */
