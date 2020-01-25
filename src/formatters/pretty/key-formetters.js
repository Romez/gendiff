import _ from 'lodash';

const padding = '    ';

const keyFormatValue = (value, deep, sign = ' ') => {
  if (!_.isObject(value)) {
    return '';
  }

  const currentDeepPadding = padding.repeat(deep);

  const result = Object.keys(value)
    .map((key) => `${currentDeepPadding}  ${sign} ${key}${keyFormatValue(value[key], deep + 1)}`)
    .join('\n');

  return [': {', result, `${currentDeepPadding}}`].join('\n');
};

const keyFormatters = {
  added: ({ key, valueAfter }, deep) => `+ ${key}${keyFormatValue(valueAfter, deep)}`,
  removed: ({ key, valueBefore }, deep) => `- ${key}${keyFormatValue(valueBefore, deep)}`,
  nested: ({ key, children }, deep, render) => `  ${key}: ${render(children, deep, render)}`,
  unchanged: ({ key, valueBefore }, deep) => `  ${key}${keyFormatValue(valueBefore, deep)}`,
  updated: ({ key, valueBefore, valueAfter }, deep) => {
    if (_.isObject(valueBefore)) {
      return `  ${key}${keyFormatValue(valueBefore, deep, '-')}`;
    }
    return `  ${key}${keyFormatValue(valueAfter, deep, '+')}`;
  },
};

export default keyFormatters;
