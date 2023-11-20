// ==UserScript==
// @name           KG_JSParser_migoman_en
// @version        1.0.4
// @namespace      klavogonki
// @author         NIN
// @description    JSParser подсчёт для English MiGoMan
// @include        http*://klavogonki.ru/*
// @grant          none
// ==/UserScript==

(function() {
	console.log("load jsparser migoman");

	let groupByF = function(xs, keyF) {
	return xs.reduce(function(rv, x) {
			(rv[keyF(x)] = rv[keyF(x)] || []).push(x);
			return rv;
		}, {});
	};

	let max_in_group = function(x,g) {
		let s = [];
		for (let _g in g) {
			if (!g.hasOwnProperty(_g)) continue;
			s.push(x["speed"][g[_g]["i"]]);
		}
		let _max = Math.max(...s);
		return _max;
	};

	const get_koeff = function(g) {
		return 1;
	}

	let rule_migoman = {};
	rule_migoman.command = "мигоман";
	rule_migoman.chat = true;

	rule_migoman.columns = async (table) => {

		if (!$("kgjs_custom_block_migoman_en")) {
			let el = document.createElement('div');
			el.setAttribute('id', 'kgjs_custom_block_migoman_en');
			el.innerHTML = ''+
			  '<div>'+
			    '<button id="kgjs_migoman_en_cache">Drop rank cache</button>'+
			  '</div>'
			'';

			el.className = "migoman_en";
			$("kgjs_custom_block").append(el);
			document.getElementById("kgjs_migoman_en_cache").onclick = function(){cache_ranks={};localStorage.xpressranks = "";};
		}

		await loadRanks(table);
		let groups = groupByF(table.valid_game_numbers, (x)=>x["gametype"].class);
		for (let _i of table.items(table)) {
			let _id = _i[0];
			let _value = _i[1];
			let sum = 0;
			for (let g in groups) {
				sum += max_in_group(table[_id], groups[g])*get_koeff(g);
			}
			table[_id]["points"] = sum;
		}

		let columns=[];
		columns.push({"title":"№","data": (x) => x["sort_position"]});
		columns.push({"title":"ID","data": (x) => table.list_get_last_not_none(x["id"])});
		columns.push({"title":"Ник","data": (x) => table.list_get_last_not_none(x["name"]),"add_class":"kgjs-left-align"});
		columns.push({"title":"Результат","data": (x) => x["points"].toFixed(0)})
		for (const f of table.valid_game_numbers) {
			columns.push({"title":f.n.toString()+"\n"+f.gametype.title,"data": (x,_i=f.i) => x["speed"][_i],"game":f.i});
		}
		return columns;
			// return resolve(columns);
	};

	rule_migoman.chat_msgs = (table) => {

		function copy_chat_format(f) {
			let _f = {};
			for (let o in f) {
				_f[o] = f[o];
			}
			return _f;
		}

		let list_get_last_not_none = table.list_get_last_not_none;
		let sorted_ids_filtered = table.sorted_ids_filtered;
		let sorted_ids = table.sorted_ids;
		let chat_format = table.default_chat_format;

		let gen_default_total = table.gen_default_total;
		let gen_default_chat = table.gen_default_chat;
		let gen_default_pers_chat = table.gen_default_pers_chat;

		let sorted_ids_total_xtr = sorted_ids_filtered.filter(c => parseInt(list_get_last_not_none(table[c[0]]["rank"])) == 9);
		let sorted_ids_total_cyb = sorted_ids_filtered.filter(c => parseInt(list_get_last_not_none(table[c[0]]["rank"])) == 8);
		let sorted_ids_total_sup = sorted_ids_filtered.filter(c => parseInt(list_get_last_not_none(table[c[0]]["rank"])) == 7);
		let sorted_ids_total_man = sorted_ids_filtered.filter(c => parseInt(list_get_last_not_none(table[c[0]]["rank"])) == 6);
		let sorted_ids_total_rac = sorted_ids_filtered.filter(c => parseInt(list_get_last_not_none(table[c[0]]["rank"])) == 5);
		let sorted_ids_total_pro = sorted_ids_filtered.filter(c => parseInt(list_get_last_not_none(table[c[0]]["rank"])) == 4);
		let sorted_ids_total_tax = sorted_ids_filtered.filter(c => parseInt(list_get_last_not_none(table[c[0]]["rank"])) == 3);
		let sorted_ids_total_all = sorted_ids_filtered; // todo filter english ranks >= taxidrivers
		let chat_format_total_xtr = copy_chat_format(chat_format);
		let chat_format_total_cyb = copy_chat_format(chat_format);
		let chat_format_total_sup = copy_chat_format(chat_format);
		let chat_format_total_man = copy_chat_format(chat_format);
		let chat_format_total_rac = copy_chat_format(chat_format);
		let chat_format_total_pro = copy_chat_format(chat_format);
		let chat_format_total_tax = copy_chat_format(chat_format);
		let chat_format_total_all = copy_chat_format(chat_format);
		chat_format_total_xtr["title"] = "Extracybers: ";
		chat_format_total_cyb["title"] = "Cyberracers: ";
		chat_format_total_sup["title"] = "Supermen: ";
		chat_format_total_man["title"] = "Maniacs: ";
		chat_format_total_rac["title"] = "Racers: ";
		chat_format_total_pro["title"] = "Pros: ";
		chat_format_total_tax["title"] = "Taxidrivers: ";
		chat_format_total_all["title"] = "Preliminary results (all ranks): ";
		let total_msgs_xtr = gen_default_total(table, sorted_ids_total_xtr, chat_format_total_xtr, {"re-sort":true});
		let total_msgs_cyb = gen_default_total(table, sorted_ids_total_cyb, chat_format_total_cyb, {"re-sort":true});
		let total_msgs_sup = gen_default_total(table, sorted_ids_total_sup, chat_format_total_sup, {"re-sort":true});
		let total_msgs_man = gen_default_total(table, sorted_ids_total_man, chat_format_total_man, {"re-sort":true});
		let total_msgs_rac = gen_default_total(table, sorted_ids_total_rac, chat_format_total_rac, {"re-sort":true});
		let total_msgs_pro = gen_default_total(table, sorted_ids_total_pro, chat_format_total_pro, {"re-sort":true});
		let total_msgs_tax = gen_default_total(table, sorted_ids_total_tax, chat_format_total_tax, {"re-sort":true});
		let total_msgs_all = gen_default_total(table, sorted_ids_total_all, chat_format_total_all, {"re-sort":true});
		let total_msgs = total_msgs_all
			.concat(sorted_ids_total_xtr.length > 0 ? total_msgs_xtr : [])
			.concat(sorted_ids_total_cyb.length > 0 ? total_msgs_cyb : [])
			.concat(sorted_ids_total_sup.length > 0 ? total_msgs_sup : [])
			.concat(sorted_ids_total_man.length > 0 ? total_msgs_man : [])
			.concat(sorted_ids_total_rac.length > 0 ? total_msgs_rac : [])
			.concat(sorted_ids_total_pro.length > 0 ? total_msgs_pro : [])
			.concat(sorted_ids_total_tax.length > 0 ? total_msgs_tax : []);

		let chat_format_xtr = copy_chat_format(chat_format);
		let chat_format_cyb = copy_chat_format(chat_format);
		let chat_format_sup = copy_chat_format(chat_format);
		let chat_format_man = copy_chat_format(chat_format);
		let chat_format_rac = copy_chat_format(chat_format);
		let chat_format_pro = copy_chat_format(chat_format);
		let chat_format_tax = copy_chat_format(chat_format);
		let chat_format_all = copy_chat_format(chat_format);
		chat_format_xtr["title"] = "Extracybers: ";
		chat_format_cyb["title"] = "Cyberracers: ";
		chat_format_sup["title"] = "Supermen: ";
		chat_format_man["title"] = "Maniacs: ";
		chat_format_rac["title"] = "Racers: ";
		chat_format_pro["title"] = "Pros: ";
		chat_format_tax["title"] = "Taxidrives: ";
		chat_format_all["title"] = "Intermediate results (all ranks): ";
		let msgs_xtr = gen_default_chat(table, sorted_ids_total_xtr, chat_format_xtr, {"re-sort":true});
		let msgs_cyb = gen_default_chat(table, sorted_ids_total_cyb, chat_format_cyb, {"re-sort":true});
		let msgs_sup = gen_default_chat(table, sorted_ids_total_sup, chat_format_sup, {"re-sort":true});
		let msgs_man = gen_default_chat(table, sorted_ids_total_man, chat_format_man, {"re-sort":true});
		let msgs_rac = gen_default_chat(table, sorted_ids_total_rac, chat_format_rac, {"re-sort":true});
		let msgs_pro = gen_default_chat(table, sorted_ids_total_pro, chat_format_pro, {"re-sort":true});
		let msgs_tax = gen_default_chat(table, sorted_ids_total_tax, chat_format_tax, {"re-sort":true});
		let msgs_all = gen_default_chat(table, sorted_ids_total_all, chat_format_all, {"re-sort":true});
		// let msgs = [msgs_sup, msgs_man, msgs_rac];
		let msgs = [];

		if(table.num_games <= 18) {
			if(sorted_ids_total_all.length > 0) msgs.push(msgs_all);
			if(sorted_ids_total_xtr.length > 0) msgs.push(msgs_xtr);
			if(sorted_ids_total_cyb.length > 0) msgs.push(msgs_cyb);
			if(sorted_ids_total_sup.length > 0) msgs.push(msgs_sup);
			if(sorted_ids_total_man.length > 0) msgs.push(msgs_man);
			if(sorted_ids_total_rac.length > 0) msgs.push(msgs_rac);
			if(sorted_ids_total_pro.length > 0) msgs.push(msgs_pro);
			if(sorted_ids_total_tax.length > 0) msgs.push(msgs_tax);
		}

		// let pers_chat_format_sup = {"title:":"", "data": (x,_i=sorted_ids_total_sup) => table.default_pers_msgs(x,_i)};
		// let pers_chat_format_man = {"title:":"", "data": (x,_i=sorted_ids_total_man) => table.default_pers_msgs(x,_i)};
		// let pers_chat_format_rac = {"title:":"", "data": (x,_i=sorted_ids_total_rac) => table.default_pers_msgs(x,_i)};
		let pers_chat_format_all = {"title:":"", "data": (x,_i=sorted_ids_total_all) => table.default_pers_msgs(x,_i)};
		// let pers_chat_msgs_sup = gen_default_pers_chat(table, sorted_ids_total_sup, pers_chat_format_sup, {"re-sort":true});
		// let pers_chat_msgs_man = gen_default_pers_chat(table, sorted_ids_total_man, pers_chat_format_man, {"re-sort":true});
		// let pers_chat_msgs_rac = gen_default_pers_chat(table, sorted_ids_total_rac, pers_chat_format_rac, {"re-sort":true});
		let pers_chat_msgs_all = gen_default_pers_chat(table, sorted_ids_total_all, pers_chat_format_all, {"re-sort":true});
		let pers_chat_msgs = {};
		// for (let x in pers_chat_msgs_sup) pers_chat_msgs[x] = pers_chat_msgs_sup[x];
		// for (let x in pers_chat_msgs_man) pers_chat_msgs[x] = pers_chat_msgs_man[x];
		// for (let x in pers_chat_msgs_rac) pers_chat_msgs[x] = pers_chat_msgs_rac[x];
		for (let x in pers_chat_msgs_all) pers_chat_msgs[x] = pers_chat_msgs_all[x];

		let ret = {};
		ret["total_msgs"] = total_msgs;
		ret["msgs"] = msgs;
		ret["pers_chat_msgs"] = pers_chat_msgs;
		return ret;
	};

	function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	let cache_ranks = {};
	try {
		cache_ranks = JSON.parse(localStorage.migoman_en_ranks);
	}
	catch {
	}
	let popup_url = location.protocol+"//klavogonki.ru/ajax/profile-popup?user_id={}&gametype=voc-5539";

	async function loadRanks(table) {
		table.items(table).forEach((x) => table[x[0]]["rank"]=[0]);
		for (let _i of table.items(table)) {
			let _id = _i[0];
			let _value = _i[1];
			let popup = cache_ranks[_id];
			let match = false;
			if (popup)
				match = popup.match(/Лучшая скорость\:([\s\S]*?)(\d+) зн\/мин\<\/td\>/);
			if (match) {
				let speed = match[2];
				let rank = Math.trunc(speed/100)+1;
				if (rank>9) rank=9;
				table[_id]["rank"] = [rank];
			}
		}
		await getRanks(table);
	}

	async function getRanks(table) {
		for (let _i of table.items(table)) {
			let _id = _i[0];
			let _value = _i[1];
			if (!cache_ranks.hasOwnProperty(_id) || cache_ranks[_id]=="You are sending requests too fast!") {

				try {
					console.log("getting rank: "+_id);
					let response = await fetch(popup_url.replace("{}",_id));
					let data = await response.text();
					cache_ranks[_id] = data;
					await sleep(100);
				}
				catch (error) {
					console.log("error: "+error);
				}
			}
		}
		localStorage.migoman_en_ranks = JSON.stringify(cache_ranks);
	}

setTimeout(function main() {
	if (window.hasOwnProperty("jsparser")
	    && window.jsparser.hasOwnProperty("rules")
	    && window.jsparser.hasOwnProperty("update_rules")
	    && !window.jsparser.rules.hasOwnProperty("migoman"))
	{
		window.jsparser.rules.migoman = rule_migoman;
		window.jsparser.update_rules();
	} else {
		setTimeout(main, 1000);
	}
}, 1000);

})();


