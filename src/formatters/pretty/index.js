import _ from 'lodash';

import keyFormatters from './key-formetters';
import nodeFormatters from './node-formatters';

const padding = '    ';

const format = (ast, keyOnly) => {
  const formatters = keyOnly ? keyFormatters : nodeFormatters;

  const formatAst = (nodes, deep = 0) => {
    const result = _.flatMap(nodes, (node) => {
      const formatNode = formatters[node.type];
      return formatNode(node, deep + 1, formatAst);
    }).map((renderedNode) => `${padding.repeat(deep)}  ${renderedNode}`);

    return ['{', ...result, `${padding.repeat(deep)}}`].join('\n');
  };

  return formatAst(ast);
};

export default format;
