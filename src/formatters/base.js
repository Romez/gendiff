import _ from 'lodash';

const padding = '    ';

const renderValue = (value, deep) => {
  if (!_.isObject(value)) {
    return value;
  }

  const currentDeepPadding = padding.repeat(deep);

  const result = Object.keys(value)
    .map((key) => `${currentDeepPadding}    ${key}: ${renderValue(value[key], deep + 1)}`)
    .join('\n');

  return ['{', result, `${currentDeepPadding}}`].join('\n');
};

const renders = {
  added: ({ key, valueAfter }, deep) => `${padding.repeat(deep)}  + ${key}: ${renderValue(valueAfter, deep + 1)}`,
  removed: ({ key, valueBefore }, deep) => `${padding.repeat(deep)}  - ${key}: ${renderValue(valueBefore, deep + 1)}`,
  nested: ({ key, children }, deep, render) => `${padding.repeat(deep)}    ${key}: ${render(children, deep + 1, render)}`,
  unchanged: ({ key, valueBefore }, deep) => `${padding.repeat(deep)}    ${key}: ${renderValue(valueBefore, deep)}`,
  updated: (node, deep) => [renders.removed(node, deep), renders.added(node, deep)],
};

const render = (data, deep = 0) => {
  const result = _.flatMap(data, (node) => {
    const nodeRender = renders[node.type];
    return nodeRender(node, deep, render);
  });

  return ['{', ...result, `${padding.repeat(deep)}}`].join('\n');
};

export default render;
