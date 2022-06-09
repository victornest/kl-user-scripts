// ==UserScript==
// @name           KG_Covers_MiniMarathon_EN
// @version        0.0.1
// @namespace      klavogonki
// @author         vnest
// @description    Скрипт добавляет обложки для текстов из словаря "Мини-марафон in English"
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

    const localStorageName = "KG_Covers.MiniMarathon.EN";

    // словарь обложек, ключ - первые 200 символов текста.

    const coversMap = {
        "I was a birch tree, white slenderness in the middle of a meadow, but had no name for what I was. My leaves drank of the sunlight that streamed through them and set their green aglow, my leaves danced ": {
            "author": "Poul Anderson",
            "title": "The Avatar",
            "cover": "https://i.imgur.com/i6dvup3.jpg?1"
        }
    };

    localStorage[localStorageName] = JSON.stringify(coversMap);
    // localStorage[localStorageName] = coversMapJson;
})();
