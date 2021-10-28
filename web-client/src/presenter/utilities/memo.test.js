const { memo } = require('./memo');

describe('memo', () => {
  it('should clear the cache after the maxAge has passed', async () => {
    const mockCache = {};
    const mockTimeouts = {};
    const add = (a, b) => new Promise(resolve => resolve(a + b));
    const mAdd = memo(add, {
      cache: mockCache,
      getKey: args => args.join('|'),
      maxAge: 1,
      timeouts: mockTimeouts,
    });
    await mAdd(1, 2);
    expect(mockCache['1|2']).toBeDefined();
    expect(mockTimeouts['1|2']).toBeDefined();
    await new Promise(resolve => setTimeout(resolve, 2));
    expect(mockCache['1|2']).not.toBeDefined();
    expect(mockTimeouts['1|2']).not.toBeDefined();
  });

  it('should return the same value in cache if called twice before maxAge', async () => {
    const mockCache = {};
    const mockTimeouts = {};
    const add = (a, b) => new Promise(resolve => resolve(a + b));
    const mAdd = memo(add, {
      cache: mockCache,
      getKey: args => args.join('|'),
      maxAge: 1,
      timeouts: mockTimeouts,
    });
    const res1 = mAdd(1, 2);
    const res2 = mAdd(1, 2);
    expect(res1).toEqual(res2);
  });

  it('should cache different arguments as separate cache keys', async () => {
    const mockCache = {};
    const mockTimeouts = {};
    const add = (a, b) => new Promise(resolve => resolve(a + b));
    const mAdd = memo(add, {
      cache: mockCache,
      getKey: args => args.join('|'),
      maxAge: 1,
      timeouts: mockTimeouts,
    });
    const res1 = mAdd(1, 2);
    const res2 = mAdd(2, 1);
    console.log(res1);
    console.log(res2);
    expect(res1 !== res2).toBeTruthy();
  });

  it('should clear the cache when calling clear', async () => {
    const mockCache = {};
    const mockTimeouts = {};
    const add = (a, b) => new Promise(resolve => resolve(a + b));
    const mAdd = memo(add, {
      cache: mockCache,
      getKey: args => args.join('|'),
      maxAge: 1,
      timeouts: mockTimeouts,
    });
    mAdd(1, 2);
    mAdd(2, 1);
    mAdd(3, 3);
    expect(Object.keys(mockCache).length).toEqual(3);
    mAdd.clear();
    expect(Object.keys(mockCache).length).toEqual(0);
    expect(Object.keys(mockTimeouts).length).toEqual(0);
  });
});
