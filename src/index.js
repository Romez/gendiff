import fs from 'fs';
import path from 'path';
import { has, uniq } from 'lodash';
import getParser from './parsers';

const typeSigns = {
  matched: ' ',
  added: '+',
  deleted: '-',
};

export const getDataDiff = (firstConfig, secondConfig) => {
  const allKeys = uniq([...Object.keys(firstConfig), ...Object.keys(secondConfig)]);

  return allKeys.reduce((acc, key) => {
    if (!has(firstConfig, key) && has(secondConfig, key)) {
      return acc.concat({ type: 'added', key, value: secondConfig[key] });
    }

    if (has(firstConfig, key) && !has(secondConfig, key)) {
      return acc.concat({ type: 'deleted', key, value: firstConfig[key] });
    }

    if (firstConfig[key] === secondConfig[key]) {
      return acc.concat({ type: 'matched', key, value: firstConfig[key] });
    }

    return acc
      .concat({ type: 'deleted', key, value: firstConfig[key] })
      .concat({ type: 'added', key, value: secondConfig[key] });
  }, []);
};

export default (firstConfigPath, secondConfigPath) => {
  const firstPath = path.resolve(firstConfigPath);
  const secondPath = path.resolve(secondConfigPath);

  const firstConfigData = fs.readFileSync(firstPath, 'utf8');
  const secondConfigData = fs.readFileSync(secondPath, 'utf8');

  const firstConfig = getParser(path.extname(firstConfigPath))(firstConfigData);
  const secondConfig = getParser(path.extname(secondConfigPath))(secondConfigData);

  const diff = getDataDiff(firstConfig, secondConfig);
  const rows = diff.map(({ type, key, value }) => `  ${typeSigns[type]} ${key}: ${value}`);

  const result = ['{', ...rows, '}'];
  return result.join('\n');
};
