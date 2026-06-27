<div align="center">
  <h1>@rc-component/select</h1>
  <p><sub><img alt="Ant Design" height="14" src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" style="vertical-align: -0.125em;" /> Ant Design 生态的一部分。</sub></p>
  <p>🎯 React 选择器组件，支持单选、多选、搜索、标签和自定义渲染。</p>

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
| 数据      | `options` 数据，旧版 `Option` 子项，分组选项  |
| Modes     | 单选、`multiple`、`tags` 和 `combobox` 模式          |
| 搜索    | 受控搜索、自定义过滤和自定义排序              |
| Rendering | 自定义选项、标签、选中项、清除图标和菜单图标 |
| Scale     | 支持可配置项高度的虚拟滚动            |

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

本地打开 <http://localhost:8000/>，或访问在线示例：<https://select-react-component.vercel.app/>。

## API

### Select

Select 还接受来自 `BaseSelect` 的公共属性，但由 Select 重新定义的 `showSearch` 除外。

| 名称 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| autoClearSearchValue | 已弃用。请改用 `showSearch.autoClearSearchValue`。 | boolean | true |
| backfill | 将活动选项回填到输入中。仅适用于 `combobox` 模式。 | boolean | false |
| children们 | 旧版选项子节点。新代码推荐使用 `options`。 | ReactNode | - |
| classNames | 语义className。 | `Partial<Record<SemanticName, string>>` | - |
| defaultActiveFirstOption | 默认情况下第一个选项是否处于活动状态。 | boolean | true |
| defaultValue | 初始选中值。 | `ValueType` \| null | - |
| direction | Dropdown direction. | `ltr` \| `rtl` | `ltr` |
| fieldNames | 自定义选项字段名称。 | `FieldNames` | - |
| filterOption | 已弃用。请改用 `showSearch.filterOption`。 | boolean \| `FilterFunc<OptionType>` | - |
| filterSort | 已弃用。请改用 `showSearch.filterSort`。 | `(optionA, optionB, info) => number` | - |
| labelInValue | 返回标记值对象而不是原始值。 | boolean | false |
| labelRender | 自定义选定的标签渲染。 | `(props: LabelInValueType) => ReactNode` | - |
| listHeight | 弹层列表高度。 | number | 200 |
| listItemHeight | 弹层列表项的高度。 | number | 20 |
| maxCount | 最大选定项目数。 | number | - |
| menuItemSelectedIcon | 自定义选定的选项图标。 | `RenderNode` | - |
| mode | 选择模式。 | `combobox` \| `multiple` \| `tags` | - |
| onActive | 当活动值改变时调用。 | `(value: ValueType) => void` | - |
| onChange | 当选定值更改时调用。 | `(value: ValueType, option?: OptionType \| OptionType[]) => void` | - |
| onDeselect | 当取消选择某个值时调用。 | `(value, option) => void` | - |
| onSearch | 已弃用。请改用 `showSearch.onSearch`。 | `(value: string) => void` | - |
| onSelect | 选择值时调用。 | `(value, option) => void` | - |
| optionFilterProp | 已废弃。请使用 `showSearch.optionFilterProp`。 | string \| string[] | - |
| optionLabelProp | 用作所选标签的选项道具。 | string | - |
| optionRender | 自定义选项渲染器。 | `(oriOption, info: { index: number }) => ReactNode` | - |
| 选项 | 选项数据。 | `OptionType[]` | - |
| searchValue | 已弃用。请改用 `showSearch.searchValue`。 | string | - |
| showSearch | 启用搜索或配置搜索行为。 | boolean \| `SearchConfig<OptionType>` | - |
| styles | 语义化样式。 | `Partial<Record<SemanticName, CSSProperties>>` | - |
| 价值 | 受控选中值。 | `ValueType` \| null | - |
| virtual | 设置为 `false` 时禁用虚拟滚动。 | boolean | true |

### 方法

| 名称  | 说明         | 参数 |
| ----- | ------------------- | ---------- |
| 模糊  | 移除焦点。       | -          |
| 重点 | 聚焦选择器。 | -          |

### SearchConfig

| 名称 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| autoClearSearchValue | 在多种模式下选择或取消选择后清除搜索输入。 | boolean | true |
| filterOption | 按搜索输入过滤选项。 | boolean \| `FilterFunc<OptionType>` | - |
| filterSort | 对过滤的选项进行排序。 | `(optionA, optionB, info: { searchValue: string }) => number` | - |
| onSearch | 当搜索输入更改时调用。 | `(value: string) => void` | - |
| optionFilterProp | 启用 `filterOption` 时用于过滤的选项属性。 | string \| string[] | - |
| searchValue | 受控搜索输入值。 | string | - |

### Option

`Option` 是一个旧的占位符组件。对于新用途，更喜欢 `options` 属性。

| 名称 | 说明 | 类型 | 默认值 |
| --------- | ------------------- | ------------------------ | ------- |
| children们  | 选项标签。       | ReactNode                | -       |
| className | 选项className称。  | string                   | -       |
| disabled  | 禁用该选项。 | boolean                  | false   |
| title     | 选项标题。       | string                   | -       |
| 价值     | 选项值。       | 字符串\|数字\|无效的 | -       |

### OptGroup

`OptGroup` 是一个旧的占位符组件。优选嵌套 `options` 数据以供新用途。

| 名称 | 说明 | 类型 | 默认值 |
| --------- | ------------------ | --------- | ------- |
| children们  | 组选项。     | ReactNode | -       |
| className | 组className。  | string    | -       |
| disabled  | 禁用该组。 | boolean   | false   |
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

包构建完成后，发布流程由 `@rc-component/np` 通过 `rc-np` 命令处理。

## 许可证

@rc-component/select 基于 [MIT](./LICENSE.md) 许可证发布。
