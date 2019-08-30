import fs from 'fs';
import path from 'path';
import genDiff from '../src';

const expected = fs.readFileSync(path.resolve(__dirname, '__fixtures__/result.txt'), 'utf8');

test('json getDataDiff', () => {
  const beforePath = path.resolve(__dirname, '__fixtures__/before.json');
  const afterPath = path.resolve(__dirname, '__fixtures__/after.json');

  const result = genDiff(beforePath, afterPath);
  expect(result).toMatch(expected);
});

test('yaml getDataDiff', () => {
  const beforePath = path.resolve(__dirname, '__fixtures__/before.yml');
  const afterPath = path.resolve(__dirname, '__fixtures__/after.yml');

  const result = genDiff(beforePath, afterPath);
  expect(result).toMatch(expected);
});
