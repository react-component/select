/* eslint-disable no-console */
import React from 'react';
import Select, { Option } from '../src';
import '../assets/index.less';

const children = [];
for (let i = 10; i < 36; i += 1) {
  children.push(
    <Option key={i.toString(36) + i} test={i}>
      {i.toString(36) + i}
    </Option>,
  );
}

class Test extends React.Component {
  state = {
    value: ['name2', 'name3'],
  };

  onChange = (value, option) => {
    console.log(`changed ${value}`, option);
    this.setState({
      value,
    });
  };

  onSelect = (value, option) => {
    console.log(`selected ${value}`, option.props);
  };

  onDeselect = (value, option) => {
    console.log(`deselected ${value}`, option);
  };

  render() {
    const { value } = this.state;
    return (
      <div>
        <h2>custom dropdown render select</h2>

        <div>
          <Select
            placeholder="placeholder"
            mode="tags"
            style={{ width: 500 }}
            value={value}
            onChange={this.onChange}
            onSelect={this.onSelect}
            onDeselect={this.onDeselect}
            tokenSeparators={[' ', ',']}
            onFocus={() => console.log('focus')}
            onBlur={() => console.log('blur')}
            dropdownRender={menu => (
              <React.Fragment>
                <div
                  onClick={() => {
                    console.log('before clicked');
                  }}
                >
                  BEFORE
                  <a href="http://taobao.com" target="_blank" rel="noopener noreferrer">
                    TaoBao
                  </a>
                </div>

                {menu}

                <div
                  onClick={() => {
                    console.log('after clicked');
                  }}
                >
                  AFTER
                  <input type="text" placeholder="test" />
                  <button type="button">Button</button>
                </div>
              </React.Fragment>
            )}
          >
            {children}
          </Select>
        </div>
      </div>
    );
  }
}

export default Test;
/* eslint-enable */
