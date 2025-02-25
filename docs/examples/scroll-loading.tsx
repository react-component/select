import Select from '@rc-component/select';
import React from 'react';
import '../../assets/index.less';

function genData(len: number) {
  return new Array(len).fill(0).map((_, index) => ({
    label: `label ${index}`,
    value: index,
  }));
}

const Loading = ({ onLoad }) => {
  React.useEffect(() => {
    setTimeout(onLoad, 1000);
  }, []);

  return <div>Loading...</div>;
};

export default () => {
  const [options, setOptions] = React.useState(() => genData(10));

  return (
    <Select
      defaultValue={0}
      options={[
        ...options,
        {
          label: (
            <Loading
              onLoad={() => {
                setOptions(genData(options.length + 5));
              }}
            />
          ),
          value: 'loading',
        },
      ]}
    />
  );
};
