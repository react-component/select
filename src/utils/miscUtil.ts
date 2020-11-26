export const handleClickAction = (fn, { isIE = false }) =>
  (isIE ? setTimeout(() => fn()) : fn());
