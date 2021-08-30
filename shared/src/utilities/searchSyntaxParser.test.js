const { parse } = require('./searchSyntaxParser');

describe('parse and compile', () => {
  describe('search parser', () => {
    describe('natural language operators are identified', () => {
      describe('OR', () => {
        it('identifies both upper and lower case OR operator', () => {
          let results = parse('Core or that OR ORDER');
          console.log(JSON.stringify(results, null, 2));
          expect(results).toMatchObject(
            expect.arrayContaining([
              expect.objectContaining({ type: 'string' }),
              expect.objectContaining({ type: 'whitespace' }),
              expect.objectContaining({ type: 'keyword', value: 'or' }),
              expect.objectContaining({ type: 'whitespace' }),
              expect.objectContaining({ type: 'keyword', value: 'OR' }),
              expect.objectContaining({ type: 'whitespace' }),
              expect.objectContaining({ type: 'string' }),
            ]),
          );
        });
      });
    });
  });

  // describe('compile', () => {
  //   it('compiles expressions', () => {
  //     const tokens = [{type: 'string'}, {type: 'keyword', text: }]
  //   });
  // });
});
