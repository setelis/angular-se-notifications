angular.module("seNotificationsDemoApp", ["seNotifications"]).controller("DemoCtrl", function (SeNotificationsService) {
	"use strict";
	var controller = this;

	function initState() {
	}
	function atachMethods() {
		controller.throwError = function() {
			window.unknownMethod();
		};
		controller.showInfo = function() {
			SeNotificationsService.showNotificationInfo("hello", null);
		};
	}

	initState();
	atachMethods();
});
