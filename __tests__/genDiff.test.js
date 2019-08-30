import fs from 'fs';
import path from 'path';
import genDiff from '../src';

const expected = fs.readFileSync(path.resolve(__dirname, '__fixtures__/result.txt'), 'utf8');

const dataSet = [
  [path.resolve(__dirname, '__fixtures__/before.json'), path.resolve(__dirname, '__fixtures__/after.json')],
  [path.resolve(__dirname, '__fixtures__/before.yml'), path.resolve(__dirname, '__fixtures__/after.yml')],
];

test.each(dataSet)('getDataDiff(%s, %s)', (beforePath, afterPath) => {
  const result = genDiff(beforePath, afterPath);
  expect(result).toMatch(expected);
});
