import fs from 'fs';
import { orderBy } from 'lodash';
import { getDataDiff } from '../src';

test('getDataDiff', () => {
  const firstConfig = JSON.parse(fs.readFileSync('__tests__/__fixtures__/before.json', 'utf8'));
  const secondConfig = JSON.parse(fs.readFileSync('__tests__/__fixtures__/after.json', 'utf8'));

  const result = getDataDiff(firstConfig, secondConfig);
  const expected = [
    { type: 'deleted', key: 'follow', value: false },
    { type: 'deleted', key: 'proxy', value: '123.234.53.22' },
    { type: 'added', key: 'verbose', value: true },
    { type: 'matched', key: 'host', value: 'hexlet.io' },
    { type: 'deleted', key: 'timeout', value: 50 },
    { type: 'added', key: 'timeout', value: 20 },
  ];

  expect(orderBy(result, 'key')).toEqual(orderBy(expected, 'key'));
});
