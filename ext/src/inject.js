const currentUser = $("#auth_top .user span").text().toLowerCase();
const MODS = ["edark", "nathan", "lono", "expose", "jess", "apeescaper", "prayag", "patrykszczescie", "ucklar", "charley", "whitepimp007", "gerry", "merlot", "bebop", "lailai"];
const modMode = MODS.indexOf(currentUser) !== -1;

let lastActivity = Date.now();
$('body').mousemove(e => lastActivity = Date.now());

if ($("#top_messages").length) {
	insertOracleButton();
}

if ($(".ll-refresh").length) {
	insertAutoRefresh();
}

if ($("#report_msg").length) {
	insertReportEnhance();
}

function insertOracleButton() {
	$("#top_messages").after('<div id="_oracle_button"><a><i class="_oracle_icon"></i><span>Oracle</span></a></div>');
	$("#_oracle_button").click(() => {
		if ($("#_oracle_window").length) {
			return $("#_oracle_window").remove();
		}

		$("#container").prepend(`<div id="_oracle_window">
				<div class="_owHeader">
					<i class="_oracle_icon"></i> <span class="_owTitle">Oracle</span>
					<span class="_owVersion">${modMode ? "mod" : "non-mod"} mode v0.1.0</span>
				</div>
				<div class="_owQuickNav">
					<i class="icon-search"></i><input id="_owUser" class="_oInput" type="text" placeholder="Open profile of..." />
				</div>
			</div>`);
	});
	$("body").click(e => {
		if ($(e.target).is("#_oracle_window,#_oracle_button,.icon-refresh")
			|| $(e.target).parents("#_oracle_window,#_oracle_button").length) {
			return;
		} else {
			$("#_oracle_window").remove();
		}
	});

	$("body").on("keypress", "#_owUser", e => {
		if (e.keyCode === 13) {
			const username = $(e.target).val();
			$(e.target).attr("disabled", true).val("Processing...");

			$.get(`https://epicmafia.com/user/search?q=${username}`, users => {
				if (users.total > 0) {
					const userId = users.data[0].id;
					window.location = `https://epicmafia.com/user/${userId}`;
				} else {
					alert(`Oracle: User "${username}" not found :(`);
					$(e.target).attr("disabled", false).val("");
				}
			});
		}
	});
}

function insertAutoRefresh() {
	getSetting("s_autoRefresh", s => {
	let autoRefresh = s.s_autoRefresh;

	$(".ll-refresh").after(`<div id="_oAutoRefreshWrap" class="tt" data-title="Auto-refresh">
			<input type="checkbox" id="_oAutoRefreshBox" ${autoRefresh ? "checked" : ""}/>
			<i class="_oracle_icon"></i>
		</div>`);

	$("#_oAutoRefreshBox").change(e => {
		autoRefresh = e.target.checked;
		setSetting({s_autoRefresh: e.target.checked});
	});

	setInterval(() => {
		if (autoRefresh && document.hasFocus()
			&& (Date.now() - lastActivity < 5 * 60 * 1000)
			&& $('.pagenav .grey.smallfont').text() === "Page 1") {
			$('.icon-refresh').click();
		}
	}, 2200);

	});
}

function insertReportEnhance() {
	// Parse links
	if ($("#report_msg").html().indexOf("epicmafia.com/")) {
		$("#report_msg").html($("#report_msg").html().replace(/https:\/\/epicmafia.com\/(report|game)\/(\d+)\/?(?:review)?/,
			`<a href="https://epicmafia.com/$1/$2" class="_oLinkReport"><i class="_oracle_icon"></i> $1 $2</a>`));
	}
}