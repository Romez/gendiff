import makeNodeAst from './nodeAstFactory';
import makeKeyAst from './keyAstFactory';

const getAstFactory = (keyOnly) => {
  if (keyOnly) {
    return makeKeyAst;
  }

  return makeNodeAst;
};

export default getAstFactory;
