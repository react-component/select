import {
  defaultFilterFn,
  getValuePropValue,
  includesSeparators,
  splitBySeparators,
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
    const str = 'foo bar,baz';
    expect(splitBySeparators(str, separators)).toEqual(['foo', 'bar', 'baz']);
  });

  it('split string with leading separator ', () => {
    const str = ',foo';
    expect(splitBySeparators(str, separators)).toEqual(['foo']);
  });

  it('split string with trailling separator', () => {
    const str = 'foo,';
    expect(splitBySeparators(str, separators)).toEqual(['foo']);
  });

  it('split a separator', () => {
    const str = ',';
    expect(splitBySeparators(str, separators)).toEqual([]);
  });

  it('split two separators', () => {
    const str = ',,';
    expect(splitBySeparators(str, separators)).toEqual([]);
  });

  it('split two separators surrounded by valid input', () => {
    const str = 'a,,b';
    expect(splitBySeparators(str, separators)).toEqual(['a', 'b']);
  });

  it('split repeating separators with valid input throughout', () => {
    const str = ',,,a,b,,,c,d,,,e,';
    expect(splitBySeparators(str, separators)).toEqual(['a', 'b', 'c', 'd', 'e']);
  });

  it('split multiple repeating separators with valid input throughout', () => {
    const str = ',,,a b,  c,d, ,e    ,f';
    expect(splitBySeparators(str, separators)).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
  });
});

describe('getValuePropValue', () => {
  const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => null);

  afterEach(() => {
    errorSpy.mockReset();
  });

  afterAll(() => {
    errorSpy.mockRestore();
  });

  it('return label when type is isSelectOptGroup', () => {
    expect(
      getValuePropValue({
        props: {
          label: 'Manager',
        },
        type: {
          isSelectOptGroup: true,
        },
      }),
    ).toBe('Manager');
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
