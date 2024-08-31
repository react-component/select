import { createEvent, fireEvent, render } from '@testing-library/react';
import KeyCode from 'rc-util/lib/KeyCode';
import classNames from 'classnames';
import * as React from 'react';
import Select, { BaseSelect, OptGroup, Option } from '../src';
import allowClearTest from './shared/allowClearTest';
import blurTest from './shared/blurTest';
import dynamicChildrenTest from './shared/dynamicChildrenTest';
import focusTest from './shared/focusTest';
import hoverTest from './shared/hoverTest';
import inputFilterTest from './shared/inputFilterTest';
import openControlledTest from './shared/openControlledTest';
import removeSelectedTest from './shared/removeSelectedTest';
import maxTagRenderTest from './shared/maxTagRenderTest';
import throwOptionValue from './shared/throwOptionValue';
import { injectRunAllTimers, findSelection, expectOpen, toggleOpen, keyDown } from './utils/common';

describe('Select.Tags', () => {
  injectRunAllTimers(jest);

  allowClearTest('tags', ['1128']);
  focusTest('tags', {});
  blurTest('tags');
  hoverTest('tags');
  maxTagRenderTest('tags');
  removeSelectedTest('tags');
  throwOptionValue('tags');
  dynamicChildrenTest('tags', {});
  inputFilterTest('tags');
  openControlledTest('tags');

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('allow user input tags', () => {
    const { container } = render(<Select mode="tags" />);

    fireEvent.change(container.querySelector('input'), { target: { value: 'foo' } });
    keyDown(container.querySelector('input'), KeyCode.ENTER);

    expect(findSelection(container).textContent).toBe('foo');
  });

  it('should call onChange on blur', () => {
    const onChange = jest.fn();
    const { container } = render(<Select mode="tags" onChange={onChange} />);

    fireEvent.change(container.querySelector('input'), { target: { value: 'foo' } });
    fireEvent.blur(container.querySelector('input'));

    jest.runAllTimers();
    expect(findSelection(container).textContent).toBe('foo');
    expect(onChange).toHaveBeenCalledWith(['foo'], [{}]);
  });

  it('tokenize input', () => {
    const handleChange = jest.fn();
    const handleSelect = jest.fn();
    const option2 = <Option value="2">2</Option>;
    const { container } = render(
      <Select mode="tags" tokenSeparators={[',']} onChange={handleChange} onSelect={handleSelect}>
        <Option value="1">1</Option>
        {option2}
      </Select>,
    );

    fireEvent.change(container.querySelector('input'), { target: { value: '2,3,4' } });

    expect(handleChange).toHaveBeenCalledWith(['2', '3', '4'], expect.anything());
    expect(handleSelect).toHaveBeenCalledTimes(3);
    expect(handleSelect).toHaveBeenLastCalledWith('4', expect.anything());
    expect(findSelection(container).textContent).toEqual('2');
    expect(findSelection(container, 1).textContent).toEqual('3');
    expect(findSelection(container, 2).textContent).toEqual('4');
    expect(container.querySelector('input').value).toBe('');
    expectOpen(container, false);
  });

  it('should not separate words when compositing but trigger after composition end', () => {
    const handleChange = jest.fn();
    const handleSelect = jest.fn();
    const { container } = render(
      <Select mode="tags" tokenSeparators={[',']} onChange={handleChange} onSelect={handleSelect}>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );

    // composition start
    fireEvent.compositionStart(container.querySelector('input'));
    fireEvent.change(container.querySelector('input'), { target: { value: '2,3,4' } });
    expect(handleChange).not.toHaveBeenCalled();
    handleChange.mockReset();

    // composition end
    fireEvent.compositionEnd(container.querySelector('input'));
    expect(handleChange).toHaveBeenCalledWith(['2', '3', '4'], expect.anything());

    expect(handleSelect).toHaveBeenCalledTimes(3);
    expect(handleSelect).toHaveBeenLastCalledWith('4', expect.anything());
    expect(findSelection(container).textContent).toEqual('2');
    expect(findSelection(container, 1).textContent).toEqual('3');
    expect(findSelection(container, 2).textContent).toEqual('4');
    expect(container.querySelector('input').value).toBe('');
    expectOpen(container, false);
  });

  it('should work when menu is closed', () => {
    const handleChange = jest.fn();
    const handleSelect = jest.fn();
    const { container } = render(
      <Select
        mode="tags"
        tokenSeparators={[',']}
        onChange={handleChange}
        onSelect={handleSelect}
        open={false}
      >
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );
    fireEvent.compositionStart(container.querySelector('input'));
    fireEvent.change(container.querySelector('input'), { target: { value: 'Star Kirby' } });
    keyDown(container.querySelector('input'), KeyCode.ENTER);
    expect(handleChange).not.toHaveBeenCalled();
    handleChange.mockReset();
    fireEvent.compositionEnd(container.querySelector('input'));
    keyDown(container.querySelector('input'), KeyCode.ENTER);
    expect(handleChange).toHaveBeenCalledWith(['Star Kirby'], expect.anything());
    expect(handleSelect).toHaveBeenCalledTimes(1);
    expect(findSelection(container).textContent).toEqual('Star Kirby');
    expect(container.querySelector('input').value).toBe('');
    expectOpen(container, false);
  });

  // Paste tests
  [
    {
      tokenSeparators: [' ', '\n'],
      clipboardText: '\n  light\n  bamboo\n  ',
      inputValue: '   light   bamboo   ',
    },
    {
      tokenSeparators: ['\r\n'],
      clipboardText: '\r\nlight\r\nbamboo\r\n',
      inputValue: ' light bamboo',
    },
    {
      tokenSeparators: [' ', '\r\n'],
      clipboardText: '\r\n light\r\n bamboo\r\n ',
      inputValue: '  light  bamboo  ',
    },
    {
      tokenSeparators: ['\n'],
      clipboardText: '\nlight\nbamboo\n',
      inputValue: ' light bamboo',
    },
  ].forEach(({ tokenSeparators, clipboardText, inputValue }) => {
    it(`paste content to split (${JSON.stringify(tokenSeparators)})`, () => {
      const onChange = jest.fn();
      const { container } = render(
        <Select mode="tags" tokenSeparators={tokenSeparators} onChange={onChange}>
          <Option value="1">1</Option>
        </Select>,
      );

      // container.find('input').simulate('paste', {
      //   clipboardData: {
      //     getData: () => clipboardText,
      //   },
      // });
      fireEvent.paste(container.querySelector('input'), {
        clipboardData: { getData: () => clipboardText },
      });
      // container.find('input').simulate('change', {
      //   target: { value: inputValue },
      // });
      fireEvent.change(container.querySelector('input'), {
        target: { value: inputValue },
      });

      expect(onChange).toHaveBeenCalledWith(['light', 'bamboo'], expect.anything());
      expect(onChange).toHaveBeenCalledTimes(1);
    });
  });

  it('renders unlisted item in value', () => {
    const { container } = render(
      <Select mode="tags" value="3" open>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );

    expect(container.querySelectorAll('.rc-select-item-option')).toHaveLength(3);
  });

  it('dropdown keeps order', () => {
    const { container } = render(<Select mode="tags" open value={['aaaaa', 'aaa']} />);

    fireEvent.change(container.querySelector('input'), { target: { value: 'aaa' } });
    expectOpen(container);
    expect(container.querySelectorAll('.rc-select-item-option-content')[0].textContent).toEqual(
      'aaa',
    );
    expect(container.querySelectorAll('.rc-select-item-option-content')[1].textContent).toEqual(
      'aaaaa',
    );
  });

  it('renders search value when not found', () => {
    const { container } = render(
      <Select mode="tags" value="22" searchValue="2" open>
        <Option value="1">1</Option>
      </Select>,
    );

    expect(container.querySelectorAll('.rc-select-item-option-content')[0].textContent).toEqual(
      '2',
    );
    expect(container.querySelectorAll('.rc-select-item-option-content')[1].textContent).toEqual(
      '22',
    );
  });

  it('renders options matched with optionFilterProp', () => {
    const { container } = render(
      <Select open value="22" mode="tags" searchValue="option-1" optionFilterProp="children">
        <Option value="1">option-1</Option>
        <Option value="2">option-2</Option>
      </Select>,
    );

    expect(container.querySelectorAll('.rc-select-item-option-content')[0].textContent).toEqual(
      'option-1',
    );
  });

  it('use filterOption', () => {
    const filterOption = (inputValue, option) =>
      option.value.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1;

    const { container } = render(
      <Select mode="tags" searchValue="red" filterOption={filterOption} open>
        <Option value="Red">Red</Option>
      </Select>,
    );

    expect(container.querySelectorAll('.rc-select-item-option-content')).toHaveLength(2);
  });

  it('filterOption is false', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Select mode="tags" filterOption={false} onChange={onChange}>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );

    fireEvent.change(container.querySelector('input'), { target: { value: 'a' } });
    expect(container.querySelectorAll('.rc-select-item-option-content')).toHaveLength(3);

    keyDown(container.querySelector('input'), KeyCode.ENTER);
    expect(onChange).toHaveBeenCalledWith(['a'], expect.anything());
  });

  describe('tagRender', () => {
    it('can render custom tags', () => {
      const onTagRender = jest.fn();
      const tagRender = (props: any) => {
        const { label } = props;
        onTagRender(label);
        return (
          <span className={classNames(label, 'customize-tag')}>
            {label}
            {label}
          </span>
        );
      };
      const { container } = render(
        <Select mode="tags" tokenSeparators={[',']} tagRender={tagRender} />,
      );

      fireEvent.change(container.querySelector('input'), { target: { value: '1,A,42' } });
      fireEvent.mouseDown(container.querySelector('span.A'));

      expectOpen(container, true);
      expect(container.querySelector('span.A')).toBeTruthy();
      expect(container.querySelector('span.A').textContent).toBe('AA');
      expect(onTagRender).toHaveBeenCalled();
      expect(container.querySelectorAll('.customize-tag')).toHaveLength(3);

      fireEvent.mouseDown(container.querySelector('span.A'));
      expectOpen(container, false);
    });

    it('disabled', () => {
      const tagRender = jest.fn();
      render(
        <Select
          mode="tags"
          disabled
          value={['light']}
          tagRender={tagRender}
          options={[{ value: 'light' }]}
        />,
      );

      expect(tagRender).toHaveBeenCalledWith(expect.objectContaining({ closable: false }));
    });

    it('option disabled', () => {
      const tagRender = jest.fn();
      render(
        <Select
          mode="tags"
          disabled
          value={['light']}
          tagRender={tagRender}
          options={[{ value: 'light', disabled: true }]}
        />,
      );

      expect(tagRender).toHaveBeenCalledWith(expect.objectContaining({ closable: false }));
    });

    it('should keep key', () => {
      const MyTag = ({ onClose, label }: any) => {
        const [closed, setClosed] = React.useState(false);

        return (
          <span
            className="my-tag"
            onClick={() => {
              setClosed(true);
              onClose();
            }}
          >
            {label}
            {String(closed)}
          </span>
        );
      };

      const onDisplayValuesChange = jest.fn();

      const renderDemo = (props?: any) => (
        <BaseSelect
          mode="tags"
          maxTagCount={99}
          tagRender={(tagProps) => <MyTag {...tagProps} />}
          onDisplayValuesChange={onDisplayValuesChange}
          displayValues={[
            {
              label: '1',
              value: 1,
            },
            {
              label: '2',
              value: 2,
            },
          ]}
          {...props}
        />
      );

      const { container, rerender } = render(renderDemo());

      fireEvent.click(container.querySelector('.my-tag'));
      expect(onDisplayValuesChange).toHaveBeenCalled();

      // Update
      rerender(
        renderDemo({
          displayValues: [
            {
              label: '2',
              value: 2,
            },
          ],
        }),
      );

      expect(container.querySelector('.my-tag')).toBeTruthy();
      expect(container.querySelector('.my-tag').textContent).toEqual('2false');
    });
  });

  describe('OptGroup', () => {
    const createSelect = (props) => (
      <div>
        <Select mode="tags" {...props}>
          <OptGroup key="Manager" label="Manager">
            <Option key="jack" value="jack">
              Jack
            </Option>
          </OptGroup>
          <OptGroup key="Engineer" label="Engineer">
            <Option key="Yiminghe" value="Yiminghe">
              yiminghe
            </Option>
          </OptGroup>
        </Select>
      </div>
    );

    it('renders correctly', () => {
      const { container } = render(createSelect({ value: ['jack', 'foo'], open: true }));
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders inputValue correctly', () => {
      const { container } = render(createSelect({}));
      toggleOpen(container);

      fireEvent.change(container.querySelector('input'), { target: { value: 'foo' } });
      expect(container.querySelectorAll('.rc-select-item-option-content')).toHaveLength(1);

      keyDown(container.querySelector('input'), KeyCode.ENTER);
      expect(container.querySelectorAll('.rc-select-item')).toHaveLength(5);
    });

    it('should work fine when filterOption function exists', () => {
      const LegacyOption = Select.Option as any; // Compatible to legacy usage

      const children = [];
      for (let i = 10; i < 36; i += 1) {
        children.push(
          <LegacyOption key={i.toString(36) + i} disabled={!(i % 3)}>
            {i.toString(36) + i}
          </LegacyOption>,
        );
      }
      const { container } = render(
        <Select
          mode="tags"
          style={{ width: '100%' }}
          placeholder="Tags Mode"
          filterOption={(input, { key }) => String(key).indexOf(input) >= 0}
        >
          {children}
        </Select>,
      );
      toggleOpen(container);
      fireEvent.change(container.querySelector('input'), { target: { value: 'f' } });
      expect(container.querySelectorAll('.rc-select-item-option-content')).toHaveLength(2);
      keyDown(container.querySelector('input'), KeyCode.ENTER);
      expect(findSelection(container).textContent).toEqual('f');
    });
  });

  it('not modify origin options', () => {
    const errSpy = jest.spyOn(console, 'error');
    const { container } = render(<Select mode="tags" filterOption={false} options={[]} />);
    toggleOpen(container);
    // container.find('input').simulate('change', { target: { value: 'a' } });
    fireEvent.change(container.querySelector('input'), { target: { value: 'a' } });
    // container.find('input').simulate('change', { target: { value: 'ab' } });
    fireEvent.change(container.querySelector('input'), { target: { value: 'ab' } });
    // container.find('input').simulate('change', { target: { value: 'a' } });
    fireEvent.change(container.querySelector('input'), { target: { value: 'a' } });
    // container.find('input').simulate('change', { target: { value: '' } });
    fireEvent.change(container.querySelector('input'), { target: { value: '' } });

    expect(errSpy).not.toHaveBeenCalled();
    errSpy.mockRestore();
  });

  it('correctly handles the `tabIndex` prop', () => {
    const { container } = render(<Select mode="tags" tabIndex={0} />);
    expect(container.querySelector('.rc-select').getAttribute('tabindex')).toBeFalsy();

    expect(
      container.querySelector('input.rc-select-selection-search-input').getAttribute('tabindex'),
    ).toBe('0');
  });

  it('press enter should not submit form', () => {
    const { container } = render(<Select mode="tags" open={false} />);

    const inputEle = container.querySelector('input');

    const preventDefault = jest.fn();
    const keyDownEvent = createEvent.keyDown(inputEle, {
      which: KeyCode.ENTER,
      keyCode: KeyCode.ENTER,
    });
    keyDownEvent.preventDefault = preventDefault;

    fireEvent(inputEle, keyDownEvent);
    expect(preventDefault).toHaveBeenCalled();
  });

  // https://github.com/ant-design/ant-design/issues/43954
  it('when insert a same input is one of options value, should not create a tag option', () => {
    const errSpy = jest.spyOn(console, 'error');

    const { container } = render(
      <Select
        mode="tags"
        options={[
          { label: 'US-美国', value: 'US' },
          { label: 'CN-中国', value: 'CN' },
        ]}
        optionFilterProp="label"
      />,
    );
    toggleOpen(container);
    expect(container.querySelectorAll('.rc-select-item-option')).toHaveLength(2);

    fireEvent.change(container.querySelector('input'), { target: { value: 'US' } });
    expect(container.querySelectorAll('.rc-select-item-option')).toHaveLength(1);
    expect(errSpy).not.toHaveBeenCalled();
  });

  it(`paste content to split when count >= maxCount`, () => {
    const onChange = jest.fn();
    const { container } = render(
      <Select
        mode="tags"
        maxCount={3}
        onChange={onChange}
        tokenSeparators={[',']}
        value={['1', '2', '3']}
      />,
    );
    const input = container.querySelector<HTMLInputElement>('input');
    fireEvent.paste(input, {
      clipboardData: { getData: () => 'test' },
    });
    fireEvent.change(input, {
      target: { value: 'test' },
    });
    expect(onChange).not.toBeCalled();
  });
});
