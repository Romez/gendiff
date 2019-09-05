import _ from 'lodash';

const valueRenders = [
  {
    check: (value) => /^\d+$/.test(value),
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

const renders = {
  added: ({ key, valueAfter }, path) => `Property '${[...path, key].join('.')}' was added with value: ${renderValue(valueAfter)}`,
  removed: ({ key }, path) => `Property '${[...path, key].join('.')}' was removed`,
  nested: ({ key, children }, path, render) => render(children, [...path, key]),
  updated: ({ key, valueBefore, valueAfter }, path) => [
    `Property '${[...path, key].join('.')}' was updated.`,
    `From ${renderValue(valueBefore)} to ${renderValue(valueAfter)}`,
  ].join(' '),
};

const render = (data, path = []) => data
  .filter(({ type }) => type !== 'unchanged')
  .map((node) => {
    const nodeRender = renders[node.type];
    return nodeRender(node, path, render);
  })
  .join('\n');

export default render;
