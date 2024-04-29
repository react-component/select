import Select from 'rc-select';
import '../../assets/index.less';

export default () => {
  return (
    <Select
      options={[
        { label: 'test1', value: '1' },
        { label: 'test2', value: '2' },
        { label: 'test3', value: '3' },
        { label: 'test4', value: '4' },
        { label: 'test5', value: '5' },
        { label: 'test6', value: '6' },
        { label: 'test7', value: '7' },
        { label: 'test8', value: '8' },
        { label: 'test9', value: '9' },
        { label: 'test10', value: '10' },
      ]}
      open
      style={{ width: 400 }}
    />
  );
};
