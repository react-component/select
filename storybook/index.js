import React from 'react';
import { checkA11y } from '@storybook/addon-a11y';
import { storiesOf } from '@storybook/react';
import { withConsole } from '@storybook/addon-console';
import { withViewport } from '@storybook/addon-viewport';
import Combobox from '../examples/combobox';
import Controlled from '../examples/controlled';
import CustomIcon from '../examples/custom-icon';
import DropdownRender from '../examples/dropdownRender';
import Email from '../examples/email';
import ForceSuggest from '../examples/force-suggest';
import GetPopupContainer from '../examples/getPopupContainer';
import Loading from '../examples/loading';
import MulSuggest from '../examples/mul-suggest';
import MulTagSuggest from '../examples/mul-tag-suggest';
import MultipleReadonly from '../examples/multiple-readonly';
import Multiple from '../examples/multiple';
import Optgroup from '../examples/optgroup';
import OptionFilterProp from '../examples/optionFilterProp';
import OptionLabelProp from '../examples/optionLabelProp';
import SingleAnimation from '../examples/single-animation';
import Single from '../examples/single';
import Suggest from '../examples/suggest';
import Tags from '../examples/tags';
import UpdateOption from '../examples/update-option';
import ReactMarkdown from 'react-markdown';
import README from '../README.md';

storiesOf('rc-select', module)
  .addDecorator(checkA11y)
  .addDecorator((storyFn, context) => withConsole()(storyFn)(context))
  .addDecorator(withViewport())
  .add('README', () => <ReactMarkdown escapeHtml={false} source={README} />)
  .add('combobox', () => <Combobox />)
  .add('controlled', () => <Controlled />)
  .add('custom-icon', () => <CustomIcon />)
  .add('dropdownRender', () => <DropdownRender />)
  .add('email', () => <Email />)
  .add('force-suggest', () => <ForceSuggest />)
  .add('getPopupContainer', () => <GetPopupContainer />)
  .add('loading', () => <Loading />)
  .add('mul-suggest', () => <MulSuggest />)
  .add('mul-tag-suggest', () => <MulTagSuggest />)
  .add('multiple-readonly', () => <MultipleReadonly />)
  .add('multiple', () => <Multiple />)
  .add('optgroup', () => <Optgroup />)
  .add('optionFilterProp', () => <OptionFilterProp />)
  .add('optionLabelProp', () => <OptionLabelProp />)
  .add('single-animation', () => <SingleAnimation />)
  .add('single', () => <Single />)
  .add('suggest', () => <Suggest />)
  .add('tags', () => <Tags />)
  .add('update-option', () => <UpdateOption />);
