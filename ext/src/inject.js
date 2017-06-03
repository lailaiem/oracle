// currentUser defined in analytics

let lastActivity = Date.now();
$('body').mousemove(e => lastActivity = Date.now());

$("ul li:eq(0)").append ( `
    <div class="_orcDropdownContent">
        <a href="https://epicmafia.com/game/new">Create game</a>
        <a href="https://epicmafia.com/setup">Find setup</a>
        <a href="https://epicmafia.com/lobby/rules">Rules</a>
    ` );

$("ul li:eq(1)").append ( `
    <div class="_orcDropdownContent">
        <a href="https://epicmafia.com/message">Inbox</a>
        <a href="https://epicmafia.com/family">Family</a>
        <a href="https://epicmafia.com/addon">Buy</a>
    ` );

$("ul li:eq(2)").append ( `
    <div class="_orcDropdownContent">
        <a href="https://epicmafia.com/moderator">Moderators</a>
        <a href="https://epicmafia.com/report">Reports</a>
    ` );

if ($("#move_topic > select").children().length == 2) {
    var forums = '<option value="26">Moderators Only</option><option value="36">Epicmafia</option><option value="38">General Discussion</option><option value="49">Mentors Only</option><option value="256">Off Topic</option><option value="261">Welcome to EM!</option><option value="535">Games</option><option value="536">Entertainment</option><option value="537">Forum Games</option><option value="565">Food & Drink</option>';
    $("#move_topic > select").append(forums);
}

if ($("#top_messages").length) {
	insertOracleButton();
}

if ($(".ll-refresh").length) {
	insertAutoRefresh();
	insertRehost();
}

if ($("#nav li.sel a").text() === "Round") {
	$("#subnav").append(`<li><a href="/lobby/rules" style="color: #c788d3">Rules</a></li>`);
}

if ($("#usertitle").length) {
    const userid = $(".lcontrols > a").attr("href").split("/")[2];

    $.get(`https://epicmafia.com/uploads/deathsounds/${userid}.ogg`, () => {
        $("#finduserbox").append(`<span class="lcontrols"><a class="_oDeath"><i class="icon-music" style="color: #c788d3"></i></a></span>`);
    	$("._oDeath").click(() => { 
    		trackAnalyticsEvent('deathsound_click', {userid});
    		setTimeout(() => {
    			document.location = `https://epicmafia.com/uploads/deathsounds/${userid}.ogg`;
    		}, 200);
    	});
    });
}

if ($("#ytplayer").length) {
	getSetting("s_blockAutoplay", s => {
		const blockAutoplay = s.s_blockAutoplay;
		$("#ytplayer").after(`<div class="_orcAutoPlay">
			<input type="checkbox" id="_oBlockAutoplayBox" ${blockAutoplay ? "checked" : ""}/>
			<label for="_oBlockAutoplayBox"><i class="_oracle_icon"></i> No autoplay</label>
			</div>`);
		if (blockAutoplay) {
			const userid = $(".lcontrols > a").attr("href").split("/")[2];
			trackAnalyticsEvent('autoplay_blocked', {userid});

			let src = $("#ytplayer").attr("src");
			src = src.replace("?autoplay=1", "");
			$("#ytplayer").attr("src", src);
		}
		$("#_oBlockAutoplayBox").change(e => {
			setSetting({s_blockAutoplay: e.target.checked});
		});
	});
}

if ($("#admin_info").length) {
		$("a.pretty").before(
			`<a class="smallfont pretty _oBackLink" href="/report?status=open"><i class="icon-reply red"></i> Back (Open)</a>`)
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
					<span class="_owVersion">v0.1.3</span>
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
			&& $('.pagenav .grey.smallfont').text() === "Page 1"
			&& $('.ll-gamelist.sel').length === 1) {
			$('.icon-refresh').click();
		}
	}, 2200);


	$(document).focus(() => {
		if (autoRefresh) {
			$('.icon-refresh').click();
		}
	});

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
