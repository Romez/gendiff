import fs from 'fs';
import path from 'path';
import genDiff from '../src';

const dataSet = [
  ['before.json', 'after.json', 'pretty', 'result-pretty.txt'],
  ['before.yml', 'after.yml', 'pretty', 'result-pretty.txt'],
  ['before.ini', 'after.ini', 'pretty', 'result-pretty.txt'],
  ['before.json', 'after.json', 'plain', 'result-plain.txt'],
  ['before.yml', 'after.yml', 'plain', 'result-plain.txt'],
  ['before.ini', 'after.ini', 'plain', 'result-plain.txt'],
  ['before.json', 'after.json', 'json', 'result.json'],
  ['before.yml', 'after.yml', 'json', 'result.json'],
  ['before.ini', 'after.ini', 'json', 'result.json'],
];

test.each(dataSet)('genDiff(%s, %s, %s)', (beforeFileName, afterFileName, format, expectedFilename) => {
  const beforePath = path.resolve(__dirname, '__fixtures__', beforeFileName);
  const afterPath = path.resolve(__dirname, '__fixtures__', afterFileName);
  const expected = fs.readFileSync(path.resolve(__dirname, '__fixtures__', expectedFilename), 'utf8');

  const result = genDiff(beforePath, afterPath, format);

  expect(result).toMatch(expected);
});
