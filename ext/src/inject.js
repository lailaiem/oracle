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
	insertRehost();
}

if ($(".select_status").length) {
	insertReportComments();
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
			<label for="_oAutoRefreshBox"><i class="_oracle_icon"></i></label>
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

function insertRehost() {
	$("body").on("mouseenter", ".gamerow", e => {
		$(e.currentTarget).find(".gamesetup").after(`<div class="_oRehost">Rehost</div>`);
	});
	$("body").on("mouseleave", ".gamerow", e => {
		$(e.currentTarget).find("._oRehost").remove();
	});
	$("body").on("click", "._oRehost", e => {
		$(e.currentTarget).text("Rehosting");

		const $gameRow = $(e.currentTarget).parents(".gamerow");
		const gid = $gameRow.attr("data-gid");
		const info = $.get(`https://epicmafia.com/game/${gid}/info`, data => {
			const setup = data[1].data.match(/\/setup\/[0-9]+/)[0].split("/")[2];
			const isGoldHeart = $gameRow.find("img[src='/images/goldlives.png']").length !== 0;
			const isRedHeart = $gameRow.find("img[src='/images/lives.png']").length !== 0;
			const rank = isGoldHeart ? 2 : (isRedHeart ? 1 : 0);

			$.get(`https://epicmafia.com/game/add/mafia?setupid=${setup}&ranked=${rank}`, d => {
				if (d[1].table) {
					document.location = `https://epicmafia.com/game/${d[1].table}`;
				} else {
					alert(d[1].msg);
				}
			})
		});
	});
}

function insertReportEnhance() {
	// Parse links
	if ($("#report_msg").html().indexOf("epicmafia.com/")) {
		$("#report_msg").html($("#report_msg").html().replace(/https:\/\/epicmafia.com\/(report|game)\/(\d+)\/?(?:review)?/g,
			`<a href="https://epicmafia.com/$1/$2" class="_oLinkReport"><i class="_oracle_icon"></i> $1 $2</a>`));
	}

	// Auto close
	if ($("#create_report_statement").length) {
		$("#create_report_statement").after(`<div id="_oCloseReport"><input type="checkbox" id="_oCloseReportBox" checked\ />
			<label for="_oCloseReport"><i class="_oracle_icon"></i> Close report upon submitting verdict</label></div>`);
	
		$("#report_controls .vv").after(`<br />
			<a class="redbutton smallfont _oChangeStatus" data-t="open" data-status="open"><i class="_oracle_icon"></i> Open</a>
			<a class="redbutton smallfont _oChangeStatus" data-t="in progress" data-status="processing"><i class="_oracle_icon"></i> In progress</a>
			<a class="redbutton smallfont _oChangeStatus" data-t="closed" data-status="closed"><i class="_oracle_icon"></i> Closed</a>`);

		$(`._oChangeStatus[data-t='${$(".report_status").text().toLowerCase()}']`).remove();
	}

	const reportId = document.location.pathname.split("/")[2];

	$("._oChangeStatus").click(e => {
		$.get(`https://epicmafia.com/report/${reportId}/edit/status?status=${$(e.currentTarget).attr('data-status')}`, () => {
			document.location.reload();
		});
		$(e.target).addClass("disabled");
	});

	$("#create_report_statement").submit(e => {
		if ($("#_oCloseReportBox")[0].checked) {
			$.get(`https://epicmafia.com/report/${reportId}/edit/status?status=closed`);
		}
	});
}

function insertReportComments() {
	const showSel = document.location == "https://epicmafia.com/report?status=oracle_mycomments";
	$(".report_status:last").after(`<a class="report_status in_menu ${showSel ? 'sel' : ''}" href="/report?status=oracle_mycomments" style="background-color:#cd88d3">My comments</a>`)
}