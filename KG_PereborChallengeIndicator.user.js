// ==UserScript==
// @name           KG_PereborChallengeIndicator
// @version        0.0.4
// @namespace      klavogonki
// @author         vnest
// @description    Индикатор выполненной за сутки нормы 90/95% от рекорда (или поставленного рекорда) у игроков во время заезда
// @include        http*://klavogonki.ru/g/*
// @grant          none
// ==/UserScript==

(async function() {
    'use strict';

    // fill with needed colors and coefficient
    // must be in decreasing order - once matched subsequent won't be checked
    const targetSpeeds = {
        "red" : 1,
        "green" : 0.95,
        "blue" : 0.90
    };

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

        let userDayStats = await httpGet(location.protocol + '//klavogonki.ru/api/profile/get-stats-details-data?userId=' + userId + '&gametype=' + gameType + '&fromDate=' + today + '&toDate=' + today + '&grouping=day');

        console.debug('user ' + userId + ' day stats', userDayStats);

        if(userDayStats.list.length === 0) {
            return;
        }

        let userStatsToday = userDayStats.list[0];
        let userMaxSpeedToday = userStatsToday.max_speed;

        for (let keyColor of Object.keys(targetSpeeds)){
            let userTargetSpeed = Math.ceil(userBestSpeed*targetSpeeds[keyColor]);
            console.debug('target speed for ' + keyColor, userTargetSpeed);
            let userSpeedAchieved = userMaxSpeedToday >= userTargetSpeed;

            if(userSpeedAchieved) {
                let indicatorExists = carRatingElement.querySelectorAll('.perebor').length > 0;
                if(indicatorExists) {
                    console.debug('Indicator for user ' + userId + ' already exists');
                    break;
                }
                let pereborIndicator = '<span class="perebor" style="color: ' + keyColor + ';"> * <span>';
                carRatingElement.insert(pereborIndicator);
                break; // stop checking subsequent targets
            }
        };
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
            console.debug('playerElementId', playerElementId);
            let playerElement = document.querySelector(playerElementId);

            if(!playerElement) {
                console.debug('cannot find car element for user ' + userId + ', skipping the user');
                continue;
            }

            console.debug('playerElement', playerElement);
            let carRatingElement = playerElement.querySelector(".car_rating");

            await processUserStat(userId, userBestSpeed, carRatingElement);
        }
    }

    var playersObserverConfig = { childList: true };
    let playersElement = document.querySelector('#players'); 

    let statusObserverConfig = { attributes: true };
    let statusElement = document.querySelector('#status');

    const playersCallback = async function(mutationsList, observer) {
        for(let mutation of mutationsList) {
            console.debug('mutation', mutation);

            for (let addedNode of mutation.addedNodes) {
                console.debug('addedNode', addedNode);
                let recordElement = addedNode.querySelector('.newrecord');
                console.debug('recordElement', recordElement);

                let newPlayerSpanElement = recordElement.querySelector('span');

                // guest player
                if(!newPlayerSpanElement) {
                    continue;
                }

                console.debug('newPlayerSpanElement', newPlayerSpanElement);

                let attrWithUserId = newPlayerSpanElement.getAttribute('ng:show');
                console.debug('attrWithUserId', attrWithUserId);
                let userId = attrWithUserId.substring(attrWithUserId.indexOf('[') + 1, attrWithUserId.indexOf(']'));
                console.debug('userId', userId);

                let carRatingElement = addedNode.querySelector('.car_rating');

                await loadAndProcessUserStat(userId, carRatingElement);
            }
        }
    };

    let playersObserver = new MutationObserver(playersCallback);
    playersObserver.observe(playersElement, playersObserverConfig);

    const statusCallback = async function(mutationsList, observer) {
        if(mutationsList.length === 0) {
            return;
        }
        let raceStatus = mutationsList[0].target.className;

        // stop watching DOM once the race has been started, so no new players can join
        if(raceStatus === 'go') {
            playersObserver.disconnect();
            observer.disconnect();
        }
    };

    let statusObserver = new MutationObserver(statusCallback);
    statusObserver.observe(statusElement, statusObserverConfig);

    await initIndicators();
})();
