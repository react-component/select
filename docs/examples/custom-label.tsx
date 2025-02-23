/* eslint-disable no-console */
import Select, { Option } from '@rc-component/select';
import React from 'react';
import '../../assets/index.less';

const children = [];
for (let i = 10; i < 36; i += 1) {
  children.push(
    <Option key={i.toString(36) + i} test={i}>
      {i.toString(36) + i}
    </Option>,
  );
}

const Test: React.FC = () => {
  const [value, setValue] = React.useState<string>('test');

  return (
    <div>
      <h2>custom label render</h2>

      <div>
        <Select
          placeholder="placeholder"
          style={{ width: 500 }}
          value={value}
          onChange={(val: string, option) => {
            console.log('change', val, option);
            setValue(val);
          }}
          onSelect={(val, option) => {
            console.log('selected', val, option);
          }}
          onDeselect={(val, option) => {
            console.log('deselected', val, option);
          }}
          tokenSeparators={[',']}
          labelRender={(props) => {
            const { label, value: _value } = props;
            const style: React.CSSProperties = { backgroundColor: 'red' };
            if (label) {
              return _value;
            } else return <span style={style}>no this value in options</span>;
          }}
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
            setValue('test');
          }}
        >
          set value as test
        </button>
      </p>
    </div>
  );
};

export default Test;
/* eslint-enable */
