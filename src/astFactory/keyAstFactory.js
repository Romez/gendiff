import _ from 'lodash';

export const filterAst = (check, nodes) => nodes
  .filter(check)
  .map((node) => _.set(node, 'children', filterAst(check, _.get(node, 'children'))));

const makeAddedNode = (value, key) => ({
  type: 'added',
  key,
  children: _.isObject(value) ? _.map(value, makeAddedNode) : [],
});

const makeRemovedNode = (value, key) => ({
  type: 'removed',
  key,
  children: _.isObject(value) ? _.map(value, makeRemovedNode) : [],
});

const makeNestedNode = (children, key) => ({
  type: 'nested',
  key,
  children,
});

const makeUnchangedNode = (key) => ({
  type: 'unchanged',
  key,
  children: [],
});

const makeUpdatedNode = (children, key) => ({
  type: 'updated',
  key,
  children,
});

const keyBuilders = [
  {
    check: (key, firstConfig, secondConfig) => !_.has(firstConfig, key) && _.has(secondConfig, key),
    build: (key, __, valueAfter) => makeAddedNode(valueAfter, key),
  },
  {
    check: (key, firstConfig, secondConfig) => _.has(firstConfig, key) && !_.has(secondConfig, key),
    build: (key, valueBefore) => makeRemovedNode(valueBefore, key),
  },
  {
    check: (key, firstConfig, secondConfig) => {
      const valueBefore = _.get(firstConfig, key);
      const valueAfter = _.get(secondConfig, key);

      return _.isObject(valueBefore) && _.isObject(valueAfter);
    },
    build: (key, valueBefore, valueAfter, makeAst) => {
      const children = makeAst(valueBefore, valueAfter);
      return makeNestedNode(children, key);
    },
  },
  {
    check: (key, firstConfig, secondConfig) => {
      const valueBefore = _.get(firstConfig, key);
      const valueAfter = _.get(secondConfig, key);

      return !_.isObject(valueBefore) && !_.isObject(valueAfter);
    },
    build: (key) => makeUnchangedNode(key),
  },
  {
    check: () => true,
    build: (key, valueBefore, valueAfter) => {
      const makeChild = _.isObject(valueBefore) ? makeRemovedNode : makeAddedNode;
      const value = _.isObject(valueBefore) ? valueBefore : valueAfter;
      return makeUpdatedNode(_.map(value, makeChild), key);
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
