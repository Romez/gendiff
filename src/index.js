import { has, uniq } from 'lodash';

export default (firstConfig, secondConfig) => {
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
