export function castNumber(value) {
  if (process.env.TEST_NUMBER_VALUE) {
    return +value;
  }
  return String(value);
}
