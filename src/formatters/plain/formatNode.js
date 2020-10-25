import _ from 'lodash';

const valueRenders = [
  {
    check: _.isNumber,
    render: _.identity,
  },
  {
    check: _.isString,
    render: (value) => `'${value}'`,
  },
  {
    check: _.isObject,
    render: () => '[complex value]',
  },
  {
    check: _.isBoolean,
    render: _.identity,
  },
];

const renderValue = (value) => {
  const { render } = valueRenders.find(({ check }) => check(value));
  return render(value);
};
const nodeRenders = {
  added: ({ key, valueAfter }, path) => `Property '${[...path, key].join('.')}' was added with value: ${renderValue(valueAfter)}`,
  removed: ({ key }, path) => `Property '${[...path, key].join('.')}' was removed`,
  nested: ({ key, children }, path, render) => render(children, [...path, key]),
  updated: ({ key, valueBefore, valueAfter }, path) => [
    `Property '${[...path, key].join('.')}' was updated.`,
    `From ${renderValue(valueBefore)} to ${renderValue(valueAfter)}`,
  ].join(' '),
};

const filterUnchanged = (node) => {
  const { type, children } = node;

  if (type === 'unchanged') {
    return false;
  }

  if (type === 'nested') {
    return children.filter(filterUnchanged).length > 0;
  }

  return true;
};

const renderAst = (ast, path) => ast
  .filter(filterUnchanged)
  .map((node) => _.get(nodeRenders, _.get(node, 'type'))(node, path, renderAst))
  .join('\n');

const render = (ast) => renderAst(ast, []);

export default render;
