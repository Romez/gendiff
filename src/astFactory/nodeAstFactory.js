import _ from 'lodash';

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

const makeNodeAst = (firstConfig, secondConfig) => {
  const allKeys = _.union(_.keys(firstConfig), _.keys(secondConfig));

  return allKeys.map((key) => {
    const { build } = getNodeBuilder(key, firstConfig, secondConfig);
    return build(key, firstConfig[key], secondConfig[key], makeNodeAst);
  });
};

export default makeNodeAst;
