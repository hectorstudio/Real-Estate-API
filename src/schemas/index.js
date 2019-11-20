export default function Schema(obj) {
  this.toDb = (value) =>
    Object.entries(obj).reduce((acc, key) => {
      if (value[key[0]]) {
        return {
          ...acc,
          [key[1]]: value[key[0]],
        };
      }
      return acc;
    }, {});

  this.fromDb = (value) =>
    Object.entries(obj).reduce((acc, key) => ({
      ...acc,
      [key[0]]: value[key[1]],
    }), {});
};
