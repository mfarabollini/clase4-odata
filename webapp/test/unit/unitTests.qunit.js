/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"exaccs/clase4-odata/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
