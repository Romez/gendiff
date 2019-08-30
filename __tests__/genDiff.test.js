import fs from 'fs';
import path from 'path';
import genDiff from '../src';

const expected = fs.readFileSync(path.resolve(__dirname, '__fixtures__/result.txt'), 'utf8');

const dataSet = [
  ['before.json', 'after.json'],
  ['before.yml', 'after.yml'],
  ['before.ini', 'after.ini'],
];

test.each(dataSet)('getDataDiff(%s, %s)', (beforeFileName, afterFileName) => {
  const beforePath = path.resolve(__dirname, '__fixtures__', beforeFileName);
  const afterPath = path.resolve(__dirname, '__fixtures__', afterFileName);

  const result = genDiff(beforePath, afterPath);
  expect(result).toMatch(expected);
});
