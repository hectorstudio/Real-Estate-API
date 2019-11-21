export const updateValues = (obj) => Object.entries(obj).map((value) => `${value[0]} = '${value[1]}'`).join(', ');
