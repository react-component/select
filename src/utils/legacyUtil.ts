import * as React from 'react';
import toArray from 'rc-util/lib/Children/toArray';
import type { BaseOptionType, DefaultOptionType } from '../Select';

function convertNodeToOption<OptionType extends BaseOptionType = DefaultOptionType>(
  node: React.ReactElement,
): OptionType {
  const {
    key,
    props: { children, value, ...restProps },
  } = node as React.ReactElement;

  return { key, value: value !== undefined ? value : key, children, ...restProps };
}

export function convertChildrenToData<OptionType extends BaseOptionType = DefaultOptionType>(
  nodes: React.ReactNode,
  optionOnly: boolean = false,
): OptionType[] {
  return toArray(nodes)
    .map((node: React.ReactElement, index: number): OptionType | null => {
      if (!React.isValidElement(node) || !node.type) {
        return null;
      }

      const {
        type: { isSelectOptGroup },
        key,
        props: { children, ...restProps },
      } = node as React.ReactElement & {
        type: { isSelectOptGroup?: boolean };
      };

      if (optionOnly || !isSelectOptGroup) {
        return convertNodeToOption(node);
      }

      return {
        key: `__RC_SELECT_GRP__${key === null ? index : key}__`,
        label: key,
        ...restProps,
        options: convertChildrenToData(children),
      };
    })
    .filter((data) => data);
}
