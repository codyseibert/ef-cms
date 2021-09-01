const { parse, translate } = require('./searchSyntaxParser');

describe('parse and translate', () => {
  describe('search parser', () => {
    describe('natural language operators are identified', () => {
      describe('OR', () => {
        it('recognizes the OR operator', () => {
          let results = parse('OR');
          expect(results.length).toBe(1);
          expect(results[0]).toMatchObject({ type: 'keyword', value: 'OR' });
        });
        it('recognizes the OR operator when mixed case', () => {
          let results = parse('Or');
          expect(results.length).toBe(1);
          expect(results[0]).toMatchObject({ type: 'keyword', value: 'Or' });
        });
        it('does not confuse prefixes with operators', () => {
          let results = parse('ORDER');
          expect(results.length).toBe(1);
          expect(results[0]).toMatchObject({ type: 'term', value: 'ORDER' });
        });
        it('identifies both upper and lower case OR operator', () => {
          let results = parse('Core or that OR ORDER');
          expect(results.length).toBe(9);
          expect(results).toEqual([
            expect.objectContaining({ type: 'term', value: 'Core' }),
            expect.objectContaining({ type: 'whitespace', value: ' ' }),
            expect.objectContaining({ type: 'keyword', value: 'or' }),
            expect.objectContaining({ type: 'whitespace', value: ' ' }),
            expect.objectContaining({ type: 'term', value: 'that' }),
            expect.objectContaining({ type: 'whitespace', value: ' ' }),
            expect.objectContaining({ type: 'keyword', value: 'OR' }),
            expect.objectContaining({ type: 'whitespace', value: ' ' }),
            expect.objectContaining({ type: 'term', value: 'ORDER' }),
          ]);
        });
      });

      describe('AND', () => {
        it('recognizes the OR operator', () => {
          let results = parse('AND');
          expect(results.length).toBe(1);
          expect(results[0]).toMatchObject({ type: 'keyword', value: 'AND' });
        });

        it('recognizes the AND operator when mixed case', () => {
          let results = parse('aNd');
          expect(results.length).toBe(1);
          expect(results[0]).toMatchObject({ type: 'keyword', value: 'aNd' });
        });

        it('does not confuse prefixes with operators', () => {
          let results = parse('Anderson');
          expect(results.length).toBe(1);
          expect(results[0]).toMatchObject({ type: 'term', value: 'Anderson' });
        });

        it('identifies both upper and lower case AND operator', () => {
          let results = parse('Anderson and "candy apple"');
          expect(results.length).toBe(5);
          expect(results).toEqual([
            expect.objectContaining({ type: 'term', value: 'Anderson' }),
            expect.objectContaining({ type: 'whitespace', value: ' ' }),
            expect.objectContaining({ type: 'keyword', value: 'and' }),
            expect.objectContaining({ type: 'whitespace', value: ' ' }),
            expect.objectContaining({ type: 'phrase', value: '"candy apple"' }),
          ]);
        });
      });

      describe('NOT', () => {
        it('recognizes the OR operator', () => {
          let results = parse('NOT');
          expect(results.length).toBe(1);
          expect(results[0]).toMatchObject({ type: 'keyword', value: 'NOT' });
        });

        it('recognizes the NOT operator when mixed case', () => {
          let results = parse('noT');
          expect(results.length).toBe(1);
          expect(results[0]).toMatchObject({ type: 'keyword', value: 'noT' });
        });

        it('does not confuse prefixes with operators', () => {
          let results = parse('NOTCH');
          expect(results.length).toBe(1);
          expect(results[0]).toMatchObject({ type: 'term', value: 'NOTCH' });
        });

        it('identifies both upper and lower case NOT operator', () => {
          let results = parse('Note not "not an operator"');
          expect(results.length).toBe(5);
          expect(results).toEqual([
            expect.objectContaining({ type: 'term', value: 'Note' }),
            expect.objectContaining({ type: 'whitespace', value: ' ' }),
            expect.objectContaining({ type: 'keyword', value: 'not' }),
            expect.objectContaining({ type: 'whitespace', value: ' ' }),
            expect.objectContaining({
              type: 'phrase',
              value: '"not an operator"',
            }),
          ]);
        });
      });
    });
  });

  describe('translate', () => {
    const tests = [
      { input: 'this or that', output: 'this | that' },
      { input: 'this and that', output: 'this + that' },
      { input: 'this not that', output: 'this - that' },
      {
        input: '+this | not(that and those)',
        output: '+this | -(that + those)',
      },
      {
        input: '"coca-cola" and (ice or cubes)',
        output: '"coca-cola" + (ice | cubes)',
      },
      // { input: 'this or that', output: 'this | that' },
      // { input: 'this or that', output: 'this | that' },
    ];
    tests.forEach(({ input, output }) => {
      it('correctly transforms input to output', () => {
        const result = translate(input);
        expect(result).toEqual(output);
      });
    });
  });
});
