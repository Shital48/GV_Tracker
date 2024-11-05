/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"gv_tracker/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
