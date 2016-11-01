import expect from 'expect.js';
import { includesSeparators, splitBySeparators } from '../src/util';

describe('includesSeparators', () => {
  const separators = [' ', ','];
  it('return true when given includes separators', () => {
    expect(includesSeparators(',foo,bar', separators)).to.be(true);
  });

  it('return false when given do not include separators', () => {
    expect(includesSeparators('foobar', separators)).to.be(false);
  });

  it('return false when string only has a leading separator', () => {
    expect(includesSeparators(',foobar', separators)).to.be(false);
  });
});

describe('splitBySeparators', () => {
  const separators = [' ', ','];
  it('split given string by separators', () => {
    const string = 'foo bar,baz';
    expect(splitBySeparators(string, separators)).to.eql(['foo', 'bar', 'baz']);
  });

  it('split string with leading separator ', () => {
    const string = ',foo';
    expect(splitBySeparators(string, separators)).to.eql(['foo']);
  });

  it('split string with trailling separator', () => {
    const string = 'foo,';
    expect(splitBySeparators(string, separators)).to.eql(['foo']);
  });

  it('split a separator', () => {
    const string = ',';
    expect(splitBySeparators(string, separators)).to.eql([]);
  });
});
