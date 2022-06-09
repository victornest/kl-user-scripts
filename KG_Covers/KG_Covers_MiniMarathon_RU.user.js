// ==UserScript==
// @name           KG_Covers_MiniMarathon_RU
// @version        0.0.1
// @namespace      klavogonki
// @author         vnest
// @description    Скрипт добавляет обложки для текстов из словаря "Мини-марафон, 800 знаков"
// @include        http*://klavogonki.ru/g/*
// @grant          none
// ==/UserScript==

(async function () {
    'use strict';

    ///////////////////////////////////////////////////////////////////////////////
    // Настройки
    ///////////////////////////////////////////////////////////////////////////////

    ///////////////////////////////////////////////////////////////////////////////
    // Конец настроек
    ///////////////////////////////////////////////////////////////////////////////

    const localStorageName = "KG_Covers.MiniMarathon.RU";

    // словарь обложек, ключ - первые 200 символов текста.

    const coversMap = {
        "В те времена, когда из Петербурга по железной дороге можно было доехать только до Москвы, а от Москвы, извиваясь желтой лентой среди зеленых полей, шли по разным направлениям шоссе в глубь России, – к": {
            "author": "Алексей Апухтин",
            "title": "Неоконченная повесть",
            "cover": "https://i.imgur.com/krUpn66.jpg?1"
        }
    };

    localStorage[localStorageName] = JSON.stringify(coversMap);
    // localStorage[localStorageName] = coversMapJson;
})();
