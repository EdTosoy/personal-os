import { paginate } from '../src/lib/pagination';

describe('Project pagination', () => {
  it.each([0, 1, 4, 5, 8, 9, 17])(
    'preserves every item exactly once for %i items',
    (count) => {
      const items = Array.from({ length: count }, (_, i) => i);
      const pages = Array.from(
        { length: Math.max(1, Math.ceil(count / 4)) },
        (_, i) => paginate(items, String(i + 1)),
      );
      expect(pages.flatMap((page) => page.items)).toEqual(items);
      expect(pages.every((page) => page.items.length <= 4)).toBe(true);
      expect(paginate(items, '999').page).toBe(pages.length);
    },
  );

  it.each([
    undefined,
    'bad',
    '-1',
    '0',
    '1.5',
    'Infinity',
    '9e9',
    '99999999999999999999999',
  ])('safely handles invalid URL input %s', (requested) => {
    expect(paginate([1, 2, 3, 4, 5], requested).page).toBe(1);
  });

  it('supports another page size while rejecting invalid sizes', () => {
    expect(paginate([1, 2, 3, 4, 5], '3', 2)).toMatchObject({
      page: 3,
      pageCount: 3,
      items: [5],
    });
    expect(() => paginate([], '1', 0)).toThrow(RangeError);
  });
});
