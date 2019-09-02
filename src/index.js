import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import getParser from './parsers';

const padding = '    ';

const nodeBuilders = [
  {
    check: (key, firstConfig, secondConfig) => !_.has(firstConfig, key) && _.has(secondConfig, key),
    build: (key, __, valueAfter) => ({ type: 'added', key, valueAfter }),
  },
  {
    check: (key, firstConfig, secondConfig) => _.has(firstConfig, key) && !_.has(secondConfig, key),
    build: (key, valueBefore) => ({ type: 'deleted', key, valueBefore }),
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
      type: 'changed',
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

const renderObject = (obj, deep = 0) => {
  const currentDeepPadding = padding.repeat(deep);

  const result = Object.keys(obj).map((key) => {
    const value = _.isObject(obj[key]) ? renderObject(obj[key], deep + 1) : obj[key];
    return `${currentDeepPadding}    ${key}: ${value}`;
  }).join('\n');

  return ['{', result, `${currentDeepPadding}}`].join('\n');
};

const renders = {
  added: ({ key, valueAfter }, deep) => {
    const value = _.isObject(valueAfter) ? renderObject(valueAfter, deep + 1) : valueAfter;
    return `${padding.repeat(deep)}  + ${key}: ${value}`;
  },
  deleted: ({ key, valueBefore }, deep) => {
    const value = _.isObject(valueBefore) ? renderObject(valueBefore, deep + 1) : valueBefore;
    return `${padding.repeat(deep)}  - ${key}: ${value}`;
  },
  nested: ({ key, children }, deep, render) => `${padding.repeat(deep)}    ${key}: ${render(children, deep + 1, render)}`,
  unchanged: ({ key, valueBefore }, deep) => {
    const value = _.isObject(valueBefore) ? renderObject(valueBefore, deep + 1) : valueBefore;
    return `${padding.repeat(deep)}    ${key}: ${value}`;
  },
  changed: (node, deep) => [renders.deleted(node, deep), renders.added(node, deep)],
};

const render = (data, deep) => {
  const result = _.flatMap(data, (node) => {
    const nodeRender = renders[node.type];
    return nodeRender(node, deep, render);
  });

  return ['{', ...result, `${padding.repeat(deep)}}`].join('\n');
};

export default (firstConfigPath, secondConfigPath) => {
  const firstConfigData = fs.readFileSync(path.resolve(firstConfigPath), 'utf8');
  const secondConfigData = fs.readFileSync(path.resolve(secondConfigPath), 'utf8');

  const firstConfigParser = getParser(path.extname(firstConfigPath));
  const secondConfigParser = getParser(path.extname(secondConfigPath));

  const firstConfig = firstConfigParser(firstConfigData);
  const secondConfig = secondConfigParser(secondConfigData);

  const ast = makeAst(firstConfig, secondConfig);
  return render(ast, 0);
};
