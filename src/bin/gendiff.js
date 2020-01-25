#!/usr/bin/env node

import program from 'commander';
import { version } from '../../package.json';
import genDiff from '..';

program
  .description('Compares two configuration files and shows a difference.')
  .version(version)
  .arguments('<firstConfig> <secondConfig>')
  .option('-f, --format [type]', 'Output format [pretty, json, plain]', 'pretty')
  .option('-k, --key-only', 'Generate only keys diff', false)
  .action((firstConfig, secondConfig, options) => {
    console.log(genDiff(firstConfig, secondConfig, options));
  })
  .parse(process.argv);
