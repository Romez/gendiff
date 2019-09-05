import fs from 'fs';
import path from 'path';
import genDiff from '../src';

const expected = fs.readFileSync(path.resolve(__dirname, '__fixtures__/result.txt'), 'utf8');

const dataSet = [
  ['before.json', 'after.json', 'default'],
  ['before.yml', 'after.yml', 'default'],
  ['before.ini', 'after.ini', 'default'],
];

test.each(dataSet)('genDiff(%s, %s, $s)', (beforeFileName, afterFileName, format) => {
  const beforePath = path.resolve(__dirname, '__fixtures__', beforeFileName);
  const afterPath = path.resolve(__dirname, '__fixtures__', afterFileName);

  const result = genDiff(beforePath, afterPath, format);
  expect(result).toMatch(expected);
});
