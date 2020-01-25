import fs from 'fs';
import path from 'path';
import genDiff from '../src';

const dataSet = [
  ['.json', 'pretty'],
  ['.yml', 'pretty'],
  ['.ini', 'pretty'],
  ['.json', 'plain'],
  ['.yml', 'plain'],
  ['.ini', 'plain'],
  ['.json', 'json'],
  ['.yml', 'json'],
  ['.ini', 'json'],
];

test.each(dataSet)('genDiff(%s, %s, %s)', (ext, format) => {
  const dir = path.resolve(__dirname, '__fixtures__');

  const beforePath = path.format({ dir, name: 'before', ext });
  const afterPath = path.format({ dir, name: 'after', ext });
  const expectedPath = path.format({ dir, name: `result-${format}.txt` });

  const expected = fs.readFileSync(expectedPath, 'utf8');

  const result = genDiff(beforePath, afterPath, { format, keyOnly: false });

  expect(result).toMatch(expected);
});

const onlyKeySet = [
  ['.json', 'pretty'],
  ['.yml', 'pretty'],
  ['.ini', 'pretty'],
  ['.json', 'json'],
  ['.yml', 'json'],
  ['.ini', 'json'],
];

test.each(onlyKeySet)('genDiff(%s, %s, %s)', (ext, format) => {
  const dir = path.resolve(__dirname, '__fixtures__');

  const beforePath = path.format({ dir, name: 'before', ext });
  const afterPath = path.format({ dir, name: 'after', ext });
  const expectedPath = path.format({ dir, name: `result-${format}-key-only.txt` });

  const expected = fs.readFileSync(expectedPath, 'utf8');

  const result = genDiff(beforePath, afterPath, { format, keyOnly: true });

  expect(result).toMatch(expected);
});
