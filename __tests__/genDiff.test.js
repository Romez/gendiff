import fs from 'fs';
import { orderBy } from 'lodash';
import genDiff from '../src';

test('genDiff', () => {
  const firstConfig = JSON.parse(fs.readFileSync('__tests__/__fixtures__/before.json', 'utf8'));
  const secondConfig = JSON.parse(fs.readFileSync('__tests__/__fixtures__/after.json', 'utf8'));

  const result = orderBy(genDiff(firstConfig, secondConfig), 'key');
  const expected = orderBy([
    { type: 'deleted', key: 'follow', value: false },
    { type: 'deleted', key: 'proxy', value: '123.234.53.22' },
    { type: 'added', key: 'verbose', value: true },
    { type: 'matched', key: 'host', value: 'hexlet.io' },
    { type: 'deleted', key: 'timeout', value: 50 },
    { type: 'added', key: 'timeout', value: 20 },
  ], 'key');

  expect(result).toEqual(expected);
});
