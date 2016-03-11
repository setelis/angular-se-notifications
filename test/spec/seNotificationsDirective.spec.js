describe("seNotifications", function() {
	"use strict";

	var element, scope, isolatedScope, $compile, SeNotificationsService;

	beforeEach(module("seNotifications.directive", function($provide) {
		SeNotificationsService = {
			markAsRead: "some",
			notifications: "other"
		};
		$provide.value("SeNotificationsService", SeNotificationsService);
	}));

	beforeEach(inject(function($templateCache) {
		$templateCache.put("seNotificationsDirective.html", "<div></div>");
	}));

	beforeEach(inject(function($rootScope, _$compile_) {
		scope = $rootScope.$new();
		$compile = _$compile_;

	}));

	it("should init state", inject(function() {
		element = angular.element("<div data-se-notifications></div>");
		element = $compile(element)(scope);
		scope.$digest();
		isolatedScope = element.isolateScope();
		expect(isolatedScope.markAsRead).toBe("some");
		expect(isolatedScope.notifications).toBe("other");
	}));

});
