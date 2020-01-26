import { filterAst } from '..';

test('filter key nodes', () => {
  const data = [
    { type: 'removed', key: 'foo', children: [] },
    { type: 'added', key: 'bar', children: [] },
    { type: 'unchanged', key: 'gee', children: [] },
    {
      type: 'nested',
      key: 'jee',
      children: [
        {
          type: 'nested',
          key: 'lue',
          children: [
            { type: 'unchanged', key: 'vue', children: [] },
          ],
        },
      ],
    },
  ];

  const expected = [
    { type: 'removed', key: 'foo', children: [] },
    { type: 'added', key: 'bar', children: [] },
    {
      type: 'nested',
      key: 'jee',
      children: [
        {
          type: 'nested',
          key: 'lue',
          children: [],
        },
      ],
    },
  ];

  expect(filterAst((node) => node.type !== 'unchanged', data)).toEqual(expected);
});

test('filter empty nested', () => {
  const ast = [
    { type: 'removed', key: 'foo', children: [] },
    { type: 'added', key: 'bar', children: [] },
    {
      type: 'nested',
      key: 'jee',
      children: [
        {
          type: 'nested',
          key: 'lue',
          children: [],
        },
      ],
    },
  ];

  const expected = [
    { type: 'removed', key: 'foo', children: [] },
    { type: 'added', key: 'bar', children: [] },
  ];

  const result = filterAst(({ type }) => (type !== 'unchanged'), ast);

  const filterNested = ({ type, children }) => {
    if (type !== 'nested') {
      return true;
    }

    if (children.length === 0) {
      return false;
    }

    return filterAst(filterNested, children).length > 0;
  };

  const result1 = filterAst(filterNested, result);

  expect(result1).toEqual(expected);
});
