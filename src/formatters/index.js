import plain from './plain';
import pretty from './pretty';
import json from './json';

const formatters = { pretty, plain, json };

export default (format) => formatters[format];
