import _ from 'lodash';

const padding = '    ';

const formatAdded = ({ children, key }, deep) => {
  if (_.isEmpty(children)) {
    return `+ ${key}`;
  }
  const currentDeepPadding = padding.repeat(deep);

  const result = children.map((child) => `  ${currentDeepPadding}${formatAdded(child, deep + 1)}`);

  return [`+ ${key}: {`, result.join('\n'), `${currentDeepPadding}}`].join('\n');
};

const formatRemoved = ({ children, key }, deep) => {
  if (_.isEmpty(children)) {
    return `- ${key}`;
  }
  const currentDeepPadding = padding.repeat(deep);

  const result = children.map((child) => `  ${currentDeepPadding}${formatRemoved(child, deep + 1)}`);

  return [`- ${key}: {`, result.join('\n'), `${currentDeepPadding}}`].join('\n');
};

const formatNested = ({ children, key }, deep, render) => [`  ${key}: `, render(children, deep)].join('');

const formatUnchanged = ({ key }) => `  ${key}`;

const formatUpdated = ({ children, key }, deep, render) => [`  ${key}: `, render(children, deep)].join('');

const keyFormatters = {
  added: (node, deep) => formatAdded(node, deep),
  removed: (node, deep) => formatRemoved(node, deep),
  nested: (node, deep, render) => formatNested(node, deep, render),
  unchanged: (node) => formatUnchanged(node),
  updated: (node, deep, render) => formatUpdated(node, deep, render),
};

export default keyFormatters;
