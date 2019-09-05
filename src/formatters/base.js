import _ from 'lodash';

const padding = '    ';

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
  removed: ({ key, valueBefore }, deep) => {
    const value = _.isObject(valueBefore) ? renderObject(valueBefore, deep + 1) : valueBefore;
    return `${padding.repeat(deep)}  - ${key}: ${value}`;
  },
  nested: ({ key, children }, deep, render) => `${padding.repeat(deep)}    ${key}: ${render(children, deep + 1, render)}`,
  unchanged: ({ key, valueBefore }, deep) => {
    const value = _.isObject(valueBefore) ? renderObject(valueBefore, deep + 1) : valueBefore;
    return `${padding.repeat(deep)}    ${key}: ${value}`;
  },
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
