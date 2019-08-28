#!/usr/bin/env node

import program from 'commander';
import { version } from '../../package.json';
import genDiff from '..';

const typeSigns = {
  matched: ' ',
  added: '+',
  deleted: '-',
};

program
  .description('Compares two configuration files and shows a difference.')
  .version(version)
  .arguments('<firstConfig> <secondConfig>')
  .action((firstConfig, secondConfig) => {
    const diff = genDiff(firstConfig, secondConfig);

    console.log('{');
    diff.forEach(({ type, key, value }) => {
      console.log(`${typeSigns[type]} ${key}: ${value}`);
    });
    console.log('}');
  })
  .option('-f, --format [type]', 'Output format')
  .parse(process.argv);
