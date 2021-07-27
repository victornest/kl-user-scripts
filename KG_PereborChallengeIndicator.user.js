// ==UserScript==
// @name           KG_PereborChallengeIndicator
// @version        0.0.1
// @namespace      klavogonki
// @author         vnest
// @description    Индикатор выполненной за сутки нормы 90/95% от рекорда (или поставленного рекорда) у игроков во время заезда
// @include        http*://klavogonki.ru/g/*
// @grant          none
// ==/UserScript==

(async function() {
    'use strict';

    let today = (new Date()).toISOString().slice(0, 10);

    let searchParams = new URLSearchParams(window.location.search);
    if(!searchParams.has("gmid")) {
        return;
    }

    let gameId = searchParams.get('gmid');
    console.debug('gameId ', gameId);

    let info = await httpGet(location.protocol + '//klavogonki.ru/g/' + gameId + '.info');

    console.debug('game info', info);

    let gameType = info.params.gametype;

    if(!gameType) {
        gameType = info.params.gametype_clean;
    }

    if(!gameType) {
        return;
    }

    console.debug('game type', gameType);

    function httpGet(url) {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open("Get", url);
            xhr.onload = () => resolve(JSON.parse(xhr.responseText));
            xhr.onerror = () => reject(console.log(xhr.statusText));
            xhr.send();
        });
    }

    function isHidden(el) {
        var style = window.getComputedStyle(el);
        return (style.display === 'none')
    }

    function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    async function loadAndProcessUserStat(userId, ratingElement){
        let userStats = await httpGet(location.protocol + '//klavogonki.ru/api/profile/get-stats-details?userId=' + userId + '&gametype=' + gameType);
        if(!userStats.info) {
            console.debug('statistics is closed for user ' + userId);
            return;
        }
        let userBestSpeed = userStats.info.best_speed;

        await processUserStat(userId, userBestSpeed, ratingElement);
    }

    async function processUserStat(userId, bestSpeed, carRatingElement){
        let userStats = await httpGet(location.protocol + '//klavogonki.ru/api/profile/get-stats-details?userId=' + userId + '&gametype=' + gameType);
        if(!userStats.info) {
            console.debug('statistics is closed for user ' + userId);
            return;
        }

        let userBestSpeed = userStats.info.best_speed;

        let user95Speed = Math.ceil(userBestSpeed*0.95);
        let user90Speed = Math.ceil(userBestSpeed*0.90);

        let userDayStats = await httpGet(location.protocol + '//klavogonki.ru/api/profile/get-stats-details-data?userId=' + userId + '&gametype=' + gameType + '&fromDate=' + today + '&toDate=' + today + '&grouping=day');

        console.debug('user ' + userId + ' day stats', userDayStats);

        if(userDayStats.list.length === 0) {
            return;
        }

        let userStatsToday = userDayStats.list[0];
        let userMaxSpeedToday = userStatsToday.max_speed;

        let userBestSpeedAchieved = userMaxSpeedToday >= userBestSpeed;
        let user95SpeedAchieved = userMaxSpeedToday >= user95Speed;
        let user90SpeedAchieved = userMaxSpeedToday >= user90Speed;

        if(!userBestSpeedAchieved && !user95SpeedAchieved && !user90SpeedAchieved) {
            return;
        }

        let color = userBestSpeedAchieved ? "red" :
        user95SpeedAchieved ? "green" :
        user90SpeedAchieved ? "blue" : undefined;

        let pereborIndicator = '<span class="perebor" style="color: ' + color + ';"> * <span>';

        carRatingElement.insert(pereborIndicator);
    }


    async function initIndicators() {

        for (let player of info.players) {
            console.debug('player', player);
            let user = player.user;

            if(!user) {
                continue;
            }

            let userId = user.id;
            let userBestSpeed = user.best_speed;

            let playerElementId = '#player' + player.id;
            let playerElement = document.querySelector(playerElementId);
            console.debug('playerElement', playerElement);
            let carRatingElement = playerElement.querySelector(".car_rating");

            await processUserStat(userId, userBestSpeed, carRatingElement);
        }
    }

    var config = { childList: true };

    let playersElement = document.querySelector('#players'); 

    let racingElement = document.querySelector('#racing');

    const callback = async function(mutationsList, observer) {
        for(let mutation of mutationsList) {
            console.debug('mutation', mutation);

            for (let addedNode of mutation.addedNodes) {
                console.debug('addedNode', addedNode);
                let recordElement = addedNode.querySelector('.newrecord');
                console.debug('recordElement', recordElement);

                let newRacingSpanElement = recordElement.querySelector('span');

                // guest player
                if(!newRacingSpanElement) {
                    continue;
                }

                console.debug('newRacingSpanElement', newRacingSpanElement);

                let attrWithUserId = newRacingSpanElement.getAttribute('ng:show');
                console.debug('attrWithUserId', attrWithUserId);
                let userId = attrWithUserId.substring(attrWithUserId.indexOf('[') + 1, attrWithUserId.indexOf(']'));
                console.debug('userId', userId);

                let carRatingElement = addedNode.querySelector('.car_rating');

                await loadAndProcessUserStat(userId, carRatingElement);
            }
        }
    }

    let observer = new MutationObserver(callback);
    observer.observe(playersElement, config);

    await initIndicators();
})();
