import _ from 'lodash';

const keyBuilders = [
  {
    check: (key, firstConfig, secondConfig) => !_.has(firstConfig, key) && _.has(secondConfig, key),
    build: (key, valueBefore, valueAfter) => ({
      type: 'added',
      key,
      valueBefore,
      valueAfter,
    }),
  },
  {
    check: (key, firstConfig, secondConfig) => _.has(firstConfig, key) && !_.has(secondConfig, key),
    build: (key, valueBefore, valueAfter) => ({
      type: 'removed',
      key,
      valueBefore,
      valueAfter,
    }),
  },
  {
    check: (key, firstConfig, secondConfig) => {
      const secondValue = secondConfig[key];
      return _.isObject(firstConfig[key]) && _.isObject(secondValue);
    },
    build: (key, valueBefore, valueAfter, makeAst) => ({
      type: 'nested',
      key,
      children: makeAst(valueBefore, valueAfter),
    }),
  },
  {
    check: (key, firstConfig, secondConfig) => {
      const secondValue = secondConfig[key];
      return !_.isObject(firstConfig[key]) && !_.isObject(secondValue);
    },
    build: (key, valueBefore, valueAfter) => ({
      type: 'unchanged',
      key,
      valueBefore,
      valueAfter,
    }),
  },
  {
    check: () => true,
    build: (key, valueBefore, valueAfter) => ({
      type: 'updated',
      key,
      valueBefore,
      valueAfter,
    }),
  },
];

const getKeyBuilder = (key, firstConfig, secondConfig) => keyBuilders
  .find(({ check }) => check(key, firstConfig, secondConfig));

const makeKeyAst = (firstConfig, secondConfig) => {
  const allKeys = _.union(_.keys(firstConfig), _.keys(secondConfig));

  return allKeys.map((key) => {
    const { build } = getKeyBuilder(key, firstConfig, secondConfig);
    return build(key, firstConfig[key], secondConfig[key], makeKeyAst);
  });
};

export default makeKeyAst;
