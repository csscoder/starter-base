module.exports = {
  "rules": {
    // color
    "color-hex-case": "lower",
    "color-no-invalid-hex": true,

    // Font family
    "font-family-name-quotes": "always-where-recommended",
    "font-family-no-duplicate-names": true,

    // Function
    "function-calc-no-unspaced-operator": true,

    // Number
    "number-max-precision": 4,
    "number-no-trailing-zeros": true,

    // String
    "string-no-newline": true,
    "string-quotes": "double",

    // Length
    "length-zero-no-unit": true,

    // Time
    "time-no-imperceptible": true,

    // Unit
    "unit-case": "lower",
    "unit-no-unknown": true,

    // Value
    "value-keyword-case": "lower",

    // Shorthand property
    "shorthand-property-no-redundant-values": true,

    // Declaration
    "declaration-bang-space-after": "never",
    "declaration-bang-space-before": "always",
    "declaration-colon-newline-after": "always-multi-line",

    // Declaration block
    "declaration-block-no-duplicate-properties": true,
    "declaration-block-no-ignored-properties": true,
    "declaration-block-no-redundant-longhand-properties": [true, {"ignoreShorthands": ["/transition/", "/font/"]}],

    "selector-no-empty": true,

    "no-duplicate-selectors": true,
    "max-empty-lines": 2,

    "no-empty-source": true,

    "no-eol-whitespace": true,

    "no-extra-semicolons": true,

    "no-missing-end-of-source-newline": true,

    "no-unknown-animations": true,

    "selector-no-id": true

  }
};
