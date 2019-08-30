import yaml from 'js-yaml';

const parsers = {
  '.json': JSON.parse,
  '.yml': yaml.safeLoad,
};

export default (ext) => parsers[ext];
