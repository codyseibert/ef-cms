/* eslint-disable sort-keys-fix/sort-keys-fix */
const moo = require('moo');
// https://github.com/no-context/moo

// order of keys in the below rules are important.
const USTC_LEXER_RULES = {
  // NL: { lineBreaks: true, match: /\n/ },
  whitespace: { lineBreaks: false, match: /[ \t]+/ },
  lparen: '(',
  rparen: ')',
  andOp: '+',
  notOp: '-',
  orOp: '|',
  keyword: ['AND', 'OR', 'NOT', 'and', 'or', 'not'],
  phrase: /"(?:\\["\\]|[^\n"\\])*"/,
  string: /[^-+|\s"()]+/,
};

const lexer = moo.compile(USTC_LEXER_RULES);

exports.parse = expression => {
  lexer.reset(expression);
  const tokens = [];
  let token;
  while ((token = lexer.next())) {
    tokens.push(token);
  }
  return tokens;
};

// exports.tokenTransform = token => {
//   let result = token.text;
//   if(token.type === 'keyword') {
//     switch(token.)
//   }
// };

// exports.compile = parsedTokens => {
//   return parsedTokens.map(tokenTransform).join();
// };
