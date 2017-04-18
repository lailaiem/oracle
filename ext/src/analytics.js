const currentUser = $("#auth_top .user span").text().toLowerCase();
let UNIQUE_ID = 'i0_unset';

function trackAnalyticsEvent(eventName, eventProps) {
	if(isDevMode()) {
		console.log('analytics event', eventName, eventProps);
		eventProps.dev = true;
	}
	if (UNIQUE_ID === "i0_unset") {
		setTimeout(() => trackAnalyticsEvent(eventName, eventProps), 100);
		return;
	}
	// 45.63.17.67 = epicmafia.net
	$("body").append(`<img src="http://45.63.17.67/oracle/a.php?u=${currentUser}&i=${UNIQUE_ID}&n=${eventName}&p=${btoa(JSON.stringify(eventProps))}" height="0" width="0" />`);
}

function isDevMode() {
    return !('update_url' in chrome.runtime.getManifest());
}
