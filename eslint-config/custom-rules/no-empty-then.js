export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow empty .then() callbacks',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      emptyThen: 'Empty .then() callbacks are not allowed. Use catch(console.error) instead.',
    },
  },
  create(context) {
    return {
      CallExpression(node) {
        // Check if the function being called is `.then`
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.property.name === 'then'
        ) {
          const args = node.arguments;
          const hasNoArguments = args.length < 1;
          const isArgumentEmptyFunction = args.length > 0 &&
            args[0].type === 'ArrowFunctionExpression' &&
            args[0].body.type === 'BlockStatement' &&
            args[0].body.body.length === 0;

          if (hasNoArguments || isArgumentEmptyFunction) {
            context.report({
              node: node.callee.property,
              message: 'Do not use empty then blocks, either use it optimistically or catch and print errors.',
              fix(fixer) {
                const sourceCode = context.getSourceCode();
                const promiseCode = sourceCode.getText(node.callee.object);
                return fixer.replaceText(node, `${promiseCode}.catch(console.error)`);
              },
            });
          }
        }
      },
    };
  },
};
