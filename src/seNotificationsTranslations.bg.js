angular.module("seNotifications.translations.bg", ["pascalprecht.translate"]).config(function($translateProvider) {
	"use strict";
	$translateProvider.translations("bg", {
		"seNotifications.translations.internalError.log.error": "Вътрешна грешка, моля презаредете страницата.",
		"seNotifications.translations.internalError.exceptionHandler": "Възникна проблем, моля презаредете страницата."
	});
});
