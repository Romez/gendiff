import fs from 'fs';
import path from 'path';

import getParser from './parsers';
import getFormatter from './formatters';
import getAstFactory from './astFactory';

export default (firstConfigPath, secondConfigPath, { format, keyOnly }) => {
  const firstConfigData = fs.readFileSync(path.resolve(firstConfigPath), 'utf8');
  const firstConfigParse = getParser(path.extname(firstConfigPath).slice(1));
  const firstConfig = firstConfigParse(firstConfigData);

  const secondConfigData = fs.readFileSync(path.resolve(secondConfigPath), 'utf8');
  const secondConfigParse = getParser(path.extname(secondConfigPath).slice(1));
  const secondConfig = secondConfigParse(secondConfigData);

  const makeAst = getAstFactory(keyOnly);
  const ast = makeAst(firstConfig, secondConfig);

  const formatAst = getFormatter(format);
  return formatAst(ast, keyOnly);
};
