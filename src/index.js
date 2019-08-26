import { has, flatten } from 'lodash';


export default (firstConfig, secondConfig) => {
  const allKeys = [...Object.keys(firstConfig), ...Object.keys(secondConfig)];

  const isMatched = (key) => (has(firstConfig, key) && has(secondConfig, key));
  const isAdded = (key) => (!has(firstConfig, key) && has(secondConfig, key));
  const isDeleted = (key) => (has(firstConfig, key) && !has(secondConfig, key));

  const iter = (keys, result) => {
    const [key, ...restKeys] = keys;

    if (!key) {
      return result;
    }

    return iter(restKeys, result);
  };

  return iter(allKeys, []);
//   return allKeys.reduce((acc, key) => {
//     if (isAdded(key)) {
//       return acc.concat({ type: 'added', key, value: secondConfig[key] });
//     }

//     if (isDeleted(key)) {
//       return acc.concat({ type: 'deleted', key, value: firstConfig[key] });
//     }



//     return acc.concat({ type: 'deleted', key, value: firstConfig });
//   }, []);
};
