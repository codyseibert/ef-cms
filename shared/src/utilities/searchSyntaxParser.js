/* eslint-disable sort-keys-fix/sort-keys-fix */
const moo = require('moo');
// https://github.com/no-context/moo

exports.OPERATOR_MAP = {
  AND: '+',
  NOT: '-',
  OR: '|',
};

const caseInsensitiveKeywords = map => {
  const transform = moo.keywords(map);
  return text => transform(text.toUpperCase());
};

// order of keys in the below rules are important.
const USTC_LEXER_RULES = {
  whitespace: { lineBreaks: false, match: /[ \t]+/ },
  lparen: '(',
  rparen: ')',
  andOp: '+',
  notOp: '-',
  orOp: '|',
  term: {
    match: /[a-zA-Z]+/,
    type: caseInsensitiveKeywords({
      keyword: ['AND', 'NOT', 'OR'],
    }),
  },
  phrase: /"(?:\\["\\]|[^\n"\\])*"/,
  other: /[^-+|\s"()]+/,
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

const tokenTransform = token => {
  if (token.type === 'keyword') {
    return exports.OPERATOR_MAP[token.value.toUpperCase()];
  }
  return token.value;
};

exports.translate = expression => {
  const parsedTokens = exports.parse(expression);
  const result = parsedTokens.map(tokenTransform).join('');
  return result;
};
