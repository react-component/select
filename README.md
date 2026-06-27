<div align="center">
  <h1>@rc-component/select</h1>
  <p><sub><img alt="Ant Design" height="14" src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" style="vertical-align: -0.125em;" /> Part of the Ant Design ecosystem.</sub></p>
  <p>🎯 Composable Select component for React, with search, async-friendly option data, custom rendering, and virtual scrolling.</p>

  <p>
    <a href="https://npmjs.org/package/@rc-component/select"><img alt="NPM version" src="https://img.shields.io/npm/v/@rc-component/select.svg?style=flat-square"></a>
    <a href="https://npmjs.org/package/@rc-component/select"><img alt="npm downloads" src="https://img.shields.io/npm/dm/@rc-component/select.svg?style=flat-square"></a>
    <a href="https://github.com/react-component/select/actions/workflows/test.yml"><img alt="build status" src="https://github.com/react-component/select/actions/workflows/test.yml/badge.svg"></a>
    <a href="https://app.codecov.io/gh/react-component/select"><img alt="Codecov" src="https://img.shields.io/codecov/c/github/react-component/select/master.svg?style=flat-square"></a>
    <a href="https://bundlephobia.com/package/@rc-component/select"><img alt="bundle size" src="https://img.shields.io/bundlephobia/minzip/@rc-component/select?style=flat-square"></a>
    <a href="https://github.com/umijs/dumi"><img alt="dumi" src="https://img.shields.io/badge/docs%20by-dumi-blue?style=flat-square"></a>
  </p>
</div>

<p align="center">English | <a href="./README.zh-CN.md">简体中文</a></p>


## Highlights

| Area      | Support                                                    |
| --------- | ---------------------------------------------------------- |
| Data      | `options` data, legacy `Option` children, grouped options  |
| Modes     | Single select, `multiple`, `tags`, and `combobox`          |
| Search    | Controlled search, custom filter, custom sort              |
| Rendering | Custom option, label, selected item, clear, and menu icons |
| Scale     | Virtual scrolling with configurable item height            |

## Install

```bash
npm install @rc-component/select
```

## Usage

```tsx | pure
import Select from '@rc-component/select';
import '@rc-component/select/assets/index.css';

export default () => (
  <Select
    placeholder="Select a user"
    options={[
      { value: 'jack', label: 'Jack' },
      { value: 'lucy', label: 'Lucy' },
      { value: 'yiminghe', label: 'Yiminghe' },
    ]}
  />
);
```

## Examples

Run the local dumi site:

```bash
npm install
npm start
```

Then open `http://localhost:8000`.

## API

### Select

Select also accepts public props from `BaseSelect`, except `showSearch`, which is redefined by Select.

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| autoClearSearchValue | Deprecated. Use `showSearch.autoClearSearchValue` instead. | boolean | true |
| backfill | Backfill the active option into the input. Only works in `combobox` mode. | boolean | false |
| children | Legacy option children. Prefer `options` for new code. | ReactNode | - |
| classNames | Semantic class names. | `Partial<Record<SemanticName, string>>` | - |
| defaultActiveFirstOption | Whether the first option is active by default. | boolean | true |
| defaultValue | Initial selected value. | `ValueType` \| null | - |
| direction | Dropdown direction. | `ltr` \| `rtl` | `ltr` |
| fieldNames | Customize option field names. | `FieldNames` | - |
| filterOption | Deprecated. Use `showSearch.filterOption` instead. | boolean \| `FilterFunc<OptionType>` | - |
| filterSort | Deprecated. Use `showSearch.filterSort` instead. | `(optionA, optionB, info) => number` | - |
| labelInValue | Return labeled value objects instead of raw values. | boolean | false |
| labelRender | Custom selected label render. | `(props: LabelInValueType) => ReactNode` | - |
| listHeight | Popup list height. | number | 200 |
| listItemHeight | Popup list item height. | number | 20 |
| maxCount | Maximum selected item count. | number | - |
| menuItemSelectedIcon | Custom selected option icon. | `RenderNode` | - |
| mode | Select mode. | `combobox` \| `multiple` \| `tags` | - |
| onActive | Called when the active value changes. | `(value: ValueType) => void` | - |
| onChange | Called when selected value changes. | `(value: ValueType, option?: OptionType \| OptionType[]) => void` | - |
| onDeselect | Called when a value is deselected. | `(value, option) => void` | - |
| onSearch | Deprecated. Use `showSearch.onSearch` instead. | `(value: string) => void` | - |
| onSelect | Called when a value is selected. | `(value, option) => void` | - |
| optionFilterProp | Deprecated. Use `showSearch.optionFilterProp` instead. | string \| string[] | - |
| optionLabelProp | Option prop used as the selected label. | string | - |
| optionRender | Custom option renderer. | `(oriOption, info: { index: number }) => ReactNode` | - |
| options | Option data. | `OptionType[]` | - |
| searchValue | Deprecated. Use `showSearch.searchValue` instead. | string | - |
| showSearch | Enable search or configure search behavior. | boolean \| `SearchConfig<OptionType>` | - |
| styles | Semantic styles. | `Partial<Record<SemanticName, CSSProperties>>` | - |
| value | Controlled selected value. | `ValueType` \| null | - |
| virtual | Disable virtual scrolling when set to `false`. | boolean | true |

### Methods

| Name  | Description         | Parameters |
| ----- | ------------------- | ---------- |
| blur  | Remove focus.       | -          |
| focus | Focus the selector. | -          |

### SearchConfig

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| autoClearSearchValue | Clear search input after selecting or deselecting in multiple mode. | boolean | true |
| filterOption | Filter options by search input. | boolean \| `FilterFunc<OptionType>` | - |
| filterSort | Sort filtered options. | `(optionA, optionB, info: { searchValue: string }) => number` | - |
| onSearch | Called when search input changes. | `(value: string) => void` | - |
| optionFilterProp | Option prop used for filtering when `filterOption` is enabled. | string \| string[] | - |
| searchValue | Controlled search input value. | string | - |

### Option

`Option` is a legacy placeholder component. Prefer the `options` prop for new usage.

| Name      | Description         | Type                     | Default |
| --------- | ------------------- | ------------------------ | ------- |
| children  | Option label.       | ReactNode                | -       |
| className | Option class name.  | string                   | -       |
| disabled  | Disable the option. | boolean                  | false   |
| title     | Option title.       | string                   | -       |
| value     | Option value.       | string \| number \| null | -       |

### OptGroup

`OptGroup` is a legacy placeholder component. Prefer nested `options` data for new usage.

| Name      | Description        | Type      | Default |
| --------- | ------------------ | --------- | ------- |
| children  | Group options.     | ReactNode | -       |
| className | Group class name.  | string    | -       |
| disabled  | Disable the group. | boolean   | false   |
| label     | Group label.       | ReactNode | -       |
| title     | Group title.       | string    | -       |

## Development

```bash
npm install
npm start
npm test
npm run lint
npm run tsc
npm run compile
```

## Release

```bash
npm run prepublishOnly
```

The release flow is handled by `@rc-component/np` through the `rc-np` command after the package build.

## License

@rc-component/select is released under the [MIT](./LICENSE.md) license.
