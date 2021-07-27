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


    async function init() {
        let searchParams = new URLSearchParams(window.location.search);
        if(!searchParams.has("gmid")) {
            return;
        }

        // console.debug('game', game);

        let gameId = searchParams.get('gmid');
        console.debug('gameId ', gameId);

        let info = await httpGet(location.protocol + '//klavogonki.ru/g/' + gameId + '.info');

        console.debug('game info', info);

        let gameType = info.params.gametype;

        console.debug('game type', gameType);

        let today = (new Date()).toISOString().slice(0, 10);

        console.debug('today', today);

        for (let player of info.players) {
            console.debug('player', player);
            let user = player.user;
            
            if(!user) {
                continue;
            }
            
            let userId = user.id;
            let userBestSpeed = user.best_speed;
            let user95Speed = Math.ceil(userBestSpeed*0.95);
            let user90Speed = Math.ceil(userBestSpeed*0.90);

            let userStats = await httpGet(location.protocol + '//klavogonki.ru/api/profile/get-stats-details-data?userId=' + userId + '&gametype=' + gameType + '&fromDate=' + today + '&toDate=' + today + '&grouping=day');

            console.debug('user ' + player.name + ' stats', userStats);

            if(userStats.list.length === 0) {
                continue;
            }

            let userStatsToday = userStats.list[0];
            let userMaxSpeedToday = userStatsToday.max_speed;

            let userBestSpeedAchieved = userMaxSpeedToday >= userBestSpeed;
            let user95SpeedAchieved = userMaxSpeedToday >= user95Speed;
            let user90SpeedAchieved = userMaxSpeedToday >= user90Speed;

            if(!userBestSpeedAchieved && !user95SpeedAchieved && !user90SpeedAchieved) {
                continue;
            }

            let color = userBestSpeedAchieved ? "red" :
                user95SpeedAchieved ? "green" :
                user90SpeedAchieved ? "blue" : undefined;

            let pereborIndicator = '<span style="color: ' + color + ';"> * <span>';

            let playerElementId = '#player' + player.id;
            let playerElement = document.querySelector(playerElementId);
            console.debug('playerElement', playerElement);
            let carRatingElement = playerElement.querySelector(".car_rating");
            console.debug('carRatingElement', carRatingElement);
            carRatingElement.insert(pereborIndicator);

        }
    }

    let racingElement = document.querySelector('#racing');

    while(isHidden(racingElement)) {
        console.debug('racing not started, waiting 1 second...');
        await sleep(1000);
    }

    init();
})();
