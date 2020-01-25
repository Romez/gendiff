import _ from 'lodash';

const makeAddedKey = (value, key) => ({
  type: 'added',
  key,
  children: _.isObject(value) ? _.map(value, makeAddedKey) : [],
});

const makeRemovedKey = (value, key) => ({
  type: 'removed',
  key,
  children: _.isObject(value) ? _.map(value, makeRemovedKey) : [],
});

const makeNestedKey = (children, key) => ({
  type: 'nested',
  key,
  children,
});

const makeUnchangedKey = (key) => ({
  type: 'unchanged',
  key,
});

const makeUpdatedKey = (makeKey, value, key) => ({
  type: 'updated',
  key,
  children: _.map(value, makeKey),
});

const keyBuilders = [
  {
    check: (key, firstConfig, secondConfig) => !_.has(firstConfig, key) && _.has(secondConfig, key),
    build: (key, __, valueAfter) => makeAddedKey(valueAfter, key),
  },
  {
    check: (key, firstConfig, secondConfig) => _.has(firstConfig, key) && !_.has(secondConfig, key),
    build: (key, valueBefore) => makeRemovedKey(valueBefore, key),
  },
  {
    check: (key, firstConfig, secondConfig) => {
      const valueBefore = _.get(firstConfig, key);
      const valueAfter = _.get(secondConfig, key);

      return _.isObject(valueBefore) && _.isObject(valueAfter);
    },
    build: (key, valueBefore, valueAfter, makeAst) => {
      const children = makeAst(valueBefore, valueAfter);
      return makeNestedKey(children, key);
    },
  },
  {
    check: (key, firstConfig, secondConfig) => {
      const valueBefore = _.get(firstConfig, key);
      const valueAfter = _.get(secondConfig, key);

      return !_.isObject(valueBefore) && !_.isObject(valueAfter);
    },
    build: (key) => makeUnchangedKey(key),
  },
  {
    check: () => true,
    build: (key, valueBefore, valueAfter) => {
      const makeKey = _.isObject(valueBefore) ? makeRemovedKey : makeAddedKey;
      const value = _.isObject(valueBefore) ? valueBefore : valueAfter;
      return makeUpdatedKey(makeKey, value, key);
    },
  },
];

const getKeyBuilder = (key, firstConfig, secondConfig) => keyBuilders
  .find(({ check }) => check(key, firstConfig, secondConfig));

const makeKeyAst = (firstConfig, secondConfig) => {
  const allKeys = _.union(_.keys(firstConfig), _.keys(secondConfig));

  return allKeys.map((key) => {
    const { build } = getKeyBuilder(key, firstConfig, secondConfig);
    return build(key, _.get(firstConfig, key), _.get(secondConfig, key), makeKeyAst);
  });
};

export default makeKeyAst;
