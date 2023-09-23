export const toCamelCase = (str: string) => {
  return str.replace(/([-_][a-z])/g, (group) => {
    return group.toUpperCase().replace('-', '').replace('_', '');
  })
}

export const isObject = (obj: any) => {
  return obj === Object(obj) && !Array.isArray(obj) && typeof obj !== 'string';
}

export const keysToCamelCase = (obj: any) => {
  if (isObject(obj)) {
    const n = {};
    Object.keys(obj).forEach((k) => {
      n[toCamelCase(k)] = keysToCamelCase(obj[k]);
    })
    return n;
  } else if (Array.isArray(obj)) {
    return obj.map((o) => keysToCamelCase(o));
  }
  return obj;
}