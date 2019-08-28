import fs from 'fs';
import path from 'path';
import { has, uniq } from 'lodash';

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
  const firstConfig = JSON.parse(fs.readFileSync(firstPath, 'utf8'));

  const secondPath = path.resolve(secondConfigPath);
  const secondConfig = JSON.parse(fs.readFileSync(secondPath, 'utf8'));

  return getDataDiff(firstConfig, secondConfig);
};
