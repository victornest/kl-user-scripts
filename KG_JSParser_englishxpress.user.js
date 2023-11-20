// ==UserScript==
// @name           KG_JSParser_migoman_en
// @version        1.0.0
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

	rule_migoman.columns = (table) => {

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
		columns.push({"title":"Ник","data": (x) => table.list_get_last_not_none(x["name"]),"add_class":"kgjs-left-align"});
		columns.push({"title":"Результат","data": (x) => x["points"].toFixed(0)})
		for (const f of table.valid_game_numbers) {
			columns.push({"title":f.n.toString()+"\n"+f.gametype.title,"data": (x,_i=f.i) => x["speed"][_i],"game":f.i});
		}
		return columns;
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

		// let sorted_ids_total_sup = sorted_ids_filtered.filter(c => parseInt(list_get_last_not_none(table[c[0]]["rank"])) == 7);
		// let sorted_ids_total_man = sorted_ids_filtered.filter(c => parseInt(list_get_last_not_none(table[c[0]]["rank"])) == 6);
		// let sorted_ids_total_rac = sorted_ids_filtered.filter(c => parseInt(list_get_last_not_none(table[c[0]]["rank"])) == 5);
		let sorted_ids_total_all = sorted_ids_filtered; // todo filter english ranks >= taxidrivers
		// let chat_format_total_sup = copy_chat_format(chat_format);
		// let chat_format_total_man = copy_chat_format(chat_format);
		// let chat_format_total_rac = copy_chat_format(chat_format);
		let chat_format_total_all = copy_chat_format(chat_format);
		// chat_format_total_sup["title"] = "Предварительные итоги (супермены): ";
		// chat_format_total_man["title"] = "Предварительные итоги (маньяки): ";
		// chat_format_total_rac["title"] = "Предварительные итоги (гонщики): ";
		chat_format_total_all["title"] = "Preliminary results: ";
		// let total_msgs_sup = gen_default_total(table, sorted_ids_total_sup, chat_format_total_sup, {"re-sort":true});
		// let total_msgs_man = gen_default_total(table, sorted_ids_total_man, chat_format_total_man, {"re-sort":true});
		// let total_msgs_rac = gen_default_total(table, sorted_ids_total_rac, chat_format_total_rac, {"re-sort":true});
		let total_msgs_all = gen_default_total(table, sorted_ids_total_all, chat_format_total_all, {"re-sort":true});
		let total_msgs = total_msgs_all; //total_msgs_sup.concat(total_msgs_man).concat(total_msgs_rac);

		// let chat_format_sup = copy_chat_format(chat_format);
		// let chat_format_man = copy_chat_format(chat_format);
		// let chat_format_rac = copy_chat_format(chat_format);
		let chat_format_all = copy_chat_format(chat_format);
		// chat_format_sup["title"] = "Промежуточные результаты (супермены): ";
		// chat_format_man["title"] = "Промежуточные результаты (маньяки): ";
		// chat_format_rac["title"] = "Промежуточные результаты (гонщики): ";
		chat_format_all["title"] = "Intermediate results (all ranks): ";
		// let msgs_sup = gen_default_chat(table, sorted_ids_total_sup, chat_format_sup, {"re-sort":true});
		// let msgs_man = gen_default_chat(table, sorted_ids_total_man, chat_format_man, {"re-sort":true});
		// let msgs_rac = gen_default_chat(table, sorted_ids_total_rac, chat_format_rac, {"re-sort":true});
		let msgs_all = gen_default_chat(table, sorted_ids_total_all, chat_format_all, {"re-sort":true});
		// let msgs = [msgs_sup, msgs_man, msgs_rac];
		let msgs = [msgs_all];

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


