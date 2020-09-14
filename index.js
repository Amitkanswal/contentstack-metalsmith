const Metalsmith = require('metalsmith');
const layouts = require('metalsmith-layouts');
const markdown = require('metalsmith-markdown');
const contentstack = require('contentstack-metalsmith');
const entry_hooks = require('./hooks/entry-hooks');
const post_hooks = require('./hooks/post-hooks');
const permalinks = require('metalsmith-permalinks');
// const serve = require('metalsmith-serve');

Metalsmith(__dirname)
  .source('src')
  .destination('build')
  .clean(true)
  .use(contentstack({
    api_key: 'blta9e76a1f2ce5900a',
    access_token: 'bltc18b279cfd06e57f',
    environment: process.env.NODE_ENV || 'development',
    partials: ['header', 'footer'],
    entryHooks: {
      remove: function (entries, file, options) {
        return entry_hooks.remove(entries, file, options);
      }
    },
    postHooks: {
      fetchProducts: function (currFile, files, options) {
        return post_hooks.fetchProducts(currFile, files, options);
      }
    }
  }))
  .use(markdown())
  .use(layouts({
    engine: 'handlebars',
    partials: 'partials'
  }))
  .use(permalinks())
  // .use(serve({
  //   port: process.env.PORT,
  //   verbose: true,
  //   http_error_files: {
  //     404: "/404.html"
  //   },
  //   redirects: {
  //     '/old_url.php'        : '/new_url/',
  //     '/old_url.php?lang=en': '/en/new_url/'
  //   }
  // }))
  .build(function (err) {
    console.log(err);
    if (err) throw err
    console.log('Static site built successfully');
  })