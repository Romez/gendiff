import _ from 'lodash';

const padding = '    ';

const formatValue = (value, deep) => {
  if (!_.isObject(value)) {
    return value;
  }

  const currentDeepPadding = padding.repeat(deep);

  const result = Object.keys(value)
    .map((key) => `${currentDeepPadding}    ${key}: ${formatValue(value[key], deep + 1)}`)
    .join('\n');

  return ['{', result, `${currentDeepPadding}}`].join('\n');
};

const nodeFormatters = {
  added: ({ key, valueAfter }, deep) => `+ ${key}: ${formatValue(valueAfter, deep)}`,
  removed: ({ key, valueBefore }, deep) => `- ${key}: ${formatValue(valueBefore, deep)}`,
  nested: ({ key, children }, deep, render) => `  ${key}: ${render(children, deep, render)}`,
  unchanged: ({ key, valueBefore }, deep) => `  ${key}: ${formatValue(valueBefore, deep)}`,
  updated: (node, deep) => [nodeFormatters.removed(node, deep), nodeFormatters.added(node, deep)],
};

export default nodeFormatters;
