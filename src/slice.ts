/** iterator版slice */
export const slice = <T>(
  start: number,
  end: number,
  list: Iterable<T>,
): T[] => {
  const [s, e] = start < end ? [start, end] : [end, start];
  let counter = 0;
  const sliced: T[] = [];
  for (const value of list) {
    if (s <= counter) sliced.push(value);
    if (e <= counter) break;
    counter++;
  }
  return sliced;
};
