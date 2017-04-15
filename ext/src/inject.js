// currentUser defined in analytics

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

if ($("#nav li.sel a").text() === "Round") {
	$("#subnav").append(`<li><a href="/lobby/rules" style="color: #c788d3">Rules</a></li>`);
}

if ($("#usertitle").length) {
    const userpage = $(".lcontrols > a").attr("href").split("/")[2]

    $.get(`https://epicmafia.com/uploads/deathsounds/${userpage}.ogg`, () => {
        $("#finduserbox").append(`<span class="lcontrols" style="color: #c788d3"><a href="https://epicmafia.com/uploads/deathsounds/${userpage}.ogg"><i class="icon-music"></i></a></span>`);
    })
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
					<span class="_owVersion">v0.1.0</span>
				</div>
				<div class="_owQuickNav">
					<i class="icon-search"></i><input id="_owUser" class="_oInput" type="text" placeholder="Open profile of..." />
				</div>
				<p>New features will be added to Oracle over time!</p>
				<p>Developed by <a href="https://epicmafia.com/user/12939">lailai</a> with contributions from <a href="https://epicmafia.com/u/Whitepimp007">Whitepimp007</a></p>
				<p>Oracle is open source! <a href="https://github.com/lailaiem/oracle">GitHub</a></p>
				<hr />
				<p>Coming soon: epicmafia.net, your companion site for EM</p>
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
			trackAnalyticsEvent('quick_user', {username});

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
		if ($("#lobby_name").text() != "Games Lobby") {
			$(e.currentTarget).find(".gamesetup").after(`<div class="_oRehost">Rehost</div>`);
		}
	});
	$("body").on("mouseleave", ".gamerow", e => {
		$(e.currentTarget).find("._oRehost").remove();
	});
	$("body").on("click", "._oRehost", e => {
		$(e.currentTarget).text("Rehosting");

		const $gameRow = $(e.currentTarget).parents(".gamerow");
		const isGoldHeart = $gameRow.find("img[src='/images/goldlives.png'],img[src='/images/broken_goldlives.png']").length !== 0;
		const isRedHeart = $gameRow.find("img[src='/images/lives.png'],img[src='/images/broken_lives.png']").length !== 0;
		const rank = isGoldHeart ? 2 : (isRedHeart ? 1 : 0);

		const gid = $gameRow.attr("data-gid");
		const info = $.get(`https://epicmafia.com/game/${gid}/info`, data => {
			const setup = data[1].data.match(/\/setup\/[0-9]+/)[0].split("/")[2];

			trackAnalyticsEvent('rehost_use', {setup, rank});

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

	// open
	if ($("a[href='/report?status=closed']").length) {
		$("a[href='/report?status=closed']").before(
			`<a class="smallfont pretty _oBackLink" href="/report?status=open"><i class="icon-reply red"></i> Back (Open)</a>`)
	}

	// Modtools
	if ($("#create_report_statement").length) {
		const userHref = $('.report_target a').attr('href');
		$('.report_target a').after(` <a href="/moderator${userHref}" class="_oModLink">(Mod tools)</a>`);
	}

	// Initializing earlier so variable can be used in the no vio button
	const reportId = document.location.pathname.split("/")[2];

	// Auto close
	if ($("#create_report_statement").length) {

	    $("#create_report_statement").append(`<a class="redbutton smallfont _oNoVio"><i class="_oracle_icon"></i> nv</a>`);

	    $("#create_report_statement").after(`<div id="_oCloseReport"><input type="checkbox" id="_oCloseReportBox" checked\ />
			<label for="_oCloseReport"><i class="_oracle_icon"></i> Close report upon submitting verdict</label></div>`);

		$("#report_controls .vv").after(`<br />
			<a class="redbutton smallfont _oChangeStatus" data-t="open" data-status="open"><i class="_oracle_icon"></i> Open</a>
			<a class="redbutton smallfont _oChangeStatus" data-t="in progress" data-status="processing"><i class="_oracle_icon"></i> In progress</a>
			<a class="redbutton smallfont _oChangeStatus" data-t="closed" data-status="closed"><i class="_oracle_icon"></i> Close</a>`);

		$(`._oChangeStatus[data-t='${$(".report_status").text().toLowerCase()}']`).remove();
	}

	$("._oChangeStatus").click(e => {
		const newStatus = $(e.currentTarget).attr('data-status')
		trackAnalyticsEvent('change_status', {newStatus, reportId});
		$.get(`https://epicmafia.com/report/${reportId}/edit/status?status=${newStatus}`, () => {
			document.location.reload();
		});
		$(e.target).addClass("disabled");
	});

	let actuallyLetProceed = false;
	$("#create_report_statement").submit(e => {
		if (actuallyLetProceed) {
			return;
		}
		const autoClose = $("#_oCloseReportBox")[0].checked;
		trackAnalyticsEvent('report_statement', {autoClose, reportId});
		if (autoClose) {
			e.preventDefault();
			$.get(`https://epicmafia.com/report/${reportId}/edit/status?status=closed`, () => {
				actuallyLetProceed = true;
				$("#create_report_statement").submit();
			});
		}
	});

	$("._oNoVio").click(e => {
		trackAnalyticsEvent('report_novio', {reportId});
		$.get(`https://epicmafia.com/report/${reportId}/edit/statement?statement=no+violation`, () => {
			$.get(`https://epicmafia.com/report/${reportId}/edit/status?status=closed`, () => {
				document.location.reload();
			});
		});
	});
}

function insertReportComments() {
	const showSel = document.location == "https://epicmafia.com/report?status=oracle_comments";
	$(".report_status:last").after(`<a class="report_status in_menu ${showSel ? 'sel' : ''}" href="/report?status=oracle_comments" style="background-color:#cd88d3">Oracle Comments</a>`)

	let waiting = 3;

	if (showSel) {
		trackAnalyticsEvent('report_comments', {});

		$("#s_search").remove();
		$("#reports .inform").text("This page will show all recent comments on reports related to you (i.e. you reported someone, you were reported, or you last moderated a report). It might take a while to load.");

		searchReports('open');
		setTimeout(() => searchReports('closed'), 1250);
		setTimeout(() => searchReports('processing'), 2500);
	}

	function searchReports(status) {
		$.get(`https://epicmafia.com/report?status=${status}`, html => {
			$vDom = $(html);
			$vDom = $vDom.find("#reports");
			$vDom.find(".report").each((i, v) => {
				if ($(v).find(".sg")[0].innerText !== " 0") {
					var reporter = $(v).find(".report_user1").text().trim().toLowerCase();
					var reported = $(v).find(".report_user2").text().trim().toLowerCase();
					var maybeMod = $(v).find(".moderator_name").text().toLowerCase();

					if ([reporter, reported, maybeMod].indexOf(currentUser) !== -1) {
						loadCommentsFrom($(v).attr("id").split("_")[1], $(v), status, maybeMod);
					}
				}
			});
			waiting--;
			if (waiting === 0) {
				if ($("#reports").children().length === 1) {
					$("#reports").append(`<div class="inform w cnt">There are no recent reports involving you with comments!</div>`);
				}
			}
		});
	}

	function loadCommentsFrom(id, $report, status, maybeMod) {
		$.get(`https://epicmafia.com/comment/find/report/${id}?page=1`, data => {
			$header1 = $report.find(".report_middle");
			$comments = $vDom.find(".comments");

			$header1.prepend($report.find(".redbutton"));
			$header1.prepend(`<span class="_oReportStatus" data-status="${status}">${status}</span>`);
			if (maybeMod) {
				$header1.append(` <small>(Handled by ${maybeMod})</small>`);
			}

			$block = $(`<div class="_oReportBlock"><div class="_oReportHeader">${$header1.html()}</div></div>`);
			for (var i = 0; i < data.data.length; i++) {
				const comment = data.data[i];
				$block.append(`<div class="_oComment">
					<div class="_oCommentUser">
						<a href="/user/${comment.user_id}"><img src="https://em-uploads.s3.amazonaws.com/avatars/${comment.user_id}_teeny.jpg">${comment.user_username}</a></div>
						<div class="_oCommentContent">${comment.msg}</div></div>`);
			}
			$("#reports").append($block);
		});
	}
}