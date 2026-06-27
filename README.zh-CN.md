<div align="center">
  <h1>@rc-component/select</h1>
  <p><sub>Ant Design 生态的一部分。</sub></p>
  <img alt="Ant Design" height="32" src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" />
  <p>🔎 React 选择器组件，支持单选、多选、搜索、标签和自定义渲染。</p>

  <p>
    <a href="https://npmjs.org/package/@rc-component/select"><img alt="NPM version" src="https://img.shields.io/npm/v/@rc-component/select.svg?style=flat-square"></a>
    <a href="https://npmjs.org/package/@rc-component/select"><img alt="npm downloads" src="https://img.shields.io/npm/dm/@rc-component/select.svg?style=flat-square"></a>
    <a href="https://github.com/react-component/select/actions/workflows/test.yml"><img alt="build status" src="https://github.com/react-component/select/actions/workflows/test.yml/badge.svg"></a>
    <a href="https://app.codecov.io/gh/react-component/select"><img alt="Codecov" src="https://img.shields.io/codecov/c/github/react-component/select/master.svg?style=flat-square"></a>
    <a href="https://bundlephobia.com/package/@rc-component/select"><img alt="bundle size" src="https://img.shields.io/bundlephobia/minzip/@rc-component/select?style=flat-square"></a>
    <a href="https://github.com/umijs/dumi"><img alt="dumi" src="https://img.shields.io/badge/docs%20by-dumi-blue?style=flat-square"></a>
  </p>
</div>

<p align="center"><a href="./README.md">English</a> | 简体中文</p>


## 特性

| 范围 | 支持 |
| --------- | ---------------------------------------------------------- |
| Data      | `options` data, legacy `Option` children, grouped options  |
| Modes     | Single select, `multiple`, `tags`, and `combobox`          |
| Search    | Controlled search, custom filter, custom sort              |
| Rendering | Custom option, label, selected item, clear, and menu icons |
| Scale     | Virtual scrolling with configurable item height            |

## 安装

```bash
npm install @rc-component/select
```

## 使用

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

## 示例

```bash
npm install
npm start
```

Open <http://localhost:8000/> locally, or visit the online example: <https://select-react-component.vercel.app/>.

## API

### Select

Select also accepts public props from `BaseSelect`, except `showSearch`, which is redefined by Select.

| 名称 | 说明 | 类型 | 默认值 |
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

| 名称  | 说明         | 参数 |
| ----- | ------------------- | ---------- |
| blur  | Remove focus.       | -          |
| focus | Focus the selector. | -          |

### SearchConfig

| 名称 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| autoClearSearchValue | Clear search input after selecting or deselecting in multiple mode. | boolean | true |
| filterOption | Filter options by search input. | boolean \| `FilterFunc<OptionType>` | - |
| filterSort | Sort filtered options. | `(optionA, optionB, info: { searchValue: string }) => number` | - |
| onSearch | Called when search input changes. | `(value: string) => void` | - |
| optionFilterProp | Option prop used for filtering when `filterOption` is enabled. | string \| string[] | - |
| searchValue | Controlled search input value. | string | - |

### Option

`Option` is a legacy placeholder component. Prefer the `options` prop for new usage.

| 名称 | 说明 | 类型 | 默认值 |
| --------- | ------------------- | ------------------------ | ------- |
| children  | Option label.       | ReactNode                | -       |
| className | Option class name.  | string                   | -       |
| disabled  | Disable the option. | boolean                  | false   |
| title     | Option title.       | string                   | -       |
| value     | Option value.       | string \| number \| null | -       |

### OptGroup

`OptGroup` is a legacy placeholder component. Prefer nested `options` data for new usage.

| 名称 | 说明 | 类型 | 默认值 |
| --------- | ------------------ | --------- | ------- |
| children  | Group options.     | ReactNode | -       |
| className | Group class name.  | string    | -       |
| disabled  | Disable the group. | boolean   | false   |
| label     | Group label.       | ReactNode | -       |
| title     | Group title.       | string    | -       |

## 本地开发

```bash
npm install
npm start
npm test
npm run lint
npm run tsc
npm run compile
```

## 发布

```bash
npm run prepublishOnly
```

The release flow is handled by `@rc-component/np` through the `rc-np` command after the package build.

## 许可证

@rc-component/select is released under the [MIT](./LICENSE.md) license.
