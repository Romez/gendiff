import plain from './plain';
import base from './base';

const formatters = { base, plain };

export default (format) => formatters[format];
