/**
 * @type {import('eslint').Linter.Config}
 */
const eslintConfig = {
    extends: [
        'next/core-web-vitals',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
    ],
    plugins: ['@typescript-eslint'],
    parser: '@typescript-eslint/parser',
    root: true,
};

module.exports = eslintConfig;
