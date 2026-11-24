import { getNextActiveIndex } from '../src/utils/keyUtil';

describe('getNextActiveIndex', () => {
  it.each([
    [-1, -1, -1],
    [-1, 1, 0],
    [0, -1, -1],
    [0, 1, 1],
    [1, -1, 0],
    [1, 1, 2],
    [2, -1, 1],
    [2, 1, 3],
  ])('starts scanning from %i with offset %i at %i', (activeIndex, offset, expected) => {
    expect(getNextActiveIndex(activeIndex, offset)).toBe(expected);
  });
});
