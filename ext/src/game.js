if ($('.em_checkbox').length) {
	if ($('.em_checkbox.sel').length) {
		// save
		var newEmSettings = [];
		$('.em_checkbox.sel').each((i, c) => {
			newEmSettings.push($(c).attr("id"));
		});

		setTimeout(() => { setSetting({'s_emsettings': newEmSettings}); }, 200);
	} else {
		// load
		getSetting('s_emsettings', settings => {
			for (setting in settings.s_emsettings) {
				$(`#${settings.s_emsettings[setting]}`).click();
			}
		});
	}
}

$('.chat').on('mouseenter', '.msg', e => {
	const $e = $(e.currentTarget);

	if ($e.hasClass("_orcLinked")) {
		return;
	}
	const text = $e.text();
	if (text.indexOf("http") !== -1) {
		const replaced = $e.text().replace(/https?:\/\/[A-Za-z0-9.\/\-#?_&]*/, "<a href='$&' class='_orcChatLink' target='_blank'>$&</a>");
		if (replaced !== text) {
			$e.html(replaced);
		}
	}

	$e.addClass("_orcLinked");
});

$('.chat').on('click', '._orcChatLink', e => {
	trackAnalyticsEvent('chat_linkified_click', {href: $(e.target).attr("href")});
});
