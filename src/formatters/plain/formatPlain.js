import getFormatter from './plainFormatters';

const format = (ast, keyOnly) => getFormatter(keyOnly)(ast);

export default format;
