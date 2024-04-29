import Select from 'rc-select';
import '../../assets/index.less';

export default () => {
  return (
    <>
      {/* <Select
        options={[
          { label: 'test1', value: '1' },
          { label: 'test2', value: '2' },
        ]}
      /> */}
      {/* <Select.SelectPanel
        open
        options={[
          { label: 'test1', value: '1' },
          { label: 'test2', value: '2' },
        ]}
      /> */}
      <Select
        panel
        options={[
          { label: 'test1', value: '1' },
          { label: 'test2', value: '2' },
        ]}
      />
    </>
  );
};
