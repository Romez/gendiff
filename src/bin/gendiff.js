#!/usr/bin/env node

import program from 'commander';
import { version } from '../../package.json';
import genDiff from '..';

program
  .description('Compares two configuration files and shows a difference.')
  .version(version)
  .arguments('<firstConfig> <secondConfig>')
  .option('-f, --format [type]', 'Output format', 'pretty')
  .action((firstConfig, secondConfig, options) => {
    console.log(genDiff(firstConfig, secondConfig, options.format));
  })
  .parse(process.argv);
