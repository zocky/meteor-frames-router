Package.describe({
  name: 'zocky:frames-router',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Routed subpages for your app',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.3.2');

  api.export('FramesRouter');

  api.use('underscore','client');
  api.use('meteor','client');
  api.use('templating','client');
  api.use('zocky:frames-context','client');

  api.addFiles('utils.js','client');
  api.addFiles('frames-route.js','client');
  api.addFiles('frames-router.js','client');
  
  api.addFiles('frames.html','client');
  api.addFiles('frames.html.js','client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('zocky:frames-context');
  api.addFiles('frames-context-tests.js');
});
