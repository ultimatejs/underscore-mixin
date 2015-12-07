Package.describe({
	name: "ultimatejs:underscore-mixin",
	summary: "Common underscore methods",
	version: '0.0.3',
	documentation: null,
	git: 'https://github.com/ultimatejs/underscore-mixin'
});

Package.onUse(function (api) {
	api.versionsFrom('METEOR@1.2.1');
	
	api.use('underscore');
	
	api.addFiles([
		'underscore-mixin.js',
	]);
});

