import formatNode from './formatNode';
import formatKey from './formatKey';

const getFormatter = (keyOnly) => (keyOnly ? formatKey : formatNode);

export default getFormatter;
