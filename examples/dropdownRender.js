/* eslint no-console: 0 */
import React from 'react';
import Select, { Option } from 'rc-select';
import 'rc-select/assets/index.less';
import ReactDOM from 'react-dom';

const children = [];
for (let i = 10; i < 36; i++) {
  children.push(<Option key={i.toString(36) + i} test={i}>{i.toString(36) + i}</Option>);
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
    return (
      <div
        onMouseDown={(e) => {
          e.preventDefault();
          return false;
        }}
      >
        <h2>custom dropdown render select</h2>

        <div>
          <Select
            placeholder="placeholder"
            tags
            dropdownMenuStyle={{ maxHeight: 200 }}
            style={{ width: 500 }}
            value={this.state.value}
            onChange={this.onChange}
            onSelect={this.onSelect}
            onDeselect={this.onDeselect}
            tokenSeparators={[' ', ',']}
            onFocus={() => console.log('focus')}
            onBlur={() => console.log('blur')}
            dropdownRender={(menu) =>
              <React.Fragment>
                <div
                  onClick={
                    () => {
                      console.log('before clicked')
                    }
                  }
                >
                  BEFORE
                </div>

                {menu}

                <div
                  onClick={
                    () => {
                      console.log('after clicked')
                    }
                  }
                >
                  AFTER
                </div>
              </React.Fragment>
            }
          >
            {children}
          </Select>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Test />, document.getElementById('__react-content'));

