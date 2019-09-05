import defaultFormatter from './default';

const formaters = {
  default: defaultFormatter,
};

export default (format) => formaters[format];
