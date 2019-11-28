export default function Schema(obj) {
  this.toDb = (value) => Object.entries(obj).reduce((acc, key) => {
    if (value[key[0]]) {
      return {
        ...acc,
        [key[1]]: value[key[0]],
      };
    }
    return acc;
  }, {});

  this.toJs = (value) => Object.entries(obj).reduce((acc, key) => {
    if (value[key[1]]) {
      return {
        ...acc,
        [key[0]]: value[key[1]],
      };
    }
    return acc;
  }, {});
}
