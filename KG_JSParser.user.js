// ==UserScript==
// @name           KG_JSParser
// @version        1.0.5
// @namespace      klavogonki
// @author         NIN
// @description    Скрипт-парсер с сохранением заездов и персональными предрезами
// @include        http*://klavogonki.ru/*
// @grant          none
// ==/UserScript==

(function() {

	//todo chat by id, not nickname
	let kgjs_pers_messages = {};
	let kgjs_inter_results = [];
	let kgjs_total_results = [];
	let parse_zip = false;
	
	let update_enabled = false; // on page unload
	let update_enabled2 = false; // every 10 seconds
	
	if (location.href.match(/^https?:\/\/klavogonki\.ru\/g\/\?gmid=/)) {
		update_enabled = true;
		update_enabled2 = true;
	}
	else if (location.href.match(/^https?:\/\/klavogonki\.ru\/$/)) {}
	else return;
	
	const default_rules = (function() {
		let rule_avg_speed = {};
		rule_avg_speed.command = "avg_speed";
		rule_avg_speed.chat = false;
		rule_avg_speed.columns = (table) => {
			for (let _id of Object.keys(table)) {
				table[_id]["points"] = table[_id]["avg_speed"];
			}
			let columns=[];
			columns.push({"title":"№","data": (x) => x["sort_position"]});
			columns.push({"title":"ID","data": (x) => table.list_get_last_not_none(x["id"])});
			columns.push({"title":"Ник","data": (x) => table.list_get_last_not_none(x["name"]),"add_class":"kgjs-left-align"});
			columns.push({"title":"Результат","data": (x) => x["points"].toFixed(2)})
			for (const f of table.valid_game_numbers) {
				columns.push({"title":f.n.toString()+"\n"+f.gametype.title,"data": (x,_i=f.i) => x["speed"][_i],"game":f.i});
			}
			return columns;
		};
	
		let rule_avg_errors = {};
		rule_avg_errors.command = "avg_error_percent";
		rule_avg_errors.chat = false;
		rule_avg_errors.sort_func = (x) => -x[1]["avg_error_percent"];
		rule_avg_errors.columns = (table) => {
			for (let _id of Object.keys(table)) {
				table[_id]["points"] = table[_id]["avg_error_percent"];
			}
			let columns=[];
			columns.push({"title":"№","data": (x) => x["sort_position"]});
			columns.push({"title":"ID","data": (x) => table.list_get_last_not_none(x["id"])});
			columns.push({"title":"Ник","data": (x) => table.list_get_last_not_none(x["name"]),"add_class":"kgjs-left-align"});
			columns.push({"title":"Результат","data": (x) => x["points"].toFixed(2)})
			for (const f of table.valid_game_numbers) {
				columns.push({"title":f.n.toString()+"\n"+f.gametype.title,"data": (x,_i=f.i) => x["error_percent"][_i],"game":f.i});
			}
			return columns;
		};

		let rule_sum_errors = {};
		rule_sum_errors.command = "sum_error_count";
		rule_sum_errors.chat = false;
		rule_sum_errors.sort_func = (x) => -x[1]["sum_error_count"];
		rule_sum_errors.columns = (table) => {
			for (let _id of Object.keys(table)) {
				table[_id]["points"] = table[_id]["sum_error_count"];
			}
			let columns=[];
			columns.push({"title":"№","data": (x) => x["sort_position"]});
			columns.push({"title":"ID","data": (x) => table.list_get_last_not_none(x["id"])});
			columns.push({"title":"Ник","data": (x) => table.list_get_last_not_none(x["name"]),"add_class":"kgjs-left-align"});
			columns.push({"title":"Результат","data": (x) => x["points"].toFixed(2)})
			for (const f of table.valid_game_numbers) {
				columns.push({"title":f.n.toString()+"\n"+f.gametype.title,"data": (x,_i=f.i) => x["error_count"][_i],"game":f.i});
			}
			return columns;
		};
	
		return {"avg_speed": rule_avg_speed, "avg_error_percent": rule_avg_errors, "sum_error_count": rule_sum_errors};
	})();
	
	let rules = default_rules;
	let current_rule = Object.keys(rules)[0];
	var global_bufferMessage = undefined;
	
	function copy_object(a) {
		return JSON.parse(JSON.stringify(a));
	}
	
	const defaultSettings = {
		selected_rule: undefined,
		chat: {
			enabled: false,
			autosend: false,
			subscribers: {},
			lastGameId: -1,
			notified: [],
		},
	};
	let settings = copy_object(defaultSettings);
	{
		let data;
		try {
			data = JSON.parse(localStorage.jsparser);
		}
		catch {
			data = defaultSettings;
		}
		if (typeof(data)!=="object") {
			data = defaultSettings;
		}
		if (!data.hasOwnProperty("selected_rule")) {
			data.selected_rule = defaultSettings.selected_rule;
		}
		if (!data.hasOwnProperty("chat")) {
			data.chat = copy_object(defaultSettings.chat);
		}
		// check if subset
		const result = Object.keys(defaultSettings.chat).every(val => Object.keys(data.chat).includes(val));
		if (!result) {
			data.chat = copy_object(defaultSettings.chat);
		}
		localStorage.jsparser = JSON.stringify(data);
		settings = copy_object(data);
	}
	
	function saveSettings() {
		localStorage.jsparser = JSON.stringify(settings);
		if (document.getElementById('kgjs_enabled_checkbox'))
			document.getElementById('kgjs_enabled_checkbox').checked = settings.chat.enabled;
	}
	
	function sendMessageToChat(msg) {
		console.log('JSPARSER sendMessageToChat', msg);
		if (!loaded) return;
		let full_msg = msg;
		
		let input = document.querySelectorAll('.chat')[1];
		let chatButton = document.getElementsByClassName("send")[1];
		if (settings.chat.enabled) {
			input.value = full_msg;
			chatButton.click();
		}
	}

	function work() {
	
	const database_name = "kgjs_base";
	
	if (!s1_loaded) return;
	if (!s2_loaded) return;
	if (!s3_loaded) return;
	if (!s5_loaded) return;
	
	if (!('indexedDB' in window)) {
		console.log('This browser doesn\'t support IndexedDB');
		return;
	}
	
	//https://github.com/jakearchibald/idb
	let this_id = undefined;
	let this_db = undefined;
	
	let dbPromise = undefined;
	
	function reopenDB() {
		dbPromise = idb.openDB(database_name, 1,
			{
				upgrade(db, oldVersion, newVersion, transaction) {
					this_db = db;
					this_id = undefined;
					if (!db.objectStoreNames.contains('games')) {
						db.createObjectStore('games', {keyPath: 'id', autoIncrement:true});
					}
				},
				blocked() {console.log("onblocked openDB");},
				blocking() {console.log("onblocking openDB"); this_id = undefined; this_db.close(); reopenDB();},
				terminated() {console.log("onterminated openDB"); this_id = undefined; this_db.close(); reopenDB();},
			}
		);
	};
	
	reopenDB();
	
	function updateDB() {
		dbPromise.then(async function(db) {
			this_db = db;
			let tx = db.transaction('games', 'readwrite');
			let store = tx.objectStore('games');
			let item = {
				created: new Date().getTime(),
				html: document.documentElement.outerHTML,
			};
			if (this_id)
				item.id = this_id;
			const value = await store.put(item);
			this_id = value;
			await tx.complete;
			updateTable(true);
		});
	}
	
	function clear() {
		parse_zip = false;
		if (!window.confirm("Do you really want to clear DB?")) return;
		this_id = undefined;
		dbPromise.then(async function(db) {
			db.close();
			await idb.deleteDB(database_name, {
				blocked() {
					console.log("blocked");
				},
			})
			reopenDB();
			updateTable(true);
		});
	}
	
	let init_table_scroll = false;
	function updateTable(scrollToEnd) {
		if (!dbPromise) return;
		dbPromise.then(async function(db) {
			const values = await db.getAll('games');
			let _t = $("kgjs_autosaves_table");
			let tr_id = "<tr>";
			let tr_time = "<tr>";
			for (let i=0; i<values.length; i++) {
				let _c = values[i];
				let _id = _c.id;
				tr_id += "<th>" + _id + "</th>";
				tr_time += "<td>" + (new Date(_c.created)).toLocaleTimeString('ru-RU') + "</td>";
			}
			tr_id += "</tr>";
			tr_time += "</tr>";
			_t.innerHTML = tr_id + tr_time;
			if ((!init_table_scroll) || (scrollToEnd)) {
				_t.scrollLeft = _t.scrollWidth;
				init_table_scroll = true;
			}
		});
	}
	
	function click_zip() {
		if (!dbPromise) return;
		dbPromise.then(async function(db) {
			const values = await db.getAll('games');
			let zip = new JSZip();
	
			for(let i=0; i<values.length; i++) {
				let _c = values[i];
				let _html = _c.html;
				// multiline [\s\S] instead of .
				_html = _html.replaceAll(/\<script id=\"__remove_this_kg([\s\S]*?)\<\/script\>/g, '');
				_html = _html.replaceAll(/type\-counter=\"scores\"\>(\d*?)\<\/span\>/g, 'type-counter="scores">0</span>');
				_html = _html.replaceAll(/\"pass\":\"(.*?)\"/g,'"pass":""');
	
				_html = _html.replaceAll(/var __remote_addr = \'(.*?)\';/g, 'var __remote_addr = \'\';');
				_html = _html.replaceAll(/var __csrftoken = \'(.*?)\';/g, 'var __csrftoken = \'\';');
				zip.file(_c.id+".html", _html);
			}
			zip.generateAsync({type:"blob", compression: "DEFLATE", compressionOptions: {level:9} })
			.then(function (blob) {
				saveAs(blob, "kgjsparser_"+(new Date()).toISOString() + ".zip");
			});
		});
	
	}
	
	function click_loadzip() {
		parse_zip = true;
	}
	
	function gen_image(input) {
		let el = input || document.getElementById('kgjs_calc_table');
		if (rules[current_rule].hasOwnProperty("tables")) {
			el = input || document.getElementById('kgjs_custom_block_'+current_rule);
		}
		let gen_image_tmp = el.style.overflow;
		el.style.overflow = "visible";
		domtoimage.toBlob(el).then(function (blob) {
			const blobUrl = URL.createObjectURL(blob);
			window.open(blobUrl, '_blank');
			el.style.overflow = gen_image_tmp;
		});
	}
	
	function chat_results() {
		if (global_bufferMessage == undefined) return;
		const total = kgjs_total_results;
		for(let i=0; i<total.length; i++) {
			const k = i;
			setTimeout(function(){global_bufferMessage(undefined, "** " + total[k] + " **");}, 2500*k);
		}
	}
	
	function chat_intresults() {
		console.log('JSPARSER chat_intresults', global_bufferMessage);
		if (global_bufferMessage == undefined) return;
		const inter = kgjs_inter_results || [];
		for(let i=0;i<inter.length;i++) {
			const k = i;
			const _msg = inter[k];
			setTimeout(function(){global_bufferMessage(undefined, "** " + _msg + " **");}, 2500*k);
		}
	}
	
	let injected_block_css = {};
	window.jsparser = {};
	window.jsparser.rules = {};
	window.jsparser.update_rules = function(){
		rules = {};
		for (const r of Object.keys(default_rules)) {
			rules[r] = default_rules[r];
		}
		for (const r of Object.keys(window.jsparser.rules)) {
			rules[r] = window.jsparser.rules[r];
		}
		let radios_html = "";
		radios_html += '<form>';
		for (let o in rules) {
			radios_html += '<label><input name="kgjs_rules" type="radio" value="'+o+'">'+o+'</label>';
		}
		radios_html += "</form>";
	
		for (let o in rules) {
			if (!injected_block_css.hasOwnProperty(o)) {
				let inject_css = document.createElement("style");
				inject_css.setAttribute("type", "text/css");
				inject_css.innerHTML = ''+
					'#kgjs_custom_block[class^="'+o+'"] > div[class^="'+o+'"] {'+
						'display: inline-block;'+
					'}';
				document.body.appendChild(inject_css);
				injected_block_css[o] = 1;
			}
		}
	
		let radios_elem = document.getElementById('kgjs_radios_form');
		radios_elem.innerHTML = radios_html;
		document.getElementById("kgjs_radios_form").kgjs_rules.value = current_rule;
		if (settings.selected_rule) {
			let new_current_rule = settings.selected_rule;
			if (new_current_rule != current_rule) {
				document.getElementById("kgjs_radios_form").kgjs_rules.value = new_current_rule;
				setRules(new_current_rule);
				calc();
			}
		}
	
	};
	
	
	if (settings.selected_rule) {
		current_rule = settings.selected_rule;
	}
	else {
		settings.selected_rule = current_rule;
		saveSettings();
	}
	
	try {
		command = rules[current_rule]["command"];
	}
	catch {
		current_rule = Object.keys(rules)[0];
		command = rules[current_rule]["command"];
	}
	
	function setRules(r) {
		current_rule = r;
		try {
			command = rules[current_rule]["command"];
		}
		catch {
			current_rule = Object.keys(rules)[0];
			command = rules[current_rule]["command"];
		}
	}
	
	let mainelem = document.createElement('div');
	mainelem.setAttribute('id', 'kgjs_main_block');
	mainelem.innerHTML = ""+
	'<div class="KGJS_tabs">'+
	'<input type="radio" name="KGJS_inset" value="" id="KGJS_htab_1" checked>'+
	'<label for="KGJS_htab_1">Autosaves</label>'+
	''+
	'<input type="radio" name="KGJS_inset" value="" id="KGJS_htab_2">'+
	'<label for="KGJS_htab_2">Parser</label>'+
	''+
	'<input type="radio" name="KGJS_inset" value="" id="KGJS_htab_3">'+
	'<label for="KGJS_htab_3">Chat</label>'+
	''+
	'<div id="KGJS_tab_1">'+
	'<table id="kgjs_autosaves_table"></table>'+
	'<div><button id="kgjs_autosaves_clear">Clear</button><button id="kgjs_autosaves_zip">Dnld Zip</button></div>'+
	'</div>'+
	''+
	'<div id="KGJS_tab_2">'+
	'<div><label for="kgjs_parser_loadzip">Load Zip:</label><input id="kgjs_parser_loadzip" type="file"></input></div>'+
	'<div style="max-width:500px;"><label for="kgjs_radios_form">Rules:</label><form id="kgjs_radios_form"></form></div>'+
	'<div><button id="kgjs_btn_hide_table">Hide/Show</button><button id="kgjs_btn_calc">Calc</button>'+
	'<button id="kgjs_btn_gen_image">Gen Image</button>'+
	'</div>'+
	''+
	'<div>'+
	'<table id="kgjs_calc_table"></table>'+
	'</div>'+
	'<div id="kgjs_custom_block"></div>'+
	'</div>'+
	''+
	'<div id="KGJS_tab_3">'+
	'<div><button id="kgjs_btn_chat_results">Chat res!</button><input id="kgjs_enabled_checkbox" type="checkbox"><label>Enabled</label></input>'+
	'<button id="kgjs_btn_chat_intresults">Chat intres</button><input id="kgjs_int_checkbox" type="checkbox"><label>Auto send results</label></input>'+
	'</div>'+
	'</div>'+
	''+
	'</div>';
	
	$(document.body).insert(mainelem);
	
	window.jsparser.update_rules();
	
	let cb = document.getElementById('kgjs_enabled_checkbox');
	cb.checked = settings.chat.enabled;
	let cb2 = document.getElementById('kgjs_int_checkbox');
	cb2.checked = settings.chat.autosend;
	
	function clickEnabled() {
		settings.chat.enabled = !settings.chat.enabled;
		saveSettings();
	}
	function clickAutosend() {
		settings.chat.autosend = !settings.chat.autosend;
		saveSettings();
	}
	function calc_save() {
		let r = document.getElementById("kgjs_radios_form").kgjs_rules.value;
		settings.selected_rule = r;
		saveSettings();
		calc();
	};
	
	document.getElementById("kgjs_autosaves_clear").onclick = clear;
	document.getElementById("kgjs_autosaves_zip").onclick = click_zip;
	document.getElementById("kgjs_enabled_checkbox").onclick = clickEnabled;
	document.getElementById("kgjs_int_checkbox").onclick = clickAutosend;
	document.getElementById("kgjs_btn_calc").onclick = calc_save;
	document.getElementById("kgjs_btn_gen_image").onclick = (x) => gen_image();
	document.getElementById("kgjs_btn_chat_results").onclick = chat_results;
	document.getElementById("kgjs_btn_chat_intresults").onclick = chat_intresults;
	document.getElementById("kgjs_radios_form").kgjs_rules.value = current_rule;
	
	let ziplist = [];
	$("kgjs_parser_loadzip").on("change", function(evt) {
		async function handleFile(f) {
			let zip =  await JSZip.loadAsync(f);
			ziplist = [];
			let zlist = zip.file(/.*/);
			let ziplist_size = zlist.length;
			function sortfilename(a,b) {
				let res = (a>b);
				try {
					res = parseInt(a.name) - parseInt(b.name);
				}
				catch (e) {};
				return res;
			}
			let zlist_sorted = zlist.sort((a,b) => sortfilename(a,b));
			zlist = zlist_sorted;
	
			for (let zfile of zlist) {
				let data = await zip.file(zfile.name).async("string");
				ziplist.push({html:data});
			}
			parse_zip = true;
			input_values = ziplist;
			calc();
		}
	
		let files = evt.target.files;
		for (let i=0; i < files.length; i++) {
			handleFile(files[i]);
		}
	});
	
	document.getElementById("kgjs_btn_hide_table").onclick = function(){
		$("kgjs_calc_table").style.display = ($("kgjs_calc_table").style.display === "none")?"inline-block":"none";
		$("kgjs_custom_block").style.display = ($("kgjs_custom_block").style.display === "none")?"inline-block":"none";
	};
	$("kgjs_calc_table").style.display = "none";
	$("kgjs_custom_block").style.display = "none";
	
	let inject_css = document.createElement("style");
	inject_css.setAttribute("type", "text/css");
	inject_css.innerHTML = ''+
	'div#kgjs_main_block {'+
		'left: 50%;'+
		'top: 0px;'+
		'z-index: 200;'+
		'background-color: gray;'+
		'position: absolute;'+
		'transform: translateX(-50%);'+
		'padding: 2px;'+
	'}'+
	
	'.KGJS_tabs { width: 100%; padding: 0px; margin: 0 auto; }'+
	'.KGJS_tabs>input { display: none; }'+
	'.KGJS_tabs>div {'+
		'display: none;'+
		'padding: 5px;'+
		'background-color: lightgray;'+
		'border-left: 0.3px solid gray;'+
		'border-right: 0.3px solid gray;'+
	'}'+
	'.KGJS_tabs>label {'+
		'display: inline-block;'+
		'padding: 7px;'+
		'margin-bottom: 0px;'+
		'text-align: center;'+
		'color: #666666;'+
		'background-color: silver;'+
		'border-left: 0.3px solid gray;'+
		'border-right: 0.3px solid gray;'+
		'cursor: pointer;'+
	'}'+
	'.KGJS_tabs>input:checked + label {'+
		'color: #000000;'+
		'background-color: lightgray;'+
	'}'+
	'.KGJS_tabs>label {'+
		'display: inline-block;'+
	'}'+
	'#KGJS_htab_3:checked ~ #KGJS_tab_3,'+
	'#KGJS_htab_2:checked ~ #KGJS_tab_2,'+
	'#KGJS_htab_1:checked ~ #KGJS_tab_1'+
	'{ display: block; }'+
	'.KGJS_tabs>div>div * {'+
		'margin-right: 5px;'+
	'}'+
	'.KGJS_tabs>div>*:not([style*="display: none"]) + *:not([style*="display: none"]) {'+
		'margin-top: 5px;'+
	'}'+
	'#kgjs_radios_form {'+
		'display: inline-block;'+
	'}'+
	
	
	'table#kgjs_autosaves_table {'+
		'width: 400px;'+
		'display: block;'+
		'overflow-x: auto;'+
		'font-family: Arial, Helvetica, sans-serif;'+
		'border-collapse: collapse;'+
	'}'+
	''+
	'#kgjs_autosaves_table td, #kgjs_autosaves_table th {'+
		'border: 1px solid #ddd;'+
		'padding: 8px;'+
	'}'+
	''+
	'#kgjs_autosaves_table tr:nth-child(even){background-color: #f2f2f2;}'+
	''+
	'#kgjs_autosaves_table tr:hover {background-color: #ddd;}'+
	''+
	'#kgjs_autosaves_table th {'+
		'padding-top: 12px;'+
		'padding-bottom: 12px;'+
		'text-align: center;'+
		'background-color: #4CAF50;'+
		'color: white;'+
	'}'+
	'#kgjs_parser_loadzip {'+
		'display: inline-block;'+
	'}'+
	'table#kgjs_calc_table {'+
		'max-width: 800px;'+
		'max-height: 800px;'+
		'overflow: auto;'+
	'}'+
	'table[id^=kgjs_calc_table] {'+
		'display: inline-block;'+
		'font-variant: normal;'+
		'font-family: Arial, Helvetica, sans-serif;'+
		'border-collapse: collapse;'+
	'}'+
	''+
	'table[id^=kgjs_calc_table] td, table[id^=kgjs_calc_table] th {'+
		'border-style: solid;'+
		'border-color: #000;'+
		'border-width: 1px;'+
		'padding: 4px;'+
		'white-space: nowrap;'+
		'text-align: center;'+
	'}'+
	'table[id^=kgjs_calc_table] td.kgjs-left-align, table[id^=kgjs_calc_table] th.kgjs-left-align {'+
		'text-align: left;'+
	'}'+
	'table[id^=kgjs_calc_table] .bg-title {'+
		'white-space: normal;'+
		'hyphens: manual;'+
		'overflow-wrap: break-word;'+
		'max-width: 50px;'+
		'background-color: #d9d9d9;'+
	'}'+
	''+
	'table[id^=kgjs_calc_table] tr {background-color: #f2f2f2;}'+
	'#kgjs_custom_block > div {'+
		'max-width: 800px;'+
		'max-height: 800px;'+
		'overflow: auto;'+
	'}'+
	'#kgjs_custom_block > div {'+
		'display: none;'+
	'}'+
	''+
	'td.rank-1 {background-color: #cccccc;}'+//?
	'td.rank-2 {background-color: #cc9999;}'+//?
	'td.rank-3 {background-color: #ccffcc;}'+
	'td.rank-4 {background-color: #ffff99;}'+
	'td.rank-5 {background-color: #ffcc99;}'+
	'td.rank-6 {background-color: #ff99cc;}'+
	'td.rank-7 {background-color: #cc99ff;}'+
	'td.rank-8 {background-color: #99ccff;}'+
	'td.rank-9 {background-color: #6699ff;}'+
	
	'';
	document.body.appendChild(inject_css);
	
	let firstunload = true;
	window.addEventListener('beforeunload', (event) => {
		try {
			if (firstunload) {
				firstunload = false;
				if (update_enabled) {
					if (saveTimer) {
						clearInterval(saveTimer);
						saveTimer = undefined;
					}
					updateDB();
				}
			}
		}
		catch (error) {
			console.error(error);
		}
	});
	
	let saveTimer = undefined;
	if (update_enabled2) {
		updateDB();
		saveTimer = setInterval(updateDB, 1000*10);
	}
	updateTable(true);
	
	/*
	 * parser
	 */
	
	function is_player_string(s) {
		return (s.search(/onmouseout=\"hideProfilePopup/) > -1);
	}
	
	function split_player_strings(s) {
		return s.split("div class=\"player");
	}
	
	function parse_name(s) {
		let m = s.match(/onmouseout=\"hideProfilePopup\([0-9]*\);\">(.*?)<\/a>/);
		if (m)
			return m[1];
		return null;
	}
	
	function parse_id(s) {
		let m = s.match(/onmouseout=\"hideProfilePopup\(([0-9]*)\);\">/);
		if (m)
			return m[1];
		return null;
	}
	
	function parse_error_percent(s) {
		let m = s.match(/ошиб.. \(<span class=\"bitmore\"><span class=\"bitmore\">(.*?)<\/span><\/span>%\)/);
		if (m)
			return parseFloat(m[1].replace(',','.'));
		return null;
	}
	
	function parse_error_count(s) {
		let m = s.match("<span class=\"bitmore\">([0-9]*)</span></span> ошиб");
		if (m)
			return parseInt(m[1]);
		return null;
	}
	
	function parse_speed(s) {
		let m = s.match("<span class=\"bitmore\"><span class=\"bitmore\">([0-9]*)</span></span> <span id=\"(.*?)\">зн/мин</span>");
		if (m)
			return parseInt(m[1]);
		return null;
	}
	
	function parse_place(s) {
		let m = s.match(">([0-9]*) место</ins>");
		if (m)
			return parseInt(m[1]);
		return null;
	}
	
	function parse_rank(s) {
		let m = s.match("class=\"rang([0-9]*) ");
		if (m)
			return parseInt(m[1]);
		return null;
	}
	
	function parse_award_mileage(s) {
		let m = s.match("за ([0-9]*) текстов пробега\">");
		if (m)
			return parseInt(m[1]);
		return null;
	}
	
	function parse_time(s) {
		let m = s.match("<div class=\"stats\" id=\"stats[0-9]*\"><div><span class=\"bitmore\"><span class=\"bitmore\">([0-9]*):([0-9]*)</span></span>\.([0-9]*)</div>");
		if (m)
			return parseInt(m[1])*60 + parseFloat(m[2]+"."+m[3]);
		return null;
	}
	
	function is_gamedesc_string(s) {
		return (s.search(/id=\"gamedesc\"/) > -1);
	}
	
	function parse_gamedesc(s) {
		let m = s.match("<td id=\"gamedesc\"><span class=\"gametype-(.*?)\">(.*?)</span>");
		if (m) {
			let _class = m[1];
			let _title = m[2];
			_title = _title.replaceAll('-', '\u2011'); // fix breaking words on hyphens when generating image
			if (_class == "voc") {
				let m2 = _title.match("/vocs/(\\d*?)/");
				_class = "voc" + (m2? "-" + m2[1].toString() : "");
			}
			return {"class": _class, "title": _title};
		}
		return null
	}
	
    function httpPostForm(url, formData) {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open("POST", url);
            xhr.onload = () => resolve(xhr.responseText);
            xhr.onerror = () => reject(logError(xhr.statusText));
            xhr.send(formData);
        });
    }

	async function getUserGameTypeMaxSpeedAsync(userId, gameType) {

        var formData = new FormData();

        formData.append("user_id", userId);
        formData.append("gametype", gameType);

        let url = location.protocol + '//klavogonki.ru/ajax/profile-popup';

        let htmlResult = await httpPostForm(url, formData);

        let speetTitle = '<th>Лучшая скорость:</th>';
        let indexSpeedTitle = htmlResult.indexOf(speetTitle);
        let indexSpeedUnit = htmlResult.indexOf(' зн/мин', indexSpeedTitle);
        let speed = htmlResult.substring(indexSpeedTitle + speetTitle.length + 6, indexSpeedUnit);

        return speed;

    }

	async function getUserEnRankAsync(userId) {

        var normalEnSpeed = await getUserGameTypeMaxSpeedAsync(userId, 'voc-5539');
		var rank = Math.floor(normalEnSpeed / 100) + 1;

        return rank;
    }

	function Table() {
		this.num_games = 0;
	
		this.add_missing_games = function(_id, n) {
			for (let k of Object.keys(this[_id])) {
				this[_id][k] = this[_id][k].concat(new Array(n).fill(null));
			}
		}
	
		this.add_this_game = function(data) {
			let _id = data["id"];
			for (let k of Object.keys(this[_id])) {
				this[_id][k] = this[_id][k].concat([data[k]]);
			}
		}
	
		this.add_new_id = function(data) {
			let _id = data["id"];
			this[_id] = {};
			for (let k of Object.keys(data)) {
				this[_id][k] = [];
			}
		}
	
		this.add_data = function(data) {
			let _id = data["id"];
			if (this.hasOwnProperty(_id)) {
				let missed_games_from_last_visit = data["game_number"] - this[_id]["id"].length - 1;
				if (missed_games_from_last_visit > 0)
					this.add_missing_games(_id, missed_games_from_last_visit);
				this.add_this_game(data);
			}
			else {
				this.add_new_id(data);
				this.add_missing_games(_id, data["game_number"]-1);
				this.add_this_game(data);
			}
		}
	
		this.add_missing_last_games = function() {
			for (let keyval of Object.entries(this)) {
				let _id = keyval[0];
				let value = keyval[1];
	
				if (_id == "num_games") continue;
				if (typeof value !== "object") continue;
	
				let missed_last_games = this.num_games - value["id"].length
				if (missed_last_games > 0)
					this.add_missing_games(_id, missed_last_games)
			}
		}
	
		this.calc_avg = function() {
			for (let keyval of Object.entries(this)) {
				let _id = keyval[0];
				let value = keyval[1];
	
				if (_id == "num_games") continue;
				if (typeof value !== "object") continue;
	
				let speed = value["speed"];
	
				let avg_speed = 0;
				let speed_n = speed.reduce((a, b) => a + ((b)?1:0), 0);
				if (speed_n > 0) {
					let speed_sum = speed.reduce((a, b) => a + b||0, 0);
					avg_speed = speed_sum/speed_n;
				}
				this[_id]["avg_speed"] = avg_speed;
				let error_percent = [];
				for (let _s of value["error_percent"]) {
					if (_s !== null) {
						error_percent.push(_s);
					} else {
						error_percent.push(Number.NaN);
					}
				}

				let error_count = [];
				for (let _s of value["error_count"]) {
					if (_s !== null) {
						error_count.push(_s);
					} else {
						error_count.push(Number.NaN);
					}
				}
				// не должно быть nan, а то сортировка не будет работать
				let avg_error_percent = Infinity;
				let sum_error_count = error_count.reduce((a, b) => a + (Number.isNaN(b)?0:b), 0);
				let error_n = error_percent.reduce((a, b) => a + (Number.isNaN(b)?0:1), 0);
				if (error_n > 0) {
					let error_sum = error_percent.reduce((a, b) => a + (Number.isNaN(b)?0.0:b), 0.0);
					avg_error_percent = error_sum/error_n;
				}
				
				this[_id]["avg_error_percent"] = avg_error_percent;
				this[_id]["sum_error_count"] = sum_error_count;
				this[_id]["num_finishes"] = speed_n;
			}
		}
		this.calc_avg_of_array = function(arr, def) {
			if (def===undefined) def = 0;
			let avg = def;
			let n = arr.reduce((a, b) => a + ((Number.isNaN(b)||b===null)?0:1), 0);
			if (n > 0) {
				let sum = arr.reduce((a, b) => a + ((Number.isNaN(b)||b===null)?0.0:b), 0.0);
				avg = sum/n;
			}
			return avg;
		}
		this.calc_finishes_of_array = function(arr) {
			let n = arr.reduce((a, b) => a + ((Number.isNaN(b)||b===null)?0:1), 0);
			return n;
		}
	}
	
	let input_values = [];
	async function parse() {
		let result = {};
		let errors = [];
		let table = new Table();
		if (!dbPromise) return;
		let values;
		if (!parse_zip) {
			let db = await dbPromise;
			values = await db.getAll('games');
		} else {
			values = input_values;
		}
		for (let i=0; i<values.length; i++) {
			let _file = i+1;
			let _c = values[i];
			let bu = _c.html.split("\n");
			table.num_games += 1;
			let players_in_this_race = [];
			let bad_players = 0;// учет задвоений
			let _data = "";
			for (let line of bu) {
				let data = {};
				if (is_gamedesc_string(line)) {
					let _gdesc = parse_gamedesc(line);
					if (_gdesc) {
						_data = _gdesc;
					}
				}
				if (!is_player_string(line))
					continue;
				let player_strings = split_player_strings(line);
	
				for (let s of player_strings) {
					if (!is_player_string(s)) continue;
					data["gamedesc"] = _data;
					data["name"] = parse_name(s);
					data["id"] = parse_id(s);
					data["error_percent"] = parse_error_percent(s);
					data["error_count"] = parse_error_count(s);
					data["speed"] = parse_speed(s);
					data["place"] = parse_place(s);
					data["rank"] = parse_rank(s);
					// data["rank"] = await getUserEnRankAsync(data['id']);
					data["award_mileage"] = parse_award_mileage(s);
					data["time"] = parse_time(s);
					data["game_number"] = table.num_games;
	
					if (!players_in_this_race.includes(data["name"])) {
						table.add_data(data);
						players_in_this_race.push(data["name"]);
					}
					else {
						console.log("WARNING: несколько игроков с одним ником в заезде "+ _file +" "+ data["name"]);
						bad_players += 1;
						data["id"] = -bad_players;
						data["name"] = data["name"]+"-BUG"+bad_players.toString();
						errors.push({"type":"doubling","num":bad_players,"id":data["id"],"name":data["name"]});
						table.add_data(data);
					}
				}
	
			}
		}
		table.add_missing_last_games();
		table.calc_avg();
		result["table"] = table;
		result["errors"] = errors;
		return result;
	}
	
	function items(a) {
		let res = [];
		for (let keyval of Object.entries(a)) {
			let _id = keyval[0];
			let value = keyval[1];
	
			if (!_id.match(/^\d+$/)) continue;
			if (typeof value !== "object") continue;
			res.push([_id,value]);
		}
		return res;
	}
	
	function list_get_last_not_none(_list) {
		let list_filtered = _list.filter(c => c!==null);
		if (list_filtered.length>0)
			return list_filtered[list_filtered.length-1];
		else
			return null;
	}
	
	function render_default_table_view(table, sort_func, columns , options={}) {
		let sorted_ids = items(table).sort((a,b) => -sort_func(a) + sort_func(b));
		let sorted_ids1 = sorted_ids.filter((c) => (!table[c[0]].hasOwnProperty("out")) || table[c[0]]["out"]==false);
		let sorted_ids2 = sorted_ids.filter((c) => (table[c[0]].hasOwnProperty("out")) && table[c[0]]["out"]==true);
		sorted_ids = sorted_ids1.concat(sorted_ids2);
		for (let _i=0;_i<sorted_ids.length;_i++) {
			let x = sorted_ids[_i];
			_id = x[0];
			table[_id]["sort_position"] = _i+1;
			if (_i>sorted_ids1.length-1)
				table[_id]["sort_position"] = "";
		}
		let out_table = [];
		let out_table_format = [];
		let custom_header = "";
		if ((columns.length>0) && (columns[0]["title"]=="custom")) {
			if (columns[0].hasOwnProperty("header")) {
				let h = columns[0]["header"];
				if (h.length > 0) {
					custom_header = h;
				}
			}
		}
		else {
			out_table.push(columns.map(_col => _col["title"] ));
			out_table_format.push(columns.map(_col => "bg-title" ));
		}
		for (let x of sorted_ids) {
			let _id = x[0];
			let out_row = [];
			let out_row_format = [];
			for (let _col of columns) {
				let f = _col["data"];
				let _c = f(table[_id]);
				if (_c===null) _c = "";
				if (Number.isNaN(_c)) _c= "";
	
				out_row.push(_c)
	
				let _r = list_get_last_not_none(table[_id]["rank"]);
				if (_col.hasOwnProperty("game")) {
					_r = table[_id]["rank"][_col["game"]];
					if (!_r)
						_r = list_get_last_not_none(table[_id]["rank"]);
				}
				if (_col.hasOwnProperty("add_class")) {
					let add_class = _col["add_class"];
					out_row_format.push("rank-"+_r+" "+add_class);
				} else {
					out_row_format.push("rank-"+_r);
				}
			}
			out_table.push(out_row);
			out_table_format.push(out_row_format);
		}
	
		let out_table_html = "";
		for (let i=0;i<out_table.length;i++) {
			let r = out_table[i];
			out_table_html += "<tr>";
			for (let j=0;j<r.length;j++) {
				let c = r[j];
				out_table_html += '<td class="'+out_table_format[i][j]+'">'+c+"</td>";
			}
			out_table_html += "</tr>";
			if ((i==sorted_ids1.length) && (sorted_ids2.length>0)) {
				out_table_html += "<tr><th colspan={colspan} class='bg-title'>Вне зачёта</th></tr>".replace("{colspan}",r.length);
			}
		}
		if (custom_header.length > 0)
			out_table_html = custom_header + out_table_html;
		return out_table_html;
	}
	
	
	// calc chat
	
	function gen_default_chat(table, sorted_ids, chat_format, options={}) {
		if (options.hasOwnProperty("re-sort") && options["re-sort"]==true) {
			for (let _i=0;_i<sorted_ids.length;_i++) {
				let x = sorted_ids[_i];
				_id = x[0];
				table[_id]["sort_position"] = _i+1;
			}
		}
		let out_chat_msg = "";
		out_chat_msg += chat_format["title"];
		let f = chat_format["data"];
		// for (let x of sorted_ids.slice(0,10)) {
		for (let x of sorted_ids) {
			let _id = x[0];
			let _c = f(table[_id]);
			if (_c===null) _c = "";
			if (Number.isNaN(_c)) _c= "";
	
			out_chat_msg += _c;
		}
	
		return out_chat_msg;
	}
	
	function gen_default_total(table, sorted_ids, chat_format, options={}) {
		if (options.hasOwnProperty("re-sort") && options["re-sort"]==true) {
			for (let _i=0;_i<sorted_ids.length;_i++) {
				let x = sorted_ids[_i];
				_id = x[0];
				table[_id]["sort_position"] = _i+1;
			}
		}
		let out_chat_msgs = [];
		let out_chat_msg = "";
		out_chat_msg += chat_format["title"];
		let f = chat_format["data"];
		let count = 0;
		for (let x of sorted_ids) {
			let _id = x[0];
			let _c = f(table[_id]);
			if (_c===null) _c = "";
			if (Number.isNaN(_c)) _c= "";
	
			out_chat_msg += _c;
			count += 1;
			if (count>9) {
				out_chat_msgs.push(out_chat_msg);
				count = 0;
				out_chat_msg = chat_format["title"];
			}
		}
		if (count>0)
			out_chat_msgs.push(out_chat_msg);
	
		return out_chat_msgs;
	}
	
	function gen_default_pers_chat(table, sorted_ids, chat_format, options={}) {
		if (options.hasOwnProperty("re-sort") && options["re-sort"]==true) {
			for (let _i=0;_i<sorted_ids.length;_i++) {
				let x = sorted_ids[_i];
				_id = x[0];
				table[_id]["sort_position"] = _i+1
			}
		}
		let out_chat_pers = {};
		let f = chat_format["data"];
		for (let x of sorted_ids) {
			let _id = x[0];
			let _c = f(table[_id]);
			if (_c===null) _c = "";
			if (Number.isNaN(_c)) _c= "";
	
			out_chat_pers[list_get_last_not_none(table[_id]["name"])] = _c;
		}
	
		return out_chat_pers;
	}
	
	
	async function calc() {
	
		setRules(document.getElementById("kgjs_radios_form").kgjs_rules.value);
	
	
		let res = await parse();
		let table = res["table"];
		let num_games = table.num_games
	
		function num_players(game) {
			let n=0;
			for (let _id of Object.keys(table)) {
				if (table[_id]["game_number"] && table[_id]["game_number"][game]) n+=1;
			}
			return n;
		}
		function gametype(game) {
			let n="";
			for (let _id of Object.keys(table)) {
				if (table[_id]["gamedesc"] && table[_id]["gamedesc"][game]) n=table[_id]["gamedesc"][game];
			}
			return n;
		}
		table.num_players = num_players;
		table.gametype = gametype;
		table.list_get_last_not_none = list_get_last_not_none;
	
		let valid_game_numbers = [];
		for (let i=0;i<num_games;i++) {
			let f = i+1;
			if (num_players(i)<1) continue;
	
			valid_game_numbers.push({"n":f,"i":i,"gametype":gametype(i)});
		}
		table.valid_game_numbers = valid_game_numbers;
		table.items = items;
		table.render_default_table_view = render_default_table_view;
		table.gen_image = gen_image;
		let chat_format = {"title":"Промежуточные результаты: ", "data": (x) => x["sort_position"]+". "+list_get_last_not_none(x["name"])+" ("+x["points"].toFixed(0)+"\u200C) "};
		table.default_chat_format = chat_format;
		table.gen_default_chat = gen_default_chat;
		table.gen_default_total = gen_default_total;
		table.gen_default_pers_chat = gen_default_pers_chat;
	
		let sort_func = (x) => x[1]["points"];
		if (rules[current_rule].hasOwnProperty("columns")) {
			let columns = rules[current_rule].columns(table);
			
			if(!columns.map) {
				columns = await columns;
			}

			if (rules[current_rule].hasOwnProperty("sort_func")) {
				sort_func = rules[current_rule].sort_func;
			}
	
			let html = render_default_table_view(table, sort_func, columns);
			let _t2 = $("kgjs_calc_table");
			_t2.innerHTML = html;
			_t2.className = current_rule;
			$("kgjs_custom_block").className = current_rule;
		}
		else if (rules[current_rule].hasOwnProperty("tables")) {
			let _t2 = $("kgjs_calc_table");
			_t2.innerHTML = "";
			_t2.className = current_rule;
			$("kgjs_custom_block").innerHTML = "<div></div>";
			$("kgjs_custom_block").className = current_rule;
			let html = "";
			for (let i=0; i<rules[current_rule].tables.length; i++) {
				let columns = rules[current_rule].tables[i].columns(table);
				if (rules[current_rule].tables[i].hasOwnProperty("sort_func")) {
					sort_func = rules[current_rule].tables[i].sort_func;
				}
	
				html = render_default_table_view(table, sort_func, columns);
	
				let el = document.createElement('table');
				el.setAttribute('id', 'kgjs_calc_table'+i.toString());
				el.innerHTML = html;
				el.className = current_rule;
	
				$("kgjs_custom_block").childElements()[0].append(el);
			}
			$("kgjs_custom_block").childElements()[0].className = current_rule;
			$("kgjs_custom_block").childElements()[0].setAttribute('id', 'kgjs_custom_block_'+current_rule);
		}
	
		if (!rules[current_rule].hasOwnProperty("chat") || !rules[current_rule].chat) return;
	
		let sorted_ids = items(table).sort((a,b) => -sort_func(a) + sort_func(b));
		let sorted_ids_filtered = sorted_ids.filter(c => table[c[0]]["points"]>0);
	
		let msgs = [gen_default_chat(table, sorted_ids_filtered, chat_format)];
	
		function pers_msgs(x, sorted_ids, options={}) {
	
			if (options.hasOwnProperty("re-sort") && options["re-sort"]==true) {
				for (let _i=0;_i<sorted_ids.length;_i++) {
					let _x = sorted_ids[_i];
					_id = _x[0];
					table[_id]["sort_position"] = _i+1;
				}
			}
	
			let first_string = "Обработан";
			let second_string = "заезд";
			let num_full_games = num_games-1;
			if (num_full_games>1)
				first_string += "о";
			if ((num_full_games == 2) || (num_full_games == 3) || (num_full_games ==4))
				second_string += "а";
			if (num_full_games > 4)
				second_string += "ов";
			let string_zaezdov = first_string+" "+num_full_games+" "+second_string+", ";
	
			let n = list_get_last_not_none(x["name"]);
			let _points = x["points"].toFixed(0);
			let _doezdov = x["num_finishes"];
			let _pos = x["sort_position"];
			let _i = _pos-1;
			let out_messages = [];
			out_messages.push("\u200C"+_pos+". "+n.replaceAll('_','\\_')+
				" ("+_points+"\u200C"+"). "+
				string_zaezdov +
				"доездов: "+_doezdov+"/"+num_full_games);
			if (_i+1>9) {
				let prev_id = sorted_ids[_i-1][0];
				let prev_n = list_get_last_not_none(table[prev_id]["name"]);
				let prev_points = table[prev_id]["points"].toFixed(0);
				let near = "Ближайшие соперники: "+_i+". "+
					prev_n.replaceAll('_','\\_')+
					" ("+prev_points+"\u200C"+"). "+
					(_i+1).toString()+". "+
					n.replaceAll('_','\\_')+
					" ("+_points+"\u200C"+"). ";
				if (_i+1<sorted_ids.length) {
					let next_id = sorted_ids[_i+1][0];
					let next_n = list_get_last_not_none(table[next_id]["name"]);
					let next_points = table[next_id]["points"];
					near = near +
						(_i+2).toString()+". "+
						next_n.replaceAll('_','\\_')+
						" ("+next_points+"\u200C"+"). ";
				}
				out_messages.push(near);
			}
			return out_messages;
	
		}
		let pers_chat_format = {"title:":"", "data": (x,_i=sorted_ids) => pers_msgs(x,_i)};
		let pers_chat_msgs = gen_default_pers_chat(table, sorted_ids, pers_chat_format);
	
		let chat_format_total = chat_format;
		chat_format_total["title"] = "Предварительные итоги: ";
		let sorted_ids_total = sorted_ids_filtered;
		let total_msgs = gen_default_total(table, sorted_ids_total, chat_format_total, {"re-sort":true});
	
		table.sorted_ids_filtered = sorted_ids_filtered;
		table.sorted_ids = sorted_ids;
		table.default_pers_msgs = pers_msgs;
	
		if (rules[current_rule].hasOwnProperty("chat_msgs")) {
			let res = rules[current_rule].chat_msgs(table);
			if (res.hasOwnProperty("total_msgs")) {
				total_msgs = res["total_msgs"];
			}
			if (res.hasOwnProperty("msgs")) {
				msgs = res["msgs"];
			}
			if (res.hasOwnProperty("pers_chat_msgs")) {
				pers_chat_msgs = res["pers_chat_msgs"];
			}
		}
	
		kgjs_pers_messages = pers_chat_msgs;
		kgjs_inter_results = msgs.map(x => x.replaceAll('_','\\_'));
		kgjs_total_results = total_msgs.map(x => x.replaceAll('_','\\_'));
	
		//console.log("kgjs_pers_messages", kgjs_pers_messages);
		//console.log("kgjs_inter_results", kgjs_inter_results);
		//console.log("kgjs_total_results", kgjs_total_results);
		chat();
	};
	calc();
	
	
	
	
	
	}
	
	var s = document.createElement("script");
	s.type = "text/javascript";
	s.src = "https://unpkg.com/idb@5/build/iife/index-min.js";
	var s1_loaded = false;
	s.onload = () => {s1_loaded = true; work() };
	document.body.append(s);
	
	var s2 = document.createElement("script");
	s2.type = "text/javascript";
	s2.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.5.0/jszip.min.js";
	var s2_loaded = false;
	s2.onload = () => {s2_loaded = true; work() };
	document.body.append(s2);
	
	var s3 = document.createElement("script");
	s3.type = "text/javascript";
	s3.src = "https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.0/FileSaver.min.js";
	var s3_loaded = false;
	s3.onload = () => {s3_loaded = true; work() };
	document.body.append(s3);
	
	var s5 = document.createElement("script");
	s5.type = "text/javascript";
	s5.src = "https://cdnjs.cloudflare.com/ajax/libs/dom-to-image/2.6.0/dom-to-image.min.js";
	//s5.src = "https://cdn.jsdelivr.net/npm/dom-to-image-more@2.9.5/dist/dom-to-image-more.min.js";
	var s5_loaded = false;
	s5.onload = () => {s5_loaded = true; work() };
	document.body.append(s5);
	
	
	/*    CHAT
	 */
	
	let SubscribedUserListObj = {};
	SubscribedUserListObj = copy_object(settings.chat.subscribers);
	
	var chat_init = 0;
	function chat() {
		if (chat_init) return;
		chat_init = 1;
	
		function subscribeUser(n) {
			console.error("subscribe user: "+n);
			let SubscribedUserList = copy_object(SubscribedUserListObj[current_rule] || []);
			if (SubscribedUserList.indexOf(n) !== -1) {
				console.error("subscribe user: "+n+" already subscribed");
				sendMessage(n, "Вы уже подписаны" );
				return;
			}
			SubscribedUserList.push(n);
			SubscribedUserListObj[current_rule] = copy_object(SubscribedUserList);
			settings.chat.subscribers = copy_object(SubscribedUserListObj);
			saveSettings();
			console.error("subscribed users: "+SubscribedUserList);
			sendMessage(n, "Подписка включена" );
		}
	
		function unsubscribeUser(n) {
			console.error("unsubscribe user: "+n);
			let SubscribedUserList = copy_object(SubscribedUserListObj[current_rule] || []);
			let i = SubscribedUserList.indexOf(n);
			if (i == -1) {
				console.error("subscribe user: "+n+" no such user");
				sendMessage(n, "Вы ещё не подписаны" );
				return;
			}
			SubscribedUserList.splice(i,1);
			SubscribedUserListObj[current_rule] = copy_object(SubscribedUserList);
			settings.chat.subscribers = copy_object(SubscribedUserListObj);
			saveSettings();
			console.error("subscribed users: "+SubscribedUserList);
			sendMessage(n, "Подписка выключена" );
		}
	
		function sendMessage(n, msg) {
			console.log('PARSER sendMessage', n, msg);
			if (!loaded) return;
			let full_msg;
			if (n===undefined) {
				full_msg = msg;
			} else {
				full_msg = "<"+n+"> "+msg;
			}
			let input = document.querySelectorAll('.text')[1];
			let chatButton = document.getElementsByClassName("send")[1];
			if (settings.chat.enabled) {
				input.value = full_msg;
				chatButton.click();
			}
		}
	
		var msg_buffer = [];
		function bufferMessage(n,msg) {
			msg_buffer.push({"name":n,"msg":msg});
		}
		global_bufferMessage = bufferMessage;
		setTimeout(function runSendBufferMsgsMIG() {
			if (!loaded) {
				setTimeout(runSendBufferMsgsMIG, 1000);
				return;
			}
			for(let i=0;i<6;i++) {
				if (msg_buffer.length<1) {
					setTimeout(runSendBufferMsgsMIG, 1000);
					return;
				}
				let item = msg_buffer[0];
				sendMessage(item.name, item.msg);
				msg_buffer.splice(0,1);
			};
			setTimeout(runSendBufferMsgsMIG, 1000);
		},1000);
	
		function sendStatus(name) {
			let currentResultArray = kgjs_pers_messages[name];
			if (currentResultArray===undefined) currentResultArray=[];
			for(let i=0;i<currentResultArray.length;i++) {
				bufferMessage(name, currentResultArray[i]);
			}
			let inter = kgjs_inter_results || [];
			for(let i=0;i<inter.length;i++) {
				let k=i;
				bufferMessage(name, inter[k]);
			}
		}
	
		function chatUsers() {
			let _userListContainer = document.querySelectorAll('.userlist')[1];
			let _users = [];
			let _userN = _userListContainer.childElements()[0].childElementCount;
			if (_userN < 1) return [];
			for(let _j=0;_j<_userN;_j++) {
				_users.push(_userListContainer.childElements()[0].childElements()[_j].childElements()[0].innerHTML);
			}
			return _users;
		}
	
		function notifySubscribers() {
			if (settings.selected_rule && (settings.selected_rule != current_rule)) return;
	
			//todo rework (sending message with inter results)
			{
				let userName = "$results_message";
				//let __chat_users = chatUsers();
				if (settings.chat.notified.indexOf(userName)==-1) {
					let inter = kgjs_inter_results || [];
					for(let i=0;i<inter.length;i++) {
						let k = i;
						let _msg = inter[k];
						//let _msg = "!"+inter[k].replace(/_/g,'\\\\\\\\\\\\_');
						//setTimeout(function(){bufferMessage("МиГоМан", _msg);}, 1000+(2500*k));
						if (settings.chat.autosend)
							setTimeout(function(){global_bufferMessage(undefined, "** " + _msg + " **");}, 2500*k);
					}
					settings.chat.notified.push(userName);
					saveSettings();
				}
			}
	
			let SubscribedUserList = copy_object(SubscribedUserListObj[current_rule] || []);
			for (let i=0; i<SubscribedUserList.length; i++) {
				let userName = SubscribedUserList[i];
	
				let users = chatUsers();
				if (users.indexOf(userName)==-1) continue;
				if (settings.chat.notified.indexOf(userName)>-1) continue;
	
				sendStatus(userName);
				settings.chat.notified.push(userName);
				saveSettings();
			}
		}
	
		/* monitoring */
		setTimeout(function runMonitorChat() {
	
			let messages = document.querySelectorAll('.chat .messages-content p');
			for(let i=0; i<messages.length; i++) {
				if (messages[i].hasAttribute('kgjs_checked')) { continue; }
	
				let message = messages[i];
				messages[i].setAttribute('kgjs_checked', 'value');
				let chatTime = message.textContent.split(']')[0].substring(1);
				let userName = message.textContent.split('>')[0].substring(chatTime.length + 3);
				let messageText = message.textContent.replace("[" + chatTime + "]", "").replace("<" + userName + ">", "");
	
				if (command.length<1) continue;
				if ((messageText == "[шепчет вам]"+command+" инфо вкл\n")||(messageText == ""+command+" инфо вкл\n")||(messageText == my_nick+", "+command+" инфо вкл\n"))
					subscribeUser(userName);
				if ((messageText == "[шепчет вам]"+command+" инфо выкл\n")||(messageText == ""+command+" инфо выкл\n")||(messageText == my_nick+", "+command+" инфо выкл\n"))
					unsubscribeUser(userName);
				if ((messageText == "[шепчет вам]"+command+" инфо\n")||(messageText == ""+command+" инфо\n")||(messageText == my_nick+", "+command+" инфо\n"))
					sendStatus(userName);
				if ((messageText == "[шепчет вам]"+command+" инфо помощь\n")||(messageText == ""+command+" инфо помощь\n")||(messageText == my_nick+", "+command+" инфо помощь\n")) {
					if (userName===my_nick) userName = undefined;
					bufferMessage(userName, ("**<{}> "+command+" инфо вкл** - включение подписки; **<{}> "+command+" инфо выкл** - отключение подписки; **<{}> "+command+" инфо** - текущие промежуточные результаты; **<{}> "+command+" инфо помощь** - это сообщение").replace("{}",my_nick) );
				}
				if ((messageText == "[шепчет вам]"+command+" инфо реклама\n")||(messageText == ""+command+" инфо реклама\n")) {
					if (userName===my_nick) userName = undefined;
					bufferMessage(userName, ":excl: `Реклама`: подпишись на промежуточные результаты! Для включения подписки отправь мне личное сообщение в чате: **<"+my_nick+"> "+command+" инфо вкл**" );
				}
				if ((messageText == "[шепчет вам]"+command+" инфо стоп\n")||(messageText == ""+command+" инфо стоп\n")) {
					if (userName===my_nick) {
						settings.chat.enabled = false;
						saveSettings();
					}
				}
				if ((messageText == "[шепчет вам]"+command+" инфо старт\n")||(messageText == ""+command+" инфо старт\n")) {
					if (userName===my_nick) {
						settings.chat.enabled = true;
						saveSettings();
					}
				}
				if ((messageText == "[шепчет вам]"+command+" инфо итоги\n")||(messageText == ""+command+" инфо итоги\n")) {
					if (userName===my_nick) {
						const total = kgjs_total_results;
						for(let i=0;i<total.length;i++) {
							let k=i;
							setTimeout(function(){bufferMessage(undefined, total[k]);}, 2500*k);
						}
					}
				}
				if ((messageText == "[шепчет вам]"+command+" инфо резы\n")||(messageText == ""+command+" инфо резы\n")) {
					if (userName===my_nick) {
						let inter = kgjs_inter_results || [];
						for(let i=0;i<inter.length;i++) {
							let k=i;
							let _msg = inter[k];
							setTimeout(function(){bufferMessage(undefined, _msg);}, 2500*k);
						}
					}
				}
			}
	
			setTimeout(runMonitorChat, 300);
		}, 300);
	
		var loaded = false;
		var my_nick = "$$";
		var interval = setInterval(function() {
			if (loaded) return;
			if (document.readyState === 'complete') {
				let users = document.querySelectorAll('ins[class*=user]');
				if (users.length < 1) return;
				loaded = true;
				clearInterval(interval);
				let gameId = null;
				let room = undefined;
				my_nick = angular.element(document.body).injector().get("Me").login;
				if (room = location.href.match(/^https?:\/\/klavogonki\.ru\/g\/?\?gmid=([\d]{5})/)) {
					gameId = room[1];
				}
				if ((!!gameId)&&(gameId!==settings.chat.lastGameId)) {
					settings.chat.notified = [];
					settings.chat.lastGameId = gameId;
					saveSettings();
					setTimeout(function timerNotify() {
						notifySubscribers();
						setTimeout(timerNotify, 300);
					}, 300);
				}
			}
		}, 1000);
	}
	/* END CHAT
	 */
	
	})();
	
	
	