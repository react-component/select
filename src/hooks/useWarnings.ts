import { useEffect } from 'react';
import warning from 'rc-util/lib/warning';
import {
  OptionData,
} from '../interface';
import { toArray } from '../utils/commonUtil';
import { toOptionData } from '../utils/valueUtil';

export default ({
  warningsEnabled,
  evaluateProps,
  props,
  toCollectedOptionData,
  labelInValue,
  optionSelectedLabelProp,
  optionSelectableLabelProp,
}) => {
  // Warn the console if a label within the provided option data conflicts with a label
  // determined by collecting a value's option data
  const warnAboutConflictingLabels = (options: OptionData[]) => {
    options.forEach(option => {
      const collectedOptionData = toCollectedOptionData(option.value);
      if (collectedOptionData) {
        const compareLabels = (labelA, labelB) => {
          if (typeof labelA === 'string' && typeof labelB === 'string') {
            if (labelA.trim() !== labelB.trim()) {
              warning(false, '`label` of `value` is not same as `label` in Select options.');
            }
          }
        }

        [optionSelectedLabelProp, optionSelectableLabelProp].forEach(labelProp => {
          compareLabels(collectedOptionData[labelProp], option[labelProp]);
        });

        // Also compare 'label' if `labelInValue` is set
        if (labelInValue) {
          compareLabels(collectedOptionData[optionSelectedLabelProp], option.label);
        }
      }
    });
  };

  useEffect(() => {
    if (warningsEnabled) {
      warnAboutConflictingLabels(toArray(toOptionData(props.value)));
    }
  }, [props.value]);

  useEffect(() => {
    if (warningsEnabled) {
      warnAboutConflictingLabels(toArray(toOptionData(props.defaultValue)));
    }
  }, [props.defaultValue]);

  if (warningsEnabled && evaluateProps) {
    evaluateProps(props);
  }
};
