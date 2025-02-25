/* eslint-disable no-console */
import Select from '@rc-component/select';
import '../../assets/index.less';

export default () => {
  return (
    <Select
      options={[
        { label: 'test1', value: '1' },
        { label: 'test2', value: '2' },
      ]}
      optionRender={(option, { index }) => {
        return `${option.label} - ${index}`;
      }}
    />
  );
};
