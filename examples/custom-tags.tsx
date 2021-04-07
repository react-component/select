/* eslint-disable no-console */
import React from 'react';
import Select, { Option } from '../src';
import '../assets/index.less';
import type { CustomTagProps } from '../src/interface/generator';

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
  const [value, setValue] = React.useState<string[]>(['name2', '42', 'name3']);
  const [maxTagCount, setMaxTagCount] = React.useState<number>(null);

  const toggleMaxTagCount = (count: number) => {
    setMaxTagCount(count);
  };

  const tagRender = (props: CustomTagProps) => {
    const { label, closable, onClose } = props;
    let style: React.CSSProperties;
    if (parseInt(label as string, 10)) {
      style = { backgroundColor: 'blue' };
    } else if (!closable) {
      style = { backgroundColor: 'white' };
    } else {
      style = { backgroundColor: 'red' };
    }
    return (
      <span style={style}>
        {label}
        {closable ? (
          <button type="button" onClick={onClose}>
            x
          </button>
        ) : null}
      </span>
    );
  };

  return (
    <div>
      <h2>tags select with custom renderer（scroll the menu）</h2>

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
          tokenSeparators={[',']}
          tagRender={tagRender}
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
    </div>
  );
};

export default Test;
/* eslint-enable */
