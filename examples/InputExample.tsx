import * as React from 'react';
import Input from '../src/SelectInput/Input';

const InputExample = () => {
  const [value, setValue] = React.useState('');
  
  return (
    <div>
      <h2>Input Component Examples</h2>
      
      <div>
        <h3>Basic Input</h3>
        <Input prefixCls="rc-select" placeholder="Type something..." />
      </div>
      
      <div>
        <h3>Controlled Input</h3>
        <Input 
          prefixCls="rc-select" 
          value={value} 
          onChange={(e) => setValue(e.target.value)}
          placeholder="Controlled input..."
        />
        <p>Current value: {value}</p>
      </div>
      
      <div>
        <h3>Disabled Input</h3>
        <Input 
          prefixCls="rc-select" 
          disabled 
          placeholder="Disabled input..."
        />
      </div>
      
      <div>
        <h3>Input with Custom Style</h3>
        <Input 
          prefixCls="rc-select" 
          className="custom-input"
          style={{ border: '2px solid #1890ff', borderRadius: '4px' }}
          placeholder="Styled input..."
        />
      </div>
    </div>
  );
};

export default InputExample;
