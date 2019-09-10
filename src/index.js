import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import getParser from './parsers';
import getFormatter from './formatters';

const nodeBuilders = [
  {
    check: (key, firstConfig, secondConfig) => !_.has(firstConfig, key) && _.has(secondConfig, key),
    build: (key, __, valueAfter) => ({ type: 'added', key, valueAfter }),
  },
  {
    check: (key, firstConfig, secondConfig) => _.has(firstConfig, key) && !_.has(secondConfig, key),
    build: (key, valueBefore) => ({ type: 'removed', key, valueBefore }),
  },
  {
    check: (key, firstConfig, secondConfig) => {
      const firstValue = firstConfig[key];
      const secondValue = secondConfig[key];
      return _.isObject(firstValue) && _.isObject(secondValue);
    },
    build: (key, valueBefore, valueAfter, makeAst) => ({ type: 'nested', key, children: makeAst(valueBefore, valueAfter) }),
  },
  {
    check: (key, firstConfig, secondConfig) => firstConfig[key] === secondConfig[key],
    build: (key, valueBefore) => ({ type: 'unchanged', key, valueBefore }),
  },
  {
    check: (key, firstConfig, secondConfig) => firstConfig[key] !== secondConfig[key],
    build: (key, valueBefore, valueAfter) => ({
      type: 'updated',
      key,
      valueBefore,
      valueAfter,
    }),
  },
];

const getNodeBuilder = (key, firstConfig, secondConfig) => nodeBuilders
  .find(({ check }) => check(key, firstConfig, secondConfig));

export const makeAst = (firstConfig, secondConfig) => {
  const allKeys = _.union(_.keys(firstConfig), _.keys(secondConfig));

  return allKeys.map((key) => {
    const { build } = getNodeBuilder(key, firstConfig, secondConfig);
    return build(key, firstConfig[key], secondConfig[key], makeAst);
  });
};

export default (firstConfigPath, secondConfigPath, format) => {
  const firstConfigData = fs.readFileSync(path.resolve(firstConfigPath), 'utf8');
  const firstConfigParse = getParser(path.extname(firstConfigPath).slice(1));
  const firstConfig = firstConfigParse(firstConfigData);

  const secondConfigData = fs.readFileSync(path.resolve(secondConfigPath), 'utf8');
  const secondConfigParse = getParser(path.extname(secondConfigPath).slice(1));
  const secondConfig = secondConfigParse(secondConfigData);

  const ast = makeAst(firstConfig, secondConfig);
  const formatAst = getFormatter(format);

  return formatAst(ast);
};
