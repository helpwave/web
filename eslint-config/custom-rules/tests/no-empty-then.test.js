import { RuleTester } from 'eslint';
import rule from '../no-empty-then.js'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
});

// Test cases for the rule
ruleTester.run('no-empty-then', rule, {
  valid: [
    {
      code: 'fetchData().then(response => console.log(response));',
    },
    {
      code: 'fetchData().catch(console.error);',
    },
    {
      code: 'fetchData().then(() => doSomething());',
    },
  ],
  invalid: [
    {
      code: 'fetchData().then(() => {});',
      errors: [{ message: 'Do not use empty then blocks, either use it optimistically or catch and print errors.' }],
      output: 'fetchData().catch(console.error);',
    },
    {
      code: 'fetchData()   .then(() => { });',
      errors: [{ message: 'Do not use empty then blocks, either use it optimistically or catch and print errors.' }],
      output: 'fetchData().catch(console.error);',
    },
    {
      code: `
        fetchData()
          .then(() => {

          });
      `,
      errors: [{ message: 'Do not use empty then blocks, either use it optimistically or catch and print errors.' }],
      output: `
        fetchData().catch(console.error);
      `,
    },
  ],
});

console.log('All tests passed!');
