import * as React from 'react';
import { clsx } from 'clsx';
import Input from '../Input';
import { useSelectInputContext } from '../context';
import useBaseProps from '../../hooks/useBaseProps';
import Placeholder from './Placeholder';
import type { SharedContentProps } from '.';
import SelectContext from '../../SelectContext';
import { getTitle } from '../../utils/commonUtil';

const SingleContent = React.forwardRef<HTMLInputElement, SharedContentProps>(
  ({ inputProps }, ref) => {
    const { prefixCls, searchValue, activeValue, displayValues, maxLength, mode, components } =
      useSelectInputContext();
    const { triggerOpen, title: rootTitle, showSearch, classNames, styles } = useBaseProps();
    const selectContext = React.useContext(SelectContext);

    const [inputChanged, setInputChanged] = React.useState(false);

    const combobox = mode === 'combobox';
    const displayValue = displayValues[0];

    // Implement the same logic as the old SingleSelector
    const mergedSearchValue = React.useMemo(() => {
      if (combobox && activeValue && !inputChanged && triggerOpen) {
        return activeValue;
      }

      return showSearch ? searchValue : '';
    }, [combobox, activeValue, inputChanged, triggerOpen, searchValue, showSearch]);

    const [optionClassName, optionStyle, optionTitle, hasOptionStyle] = React.useMemo(() => {
      let className: string | undefined;
      let style: React.CSSProperties | undefined;
      let titleValue: string | undefined;

      if (displayValue && selectContext?.flattenOptions) {
        const option = selectContext.flattenOptions.find((opt) => opt.value === displayValue.value);
        if (option?.data) {
          className = option.data.className;
          style = option.data.style;
          titleValue = getTitle(option.data);
        }
      }

      if (displayValue && !titleValue) {
        titleValue = getTitle(displayValue);
      }

      if (rootTitle !== undefined) {
        titleValue = rootTitle;
      }

      const nextHasStyle = !!className || !!style;

      return [className, style, titleValue, nextHasStyle] as const;
    }, [displayValue, selectContext?.flattenOptions, rootTitle]);

    React.useEffect(() => {
      if (combobox) {
        setInputChanged(false);
      }
    }, [combobox, activeValue]);

    // ========================== Render ==========================
    const showHasValueCls =
      displayValue &&
      displayValue.label !== null &&
      displayValue.label !== undefined &&
      String(displayValue.label).trim() !== '';

    // Render value
    // Only render value when not using custom input in combobox mode
    const shouldRenderValue = !(combobox && components?.input);
    const renderValue = shouldRenderValue ? (
      displayValue ? (
        hasOptionStyle ? (
          <div
            className={clsx(`${prefixCls}-content-value`, optionClassName)}
            style={{
              ...(mergedSearchValue ? { visibility: 'hidden' } : {}),
              ...optionStyle,
            }}
            title={optionTitle}
          >
            {displayValue.label}
          </div>
        ) : (
          displayValue.label
        )
      ) : (
        <Placeholder show={!mergedSearchValue} />
      )
    ) : null;
    // Render
    return (
      <div
        className={clsx(
          `${prefixCls}-content`,
          showHasValueCls && `${prefixCls}-content-has-value`,
          mergedSearchValue && `${prefixCls}-content-has-search-value`,
          hasOptionStyle && `${prefixCls}-content-has-option-style`,
          classNames?.content,
        )}
        style={styles?.content}
        title={hasOptionStyle ? undefined : optionTitle}
      >
        {renderValue}
        <Input
          ref={ref}
          {...inputProps}
          value={mergedSearchValue}
          maxLength={mode === 'combobox' ? maxLength : undefined}
          onChange={(e) => {
            setInputChanged(true);
            inputProps.onChange?.(e);
          }}
        />
      </div>
    );
  },
);

export default SingleContent;
