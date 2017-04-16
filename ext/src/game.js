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
