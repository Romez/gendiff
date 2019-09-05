import fs from 'fs';
import path from 'path';
import genDiff from '../src';

const expectedBaseFormat = fs.readFileSync(path.resolve(__dirname, '__fixtures__/result-base.txt'), 'utf8');
const expectedPlainFormat = fs.readFileSync(path.resolve(__dirname, '__fixtures__/result-plain.txt'), 'utf8');

const dataSet = [
  ['before.json', 'after.json', 'base', expectedBaseFormat],
  ['before.yml', 'after.yml', 'base', expectedBaseFormat],
  ['before.ini', 'after.ini', 'base', expectedBaseFormat],
  ['before.json', 'after.json', 'plain', expectedPlainFormat],
  ['before.yml', 'after.yml', 'plain', expectedPlainFormat],
  ['before.ini', 'after.ini', 'plain', expectedPlainFormat],
];

test.each(dataSet)('genDiff(%s, %s, %s)', (beforeFileName, afterFileName, format, expected) => {
  const beforePath = path.resolve(__dirname, '__fixtures__', beforeFileName);
  const afterPath = path.resolve(__dirname, '__fixtures__', afterFileName);

  const result = genDiff(beforePath, afterPath, format);
  expect(result).toMatch(expected);
});
