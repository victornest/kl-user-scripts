// ==UserScript==
// @name           KG_PreResultsBot
// @version        0.0.1
// @namespace      klavogonki
// @author         vnest
// @description    Бот-помощник который сам заходит в заезды по приглашениям и выдает предрезы в чат
// @include        http*://klavogonki.ru/g/*
// @include        http*://klavogonki.ru/gamelist/
// @include        http*://klavogonki.ru/
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

    function getLogMessage(message) {
        return "KG_PreResultsBot: " + message;
    }

    function logDebug(message) {
        console.debug(getLogMessage(message));
    }

    function logDebug(message, parameters) {
        console.debug(getLogMessage(message), parameters);
    }

    function logMessage(message) {
        console.log(getLogMessage(message));
    }

    function logMessage(message, parameters) {
        console.log(getLogMessage(message), parameters);
    }

    function logWarning(message) {
        console.warn(getLogMessage(message));
    }

    function logWarning(message, parameters) {
        console.warn(getLogMessage(message), parameters);
    }

    function logError(message) {
        console.error(getLogMessage(message));
    }

    function logError(message, parameters) {
        console.error(getLogMessage(message), parameters);
    }

    function sleep (milliseconds) {
        return new Promise((resolve) => setTimeout(resolve, milliseconds))
    }

    var timer = setInterval(function() {
        logDebug('timer tick');
		let notificationBarElement = document.querySelector('.notification-bar');
        logDebug('notificationBarElement', notificationBarElement);
        let notificationBarElementHidden = notificationBarElement.offsetParent == null;

        logDebug('notificationBarElementHidden', notificationBarElementHidden);

        if (!notificationBarElementHidden) {
            clearInterval(timer);
            logMessage('found invitation');
            let acceptInviteButton = notificationBarElement.querySelectorAll('div > button')[0];
            logDebug('found accept invitation button', acceptInviteButton);
            acceptInviteButton.click();
        }
	}, 500);

})();
