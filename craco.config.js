const { whenProd } = require('@craco/craco');

module.exports = {
  babel: {
    plugins: [...whenProd(() => ['babel-plugin-jsx-remove-data-test-id'], [])],
  },
};
