export const getRange = (page: number, range: number) => {
  const from = page * range;
  const to = from + range - 1;

  return { from, to };
};
