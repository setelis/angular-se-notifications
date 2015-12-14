angular.module("seNotifications.translations.en", ["pascalprecht.translate"]).config(function($translateProvider) {
	"use strict";
	$translateProvider.translations("en", {
		"seNotifications.translations.internalError.log.error": "Error occured, please reload the page.",
		"seNotifications.translations.internalError.exceptionHandler": "Unknown error occured, please reload the page."
	});
});
