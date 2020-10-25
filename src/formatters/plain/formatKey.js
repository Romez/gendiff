import _ from 'lodash';

import { filterAst } from '../../astFactory/keyAstFactory';

const formatAdded = ({ children, key }, path) => {
  if (_.isEmpty(children)) {
    return `Key '${[...path, key].join('.')}' was added`;
  }

  return `Key '${[...path, key].join('.')}' was added with: [complex key]`;
};

const formatRemoved = ({ key }, path) => `Key '${[...path, key].join('.')}' was removed`;

const keyFormatters = {
  added: (node, path) => formatAdded(node, path),
  removed: (node, path) => formatRemoved(node, path),
  nested: ({ children, key }, path, formatAst) => formatAst(children, path.concat(key)),
  updated: ({ children, key }, path, formatAst) => formatAst(children, path.concat(key)),
};

const filterUnchanged = (node) => {
  const { type, children } = node;

  if (type === 'unchanged') {
    return false;
  }

  if (type === 'nested') {
    return filterAst(filterUnchanged, children).length > 0;
  }

  return true;
};

const formatAst = (ast, path) => filterAst(filterUnchanged, ast)
  .map((node) => _.get(keyFormatters, _.get(node, 'type'))(node, path, formatAst))
  .join('\n');

const format = (ast) => formatAst(ast, []);

export default format;
