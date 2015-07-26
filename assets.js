module.exports = {
		// 'bower/firepad/dist/firepad.css',

	styles:[
		'bower/angular-material/angular-material.min.css',
		'bower/font-awesome/css/font-awesome.min.css',
		'app.css',
		'components/nav/nav.css',
	],
	vendor: [
		'bower/angular/angular.js',
		'bower/angular-animate/angular-animate.js',
		'bower/angular-aria/angular-aria.min.js',
		'bower/ui-router/release/angular-ui-router.min.js',
		'bower/angular-material/angular-material.min.js',
		'bower/ngstorage/ngStorage.min.js',
		'bower/underscore/underscore-min.js',
		'bower/firebase/firebase.js',
		'bower/angularfire/dist/angularfire.js',
	],
	app: [
		'app.js',
		'app-routes.js',
		'app-theme.js',
		'app-const.js',
		'app.controller.js',

		'components/firebase.utils/firebase.utils.js',

		'components/nav/nav.module.js',
		'components/nav/nav.controller.js',

		'haiku/haiku.module.js',
		'haiku/haiku-list.controller.js',
		'haiku/haiku.service.js',


	]
};
