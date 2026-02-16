import React from 'react';
import Select, { Option } from '@rc-component/select';
import '../../assets/index.less';

const Demo: React.FC = () => {
  const [value, setValue] = React.useState<string>('red');
  const [dynamicOptions, setDynamicOptions] = React.useState<
    { value: string; label: string; style?: React.CSSProperties }[]
  >([
    {
      value: 'custom-1',
      label: 'Custom Option 1',
      style: { color: '#1890ff' },
    },
    {
      value: 'custom-2',
      label: 'Custom Option 2',
      style: { color: '#52c41a' },
    },
  ]);

  const handleSearch = (searchValue: string) => {
    if (searchValue && !dynamicOptions.find((opt) => opt.value === searchValue)) {
      setDynamicOptions([
        ...dynamicOptions,
        {
          value: searchValue,
          label: searchValue,
          style: { color: '#faad14' },
        },
      ]);
    }
  };

  return (
    <div style={{ margin: 20 }}>
      <h2>Option Style & ClassName for Selected Item</h2>
      <p>
        When an option has <code>style</code> or <code>className</code> props, they will be applied
        to the selected item display.
      </p>

      <div style={{ marginBottom: 24 }}>
        <h3>Basic Usage with Style</h3>
        <Select
          value={value}
          style={{ width: 200 }}
          onChange={(val) => setValue(val as string)}
          options={[
            {
              value: 'red',
              label: 'Red Color',
              style: { color: 'red', fontWeight: 'bold' },
            },
            {
              value: 'blue',
              label: 'Blue Color',
              style: { color: 'blue', fontWeight: 'bold' },
            },
            {
              value: 'green',
              label: 'Green Color',
              style: { color: 'green', fontWeight: 'bold' },
            },
            {
              value: 'normal',
              label: 'Normal (no style)',
            },
          ]}
        />
      </div>

      <div style={{ marginBottom: 24 }}>
        <h3>With ClassName</h3>
        <Select
          defaultValue="styled"
          style={{ width: 200 }}
          options={[
            {
              value: 'styled',
              label: 'Styled Option',
              className: 'custom-option-class',
              style: { background: '#e6f7ff', border: '1px solid #1890ff' },
            },
            {
              value: 'normal',
              label: 'Normal Option',
            },
          ]}
        />
      </div>

      <div style={{ marginBottom: 24 }}>
        <h3>With Title (Tooltip)</h3>
        <Select
          defaultValue="with-title"
          style={{ width: 200 }}
          options={[
            {
              value: 'with-title',
              label: 'Hover me!',
              title: 'This is a custom tooltip for this option',
              style: { color: 'purple' },
            },
            {
              value: 'without-title',
              label: 'No Title',
              style: { color: 'orange' },
            },
          ]}
        />
      </div>

      <div style={{ marginBottom: 24 }}>
        <h3>Using Option Children Syntax</h3>
        <Select defaultValue="option1" style={{ width: 200 }}>
          <Option
            value="option1"
            style={{ color: 'orange' }}
            className="custom-className"
            title="Custom title for option 1"
          >
            Option 1
          </Option>
          <Option value="option2" style={{ color: 'pink' }}>
            Option 2
          </Option>
          <Option value="option3">Option 3 (no style)</Option>
        </Select>
      </div>

      <div style={{ marginBottom: 24 }}>
        <h3>Root Title Override</h3>
        <Select
          value="override"
          title="This title overrides option title"
          style={{ width: 200 }}
          options={[
            {
              value: 'override',
              label: 'Hover to see title',
              title: 'Option title (will be overridden)',
              style: { color: 'teal' },
            },
          ]}
        />
        <h3>Custom Input Element with getInputElement (combobox mode)</h3>
        <div style={{ marginBottom: 24 }}>
          <p>
            Use <code>getInputElement</code> to customize the input element. This only works with{' '}
            <code>mode=&quot;combobox&quot;</code>. Type to add new options dynamically.
          </p>
          <Select
            mode="combobox"
            style={{ width: 300 }}
            suffixIcon={null}
            showSearch
            onSearch={handleSearch}
            classNames={{
              prefix: 'custom-prefix',
              suffix: 'custom-suffix',
            }}
            styles={{
              prefix: { marginRight: 8 },
              suffix: { marginLeft: 8 },
            }}
            getInputElement={() => (
              <input
                style={{
                  border: '2px solid #1890ff',
                  borderRadius: 4,
                  padding: '4px 8px',
                  outline: 'none',
                }}
                placeholder="Type to add new option"
              />
            )}
            options={dynamicOptions}
          />
        </div>
      </div>
    </div>
  );
};

export default Demo;
