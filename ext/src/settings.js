// UNIQUE_ID defined in analytics.js

function checkSettings() {

	chrome.storage.sync.get(null, i => {
		UNIQUE_ID = i.a_uniqueId || genUniqueId();
		chrome.storage.sync.set({
			a_uniqueId: UNIQUE_ID,
			s_autoRefresh: i.s_autoRefresh || true
		});
	});
}

checkSettings();

var getSetting = chrome.storage.sync.get;
var setSetting = chrome.storage.sync.set;

function genUniqueId() {
	UNIQUE_ID = 'i1_' + Math.random().toString(36).substr(2, 12);
	trackAnalyticsEvent('oracle_install', {});
	return UNIQUE_ID;
}
