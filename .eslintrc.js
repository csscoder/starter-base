module.exports = {
  'parserOptions': {
    'ecmaVersion': 6,
    'sourceType': "module"
  },
  'env': {
    'browser': 1,
    'node': 1,
    'es6': 1
  },
  'globals': {
    '$': 1
  },
  'extends': ['eslint:recommended'],
  'rules': {
    "indent": ["error", 2],
    'semi': ['error', 'always'],
    'quotes': ['error', 'single'],
    'comma-dangle': ['error', 'never'],
    'no-cond-assign': ['error', 'always'],
    'no-constant-condition': ['error', {
      'checkLoops': false,
    }],
    'no-console': 'off'
  }
};
