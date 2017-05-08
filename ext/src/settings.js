// UNIQUE_ID defined in analytics.js

function checkSettings() {

	chrome.storage.sync.get(null, i => {
		UNIQUE_ID = i.a_uniqueId || genUniqueId();
		chrome.storage.sync.set({
			a_uniqueId: UNIQUE_ID,
			a_lastVersion: '0.1.4',
			s_autoRefresh: i.s_autoRefresh || true,
			s_blockAutoplay: i.s_blockAutoplay || true,
			s_emsettings: i.s_emsettings || []
		}, () => {
			// can't set settings until this is intialised, use a settimeout
			window.setSetting = chrome.storage.sync.set;
		});
	});
}

window.getSetting = chrome.storage.sync.get;


checkSettings();


function genUniqueId() {
	UNIQUE_ID = 'i1_' + Math.random().toString(36).substr(2, 12);
	trackAnalyticsEvent('oracle_install', {});
	return UNIQUE_ID;
}
