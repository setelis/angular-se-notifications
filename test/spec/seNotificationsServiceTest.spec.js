describe("SeNotificationsService", function () {
	"use strict";

	var SeNotificationsService, $timeout, $httpBackend;
	function expectLog() {
		$httpBackend.when("POST", "/logs").respond(400, "error");
		$httpBackend.flush();
	}

	beforeEach(module("seNotifications.service", function($provide) {
		$provide.value("VersionsService", {
			getVersionInfo: function() {
				return {version: "_VERSION_", buildDate: "_BUILD_DATE_", buildDateAsString: "_BUILD_DATE_AS_STRING_", commit: "_COMMIT_"};
			}
		});
	}));
	beforeEach(inject(function (_SeNotificationsService_, _$timeout_) {
		SeNotificationsService = _SeNotificationsService_;
		$timeout = _$timeout_;
	}));

	beforeEach(inject(function (_$httpBackend_) {
		$httpBackend = _$httpBackend_;
	}));
	afterEach(function() {
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});
	describe("SeNotificationsService", function () {
		it("should init notifications", inject(function () {
			expect(SeNotificationsService.notifications.length).toBe(0);
		}));
		it("should not allow empty notification", inject(function () {
			expect(SeNotificationsService.notificationBuilder("errors.stateNotFound").post)
				.toThrow("SeNotificationsService: no info for type in errors.stateNotFound");

			expect(SeNotificationsService.notificationBuilder().type(SeNotificationsService.TYPE.TEXT)
				.severity(SeNotificationsService.SEVERITY.ERROR).position(SeNotificationsService.POSITION.BAR)
				.timeToShow(SeNotificationsService.TIME_TO_SHOW.LONG).tag("some.info").post)
				.toThrow("SeNotificationsService: no info for template in undefined");
			expect(SeNotificationsService.notificationBuilder("errors.stateNotFound")
				.severity(SeNotificationsService.SEVERITY.ERROR).position(SeNotificationsService.POSITION.BAR)
				.timeToShow(SeNotificationsService.TIME_TO_SHOW.LONG).tag("some.info").post)
				.toThrow("SeNotificationsService: no info for type in errors.stateNotFound");
			expect(SeNotificationsService.notificationBuilder("errors.stateNotFound").type(SeNotificationsService.TYPE.TEXT)
				.position(SeNotificationsService.POSITION.BAR)
				.timeToShow(SeNotificationsService.TIME_TO_SHOW.LONG).tag("some.info").post)
				.toThrow("SeNotificationsService: no info for severity in errors.stateNotFound");
			expect(SeNotificationsService.notificationBuilder("errors.stateNotFound").type(SeNotificationsService.TYPE.TEXT)
				.severity(SeNotificationsService.SEVERITY.ERROR)
				.timeToShow(SeNotificationsService.TIME_TO_SHOW.LONG).tag("some.info").post)
				.toThrow("SeNotificationsService: no info for position in errors.stateNotFound");
			expect(SeNotificationsService.notificationBuilder("errors.stateNotFound").type(SeNotificationsService.TYPE.TEXT)
				.severity(SeNotificationsService.SEVERITY.ERROR).position(SeNotificationsService.POSITION.BAR).tag("some.info")
				.post)
				.toThrow("SeNotificationsService: no info for timeToShow in errors.stateNotFound");
			expect(SeNotificationsService.notificationBuilder("errors.stateNotFound").type(SeNotificationsService.TYPE.TEXT)
				.severity(SeNotificationsService.SEVERITY.ERROR).position(SeNotificationsService.POSITION.BAR)
				.timeToShow(SeNotificationsService.TIME_TO_SHOW.LONG)
				.post)
				.toThrow("SeNotificationsService: no info for tag in errors.stateNotFound");
		}));

		it("should add notification", inject(function () {
			expect(SeNotificationsService.notifications.length).toBe(0);

			SeNotificationsService.notificationBuilder("errors.stateNotFound").type(SeNotificationsService.TYPE.TEXT)
				.severity(SeNotificationsService.SEVERITY.ERROR).position(SeNotificationsService.POSITION.BAR)
				.timeToShow(SeNotificationsService.TIME_TO_SHOW.LONG).tag("some", true).post();
			expectLog();

			expect(SeNotificationsService.notifications.length).toBe(1);

			expect(SeNotificationsService.notifications[0]).toEqual({
				template: "errors.stateNotFound",
				parameters: undefined,
				type: "TEXT",
				position: "BAR",
				severity: "ERROR",
				timeToShow: 20000,
				debugInfo: undefined,
				tag: "some",
				version: { version : "_VERSION_", buildDate : "_BUILD_DATE_", buildDateAsString : "_BUILD_DATE_AS_STRING_", commit : "_COMMIT_" }
			});

		}));
		it("should exclude toFixed notification", inject(function () {
			expect(SeNotificationsService.notifications.length).toBe(0);

			SeNotificationsService.notificationBuilder("seNotifications.internalError.onerror", null,
				"''errorMsg'   :   Unable to get property 'toFixed' of undefined or null reference").type(SeNotificationsService.TYPE.TEXT)
				.severity(SeNotificationsService.SEVERITY.ERROR).position(SeNotificationsService.POSITION.BAR)
				.timeToShow(SeNotificationsService.TIME_TO_SHOW.LONG).tag("some", true).post();
			// expectLog();

			expect(SeNotificationsService.notifications.length).toBe(0);
		}));
		it("should exclude toFixed notification - german", inject(function () {
			expect(SeNotificationsService.notifications.length).toBe(0);

			SeNotificationsService.notificationBuilder("seNotifications.internalError.onerror", null,
				"\n  \"errorMsg\": \"Die Eigenschaft \\\"toFixed\\\" eines undefinierten oder Nullverweises kann nicht abgerufen werden.\",\n  \"url\":").type(SeNotificationsService.TYPE.TEXT)
				.severity(SeNotificationsService.SEVERITY.ERROR).position(SeNotificationsService.POSITION.BAR)
				.timeToShow(SeNotificationsService.TIME_TO_SHOW.LONG).tag("some", true).post();
			// expectLog();

			expect(SeNotificationsService.notifications.length).toBe(0);
		}));


		it("should not send IE 8", inject(function () {
			expect(SeNotificationsService.notifications.length).toBe(0);
			SeNotificationsService.notificationBuilder("seNotifications.internalError.onerror", null,
				"(compatible; MSIE 8.0; Windows NT 6.1; WOW64; Trident/4.0; SL").type(SeNotificationsService.TYPE.TEXT)
				.severity(SeNotificationsService.SEVERITY.ERROR).position(SeNotificationsService.POSITION.BAR)
				.timeToShow(SeNotificationsService.TIME_TO_SHOW.LONG).tag("some", false).post();

			SeNotificationsService.notificationBuilder("seNotifications.internalError.exceptionHandler", null,
				"(compatible; MSIE 8.0; Windows NT 6.1; WOW64; Trident/4.0; SL").type(SeNotificationsService.TYPE.TEXT)
				.severity(SeNotificationsService.SEVERITY.ERROR).position(SeNotificationsService.POSITION.BAR)
				.timeToShow(SeNotificationsService.TIME_TO_SHOW.LONG).tag("some", false).post();

			SeNotificationsService.notificationBuilder("seNotifications.internalError.log.error", null,
				"(compatible; MSIE 8.0; Windows NT 6.1; WOW64; Trident/4.0; SL").type(SeNotificationsService.TYPE.TEXT)
				.severity(SeNotificationsService.SEVERITY.ERROR).position(SeNotificationsService.POSITION.BAR)
				.timeToShow(SeNotificationsService.TIME_TO_SHOW.LONG).tag("some", false).post();
			// expectLog();

			expect(SeNotificationsService.notifications.length).toBe(3);
		}));

		it("should not send response:0", inject(function () {
			expect(SeNotificationsService.notifications.length).toBe(0);

			SeNotificationsService.notificationBuilder("httperrors.0", null,
				"\nRESPONSESTATUSCODE: 0, \nRESPONSESTATUSTEXT").type(SeNotificationsService.TYPE.TEXT)
				.severity(SeNotificationsService.SEVERITY.ERROR).position(SeNotificationsService.POSITION.BAR)
				.timeToShow(SeNotificationsService.TIME_TO_SHOW.LONG).tag("some", true).post();
			// expectLog();

			expect(SeNotificationsService.notifications.length).toBe(1);
		}));

		it("should auto remove notification after given time", inject(function () {
			expect(SeNotificationsService.notifications.length).toBe(0);

			SeNotificationsService.notificationBuilder("errors.stateNotFound").type(SeNotificationsService.TYPE.TEXT)
				.severity(SeNotificationsService.SEVERITY.ERROR).position(SeNotificationsService.POSITION.BAR)
				.timeToShow(SeNotificationsService.TIME_TO_SHOW.LONG).tag("some", false).post();

			expect(SeNotificationsService.notifications.length).toBe(1);

			expect(SeNotificationsService.notifications[0]).toEqual({
				template: "errors.stateNotFound",
				parameters: undefined,
				type: "TEXT",
				position: "BAR",
				severity: "ERROR",
				timeToShow: 20000,
				debugInfo: undefined,
				tag: "some",
				version: { version : "_VERSION_", buildDate : "_BUILD_DATE_", buildDateAsString : "_BUILD_DATE_AS_STRING_", commit : "_COMMIT_" }
			});
			expectLog();

			$timeout.flush(20000 - 100);

			expect(SeNotificationsService.notifications.length).toBe(1);

			expect(SeNotificationsService.notifications[0]).toEqual({
				template: "errors.stateNotFound",
				parameters: undefined,
				type: "TEXT",
				position: "BAR",
				severity: "ERROR",
				timeToShow: 20000,
				debugInfo: undefined,
				tag: "some",
				version: { version : "_VERSION_", buildDate : "_BUILD_DATE_", buildDateAsString : "_BUILD_DATE_AS_STRING_", commit : "_COMMIT_" }
			});

			$timeout.flush(200);

			expect(SeNotificationsService.notifications.length).toBe(0);
		}));
		it("should auto remove notification with same tag", inject(function () {
			expect(SeNotificationsService.notifications.length).toBe(0);

			SeNotificationsService.notificationBuilder("errors.stateNotFound").type(SeNotificationsService.TYPE.TEXT)
				.severity(SeNotificationsService.SEVERITY.ERROR).position(SeNotificationsService.POSITION.BAR)
				.timeToShow(SeNotificationsService.TIME_TO_SHOW.LONG).tag("some", false).post();
			expectLog();

			expect(SeNotificationsService.notifications.length).toBe(1);

			expect(SeNotificationsService.notifications[0]).toEqual({
				template: "errors.stateNotFound",
				parameters: undefined,
				type: "TEXT",
				position: "BAR",
				severity: "ERROR",
				timeToShow: 20000,
				debugInfo: undefined,
				tag: "some",
				version: { version : "_VERSION_", buildDate : "_BUILD_DATE_", buildDateAsString : "_BUILD_DATE_AS_STRING_", commit : "_COMMIT_" }
			});

			SeNotificationsService.notificationBuilder("errors.stateNotFound1").type(SeNotificationsService.TYPE.TEXT)
				.severity(SeNotificationsService.SEVERITY.ERROR).position(SeNotificationsService.POSITION.BAR)
				.timeToShow(SeNotificationsService.TIME_TO_SHOW.LONG).tag("some", false).post();
			expectLog();


			expect(SeNotificationsService.notifications.length).toBe(2);

			expect(SeNotificationsService.notifications[0]).toEqual({
				template: "errors.stateNotFound",
				parameters: undefined,
				type: "TEXT",
				position: "BAR",
				severity: "ERROR",
				timeToShow: 20000,
				debugInfo: undefined,
				tag: "some",
				version: { version : "_VERSION_", buildDate : "_BUILD_DATE_", buildDateAsString : "_BUILD_DATE_AS_STRING_", commit : "_COMMIT_" }
			});
			expect(SeNotificationsService.notifications[1]).toEqual({
				template: "errors.stateNotFound1",
				parameters: undefined,
				type: "TEXT",
				position: "BAR",
				severity: "ERROR",
				timeToShow: 20000,
				debugInfo: undefined,
				tag: "some",
				version: { version : "_VERSION_", buildDate : "_BUILD_DATE_", buildDateAsString : "_BUILD_DATE_AS_STRING_", commit : "_COMMIT_" }
			});

			SeNotificationsService.notificationBuilder("errors.stateNotFound2").type(SeNotificationsService.TYPE.TEXT)
				.severity(SeNotificationsService.SEVERITY.ERROR).position(SeNotificationsService.POSITION.BAR)
				.timeToShow(SeNotificationsService.TIME_TO_SHOW.LONG).tag("some", true).post();
			expectLog();


			expect(SeNotificationsService.notifications.length).toBe(1);

			expect(SeNotificationsService.notifications[0]).toEqual({
				template: "errors.stateNotFound2",
				parameters: undefined,
				type: "TEXT",
				position: "BAR",
				severity: "ERROR",
				timeToShow: 20000,
				debugInfo: undefined,
				tag: "some",
				version: { version : "_VERSION_", buildDate : "_BUILD_DATE_", buildDateAsString : "_BUILD_DATE_AS_STRING_", commit : "_COMMIT_" }
			});
		}));
		it("should remove notification by tag", inject(function () {
			expect(SeNotificationsService.notifications.length).toBe(0);

			SeNotificationsService.notificationBuilder("errors.stateNotFound").type(SeNotificationsService.TYPE.TEXT)
				.severity(SeNotificationsService.SEVERITY.ERROR).position(SeNotificationsService.POSITION.BAR)
				.timeToShow(SeNotificationsService.TIME_TO_SHOW.LONG).tag("some", false).post();
			expectLog();

			expect(SeNotificationsService.notifications.length).toBe(1);

			expect(SeNotificationsService.notifications[0]).toEqual({
				template: "errors.stateNotFound",
				parameters: undefined,
				type: "TEXT",
				position: "BAR",
				severity: "ERROR",
				timeToShow: 20000,
				debugInfo: undefined,
				tag: "some",
				version: { version : "_VERSION_", buildDate : "_BUILD_DATE_", buildDateAsString : "_BUILD_DATE_AS_STRING_", commit : "_COMMIT_" }
			});

			SeNotificationsService.notificationBuilder("errors.stateNotFound1").type(SeNotificationsService.TYPE.TEXT)
				.severity(SeNotificationsService.SEVERITY.ERROR).position(SeNotificationsService.POSITION.BAR)
				.timeToShow(SeNotificationsService.TIME_TO_SHOW.LONG).tag("some", false).post();
			expectLog();

			expect(SeNotificationsService.notifications.length).toBe(2);

			expect(SeNotificationsService.notifications[0]).toEqual({
				template: "errors.stateNotFound",
				parameters: undefined,
				type: "TEXT",
				position: "BAR",
				severity: "ERROR",
				timeToShow: 20000,
				debugInfo: undefined,
				tag: "some",
				version: { version : "_VERSION_", buildDate : "_BUILD_DATE_", buildDateAsString : "_BUILD_DATE_AS_STRING_", commit : "_COMMIT_" }
			});
			expect(SeNotificationsService.notifications[1]).toEqual({
				template: "errors.stateNotFound1",
				parameters: undefined,
				type: "TEXT",
				position: "BAR",
				severity: "ERROR",
				timeToShow: 20000,
				debugInfo: undefined,
				tag: "some",
				version: { version : "_VERSION_", buildDate : "_BUILD_DATE_", buildDateAsString : "_BUILD_DATE_AS_STRING_", commit : "_COMMIT_" }
			});

			SeNotificationsService.removeTag("some");

			expect(SeNotificationsService.notifications.length).toBe(0);
		}));
		it("should not add notification if debug is not enabled and notification is debuggable", inject(function () {
			var oldValue = SeNotificationsService.DEBUG_ENABLED;
			SeNotificationsService.DEBUG_ENABLED = false;
			expect(SeNotificationsService.notifications.length).toBe(0);

			SeNotificationsService.notificationBuilder("errors.stateNotFound", null, null, true).type(SeNotificationsService.TYPE.TEXT)
				.severity(SeNotificationsService.SEVERITY.ERROR).position(SeNotificationsService.POSITION.BAR)
				.timeToShow(SeNotificationsService.TIME_TO_SHOW.LONG).tag("some", true).post();

			expect(SeNotificationsService.notifications.length).toBe(0);

			SeNotificationsService.DEBUG_ENABLED = oldValue;
		}));
		it("should add notification if debug is not enabled and notification is not debuggable", inject(function () {
			var oldValue = SeNotificationsService.DEBUG_ENABLED;
			SeNotificationsService.DEBUG_ENABLED = true;
			expect(SeNotificationsService.notifications.length).toBe(0);

			SeNotificationsService.notificationBuilder("errors.stateNotFound").type(SeNotificationsService.TYPE.TEXT)
				.severity(SeNotificationsService.SEVERITY.ERROR).position(SeNotificationsService.POSITION.BAR)
				.timeToShow(SeNotificationsService.TIME_TO_SHOW.LONG).tag("some", true).post();
			expectLog();

			expect(SeNotificationsService.notifications.length).toBe(1);

			expect(SeNotificationsService.notifications[0]).toEqual({
				template: "errors.stateNotFound",
				parameters: undefined,
				type: "TEXT",
				position: "BAR",
				severity: "ERROR",
				timeToShow: 20000,
				debugInfo: undefined,
				tag: "some",
				version: { version : "_VERSION_", buildDate : "_BUILD_DATE_", buildDateAsString : "_BUILD_DATE_AS_STRING_", commit : "_COMMIT_" }
			});

			SeNotificationsService.DEBUG_ENABLED = oldValue;
		}));
		it("should add notification if debug is enabled and notification is debuggable", inject(function () {
			var oldValue = SeNotificationsService.DEBUG_ENABLED;
			SeNotificationsService.DEBUG_ENABLED = true;
			expect(SeNotificationsService.notifications.length).toBe(0);

			SeNotificationsService.notificationBuilder("errors.stateNotFound", null, null, true).type(SeNotificationsService.TYPE.TEXT)
				.severity(SeNotificationsService.SEVERITY.ERROR).position(SeNotificationsService.POSITION.BAR)
				.timeToShow(SeNotificationsService.TIME_TO_SHOW.LONG).tag("some", true).post();
			expectLog();

			expect(SeNotificationsService.notifications.length).toBe(1);

			expect(SeNotificationsService.notifications[0]).toEqual({
				template: "errors.stateNotFound",
				parameters: null,
				type: "TEXT",
				position: "BAR",
				severity: "ERROR",
				timeToShow: 20000,
				debugInfo: null,
				tag: "some",
				version: { version : "_VERSION_", buildDate : "_BUILD_DATE_", buildDateAsString : "_BUILD_DATE_AS_STRING_", commit : "_COMMIT_" }
			});

			SeNotificationsService.DEBUG_ENABLED = oldValue;
		}));
		it("should not add more than 10 notifications", inject(function () {
			expect(SeNotificationsService.notifications.length).toBe(0);

			for(var i = 0; i<20; i++) {
				SeNotificationsService.notificationBuilder("errors.stateNotFound").type(SeNotificationsService.TYPE.TEXT)
					.severity(SeNotificationsService.SEVERITY.ERROR).position(SeNotificationsService.POSITION.BAR)
					.timeToShow(SeNotificationsService.TIME_TO_SHOW.LONG).tag("some", false).post();

				if (i<10) {
					expectLog();
				}
			}
			$httpBackend.verifyNoOutstandingExpectation();
			$httpBackend.verifyNoOutstandingRequest();
			expect(SeNotificationsService.notifications.length).toBe(10);

			var now = new Date().getTime();
			var oldTime = window.Date.prototype.getTime;
			window.Date.prototype.getTime = function() {return now+3000;};
			expect(SeNotificationsService.notifications.length).toBe(10);

			SeNotificationsService.notificationBuilder("errors.stateNotFound").type(SeNotificationsService.TYPE.TEXT)
				.severity(SeNotificationsService.SEVERITY.ERROR).position(SeNotificationsService.POSITION.BAR)
				.timeToShow(SeNotificationsService.TIME_TO_SHOW.LONG).tag("some", false).post();
			expectLog();
			expect(SeNotificationsService.notifications.length).toBe(11);

			window.Date.prototype.getTime = oldTime;
		}));
		it("should handle type 'SERVER'", inject(function () {
			expect(SeNotificationsService.notifications.length).toBe(0);

			SeNotificationsService.notificationBuilder("errors.stateNotFound").type(SeNotificationsService.TYPE.TEXT)
				.severity(SeNotificationsService.SEVERITY.ERROR).position(SeNotificationsService.POSITION.SERVER)
				.timeToShow(SeNotificationsService.TIME_TO_SHOW.LONG).tag("some", false).post();

			expectLog();
			$httpBackend.verifyNoOutstandingExpectation();
			$httpBackend.verifyNoOutstandingRequest();
			expect(SeNotificationsService.notifications.length).toBe(0);
		}));
		it("should handle doNotNotifyServer", inject(function () {
			expect(SeNotificationsService.notifications.length).toBe(0);

			SeNotificationsService.notificationBuilder("errors.stateNotFound").type(SeNotificationsService.TYPE.TEXT)
				.severity(SeNotificationsService.SEVERITY.ERROR).position(SeNotificationsService.POSITION.BAR)
				.timeToShow(SeNotificationsService.TIME_TO_SHOW.LONG).tag("some", false).doNotNotifyServer().post();

			$httpBackend.verifyNoOutstandingExpectation();
			$httpBackend.verifyNoOutstandingRequest();
			expect(SeNotificationsService.notifications.length).toBe(1);
		}));
		it("should set httpErrorHideConfiguration", inject(function () {
			expect(SeNotificationsService.getAndClearHttpErrorHideFlag()).toBe(false);
			SeNotificationsService.handleHttpError([]);
			expect(SeNotificationsService.getAndClearHttpErrorHideFlag()).toBe(true);
		}));

		it("should reset httpErrorHideConfiguration", inject(function () {
			expect(SeNotificationsService.getAndClearHttpErrorHideFlag()).toBe(false);
			SeNotificationsService.handleHttpError([]);
			expect(SeNotificationsService.getAndClearHttpErrorHideFlag()).toBe(true);
			expect(SeNotificationsService.getAndClearHttpErrorHideFlag()).toBe(false);
		}));

		it("should warn if httpErrorHideConfiguration is set twice", inject(function ($log) {
			expect(SeNotificationsService.getAndClearHttpErrorHideFlag()).toBe(false);
			SeNotificationsService.handleHttpError([1]);
			expect($log.error.logs.length).toBe(0);
			SeNotificationsService.handleHttpError([2]);
			expect($log.error.logs.length).toBe(1);
			expect($log.error.logs[0]).toEqual(["SeNotificationsService: handleHttpError, but already hidden", [2], [1]]);
			expect(SeNotificationsService.getAndClearHttpErrorHideFlag()).toBe(true);
			expect(SeNotificationsService.getAndClearHttpErrorHideFlag()).toBe(false);
		}));

		it("should throw if configuration is empty", inject(function () {
			expect(SeNotificationsService.handleHttpError).toThrow("SeNotificationsService: handlersConfiguration must be array: " + undefined);
			expect(function() {SeNotificationsService.handleHttpError({a:1});}).toThrow("SeNotificationsService: handlersConfiguration must be array: "+{a:1});
		}));

	});

});
