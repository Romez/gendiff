import fs from 'fs';
import genDiff from '../src';

test('getDataDiff', () => {
  const expected = fs.readFileSync('__tests__/__fixtures__/result.txt', 'utf8');

  const result = genDiff('__tests__/__fixtures__/before.json', '__tests__/__fixtures__/after.json');

  expect(result).toMatch(expected);
});
