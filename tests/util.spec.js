/* eslint-disable no-undef */
import {
  includesSeparators,
  splitBySeparators,
  getValuePropValue,
  defaultFilterFn,
} from '../src/util';

describe('includesSeparators', () => {
  const separators = [' ', ','];
  it('return true when given includes separators', () => {
    expect(includesSeparators(',foo,bar', separators)).toBe(true);
  });

  it('return false when given do not include separators', () => {
    expect(includesSeparators('foobar', separators)).toBe(false);
  });

  it('return false when string only has a leading separator', () => {
    expect(includesSeparators(',foobar', separators)).toBe(false);
  });
});

describe('splitBySeparators', () => {
  const separators = [' ', ','];
  it('split given string by separators', () => {
    const string = 'foo bar,baz';
    expect(splitBySeparators(string, separators)).toEqual(['foo', 'bar', 'baz']);
  });

  it('split string with leading separator ', () => {
    const string = ',foo';
    expect(splitBySeparators(string, separators)).toEqual(['foo']);
  });

  it('split string with trailling separator', () => {
    const string = 'foo,';
    expect(splitBySeparators(string, separators)).toEqual(['foo']);
  });

  it('split a separator', () => {
    const string = ',';
    expect(splitBySeparators(string, separators)).toEqual([]);
  });

  it('split two separators', () => {
    const string = ',,';
    expect(splitBySeparators(string, separators)).toEqual([]);
  });

  it('split two separators surrounded by valid input', () => {
    const string = 'a,,b';
    expect(splitBySeparators(string, separators)).toEqual(['a', 'b']);
  });

  it('split multiple separators with valid input throughout', () => {
    const string = ',,,a,b,,,c,d,,,e,';
    expect(splitBySeparators(string, separators)).toEqual(['a', 'b', 'c', 'd', 'e']);
  });
});

describe('getValuePropValue', () => {
  const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  afterEach(() => {
    errorSpy.mockReset();
  });

  afterAll(() => {
    errorSpy.mockRestore();
  });

  it('return label when type is isSelectOptGroup', () => {
    expect(getValuePropValue({
      props: {
        label: 'Manager',
      },
      type: {
        isSelectOptGroup: true,
      },
    })).toBe('Manager');
    expect(errorSpy).not.toHaveBeenCalled();
  });
});

describe('defaultFilterFn', () => {
  function TesterClass() {
    this.props = {
      optionFilterProp: 'label',
    };
  }
  const testerInstance = new TesterClass();
  const child = {
    props: {
      label: 'my-val',
    },
  };

  it('returns true when input matches option value', () => {
    expect(defaultFilterFn.call(testerInstance, 'my-val', child)).toBe(true);
  });

  it('returns false when input does NOT match option value', () => {
    expect(defaultFilterFn.call(testerInstance, 'wrong-val', child)).toBe(false);
  });
});
