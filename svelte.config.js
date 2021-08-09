const sveltePreprocess = require('svelte-preprocess')

module.exports = {
  preprocess: sveltePreprocess(),
  compilerOptions: { namespace: 'foreign' }
}
