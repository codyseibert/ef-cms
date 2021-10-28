export const memo = (fn, opts) => {
  const cache = opts.cache || {};
  const timeouts = opts.timeouts || {};
  const wrappedFn = function (...args) {
    const key = opts.getKey(args);
    if (!cache[key]) {
      cache[key] = fn.apply(null, args);
      console.log(cache[key]);
      const timeout = setTimeout(() => {
        delete cache[key];
        delete timeouts[key];
      }, opts.maxAge ?? 5000);
      timeouts[key] = timeout;
    }
    return cache[key];
  };
  wrappedFn.clear = () => {
    for (const key of Object.keys(timeouts)) {
      clearTimeout(timeouts[key]);
      delete timeouts[key];
      delete cache[key];
    }
  };
  return wrappedFn;
};
