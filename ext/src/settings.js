function checkSettings() {
	chrome.storage.sync.get(null, i => {
		chrome.storage.sync.set({
			s_autoRefresh: i.autoRefresh || true
		});
	});
}

checkSettings();

var getSetting = chrome.storage.sync.get;
var setSetting = chrome.storage.sync.set;
