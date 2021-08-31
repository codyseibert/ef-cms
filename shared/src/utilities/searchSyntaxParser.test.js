const { parse, OPERATOR_MAP } = require('./searchSyntaxParser');

describe('parse and compile', () => {
  describe('search parser', () => {
    describe('natural language operators are identified', () => {
      describe('OR', () => {
        it('recognizes the OR operator', () => {
          let results = parse('OR');
          console.log(JSON.stringify(results, null, 2));
          expect(results).toMatchObject(
            expect.arrayContaining([
              expect.objectContaining({ type: 'keyword', value: 'OR'}),
            ]),
          );
        });        
        it('does not confuse prefixes with operators', () => {
          let results = parse('ORDER');
          console.log(JSON.stringify(results, null, 2));
          expect(results).toMatchObject(
            expect.arrayContaining([
              expect.objectContaining({ type: 'term' }),
            ]),
          );
        });
        it.only('identifies both upper and lower case OR operator', () => {
          let results = parse('Core or that OR ORDER');
          console.log("Looks like", results[2].value);
          expect(results).toMatchObject(
            expect.arrayContaining([
              expect.objectContaining({ type: 'term' }),
              expect.objectContaining({ type: 'whitespace' }),
              expect.objectContaining({ type: 'keyword',  value: 'OR'}),
              expect.objectContaining({ type: 'whitespace' }),
              expect.objectContaining({ type: 'keyword',  value: 'OR' }),
              expect.objectContaining({ type: 'whitespace' }),
              expect.objectContaining({ type: 'term' }),
            ]),
          );
        });
      });
    });
  });

  // describe('compile', () => {
  //   it('compiles expressions', () => {
  //     const tokens = [{type: 'string'}, {type: 'operator', text: }]
  //   });
  // });
});
