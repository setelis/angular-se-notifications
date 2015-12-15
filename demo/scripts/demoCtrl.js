angular.module("seNotificationsDemoApp", ["seNotifications", "ngAnimate"]).controller("DemoCtrl", function (SeNotificationsService) {
	"use strict";
	var controller = this;

	function initState() {
	}
	function atachMethods() {
		controller.showInfo = function() {
			SeNotificationsService.showNotificationInfo("message.hello", {name: "world"});
		};
	}

	initState();
	atachMethods();
}).config(function(RestangularProvider) {
	"use strict";
	// Set default server URL for 'logs/' endpoint
	RestangularProvider.setBaseUrl("http://private-5150df-senotifications.apiary-mock.com");
}).config(function($translateProvider) {
	"use strict";
	$translateProvider.preferredLanguage("en");
	$translateProvider.useSanitizeValueStrategy("escape");

	$translateProvider.translations("en", {
		"message.hello": "Hello, {{name}}"
	});
});
