import formatNode from './formatNode';
import formatKey from './formatKey';

const getFormatter = (keyOnly) => (keyOnly ? formatKey : formatNode);

const format = (ast, keyOnly) => getFormatter(keyOnly)(ast);

export default format;
