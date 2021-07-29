// ==UserScript==
// @name           KG_PereborChallengeIndicator
// @version        0.2.1
// @namespace      klavogonki
// @author         vnest
// @description    Индикатор выполненной за сутки нормы 90/95% от рекорда (или поставленного рекорда) у игроков во время заезда
// @include        http*://klavogonki.ru/g/*
// @grant          none
// ==/UserScript==

(async function () {
    'use strict';

    ///////////////////////////////////////////////////////////////////////////////
    // Настройки
    ///////////////////////////////////////////////////////////////////////////////

    // Поменяйте на нужные вам цвета (могут быть в формате HEX например "#FF0000")
    // и коэффициенты, можно, например, оставить только 0.95, или, наоборот добавить 0.85
    // Нужно обязательно указать в убывающем порядке, иначе скрипт будет работать некорректно
    const targetSpeeds = {
        "red": 1,
        "green": 0.95,
        "blue": 0.90
    };

    // Оставьте пустым, если хотите чтобы скрипт работал во всех режимах
    // Пропишите режимы, если хотите ограничить работу скрипта только для них
    //
    // Обычный - "normal"
    // Безошибочный - "noerror"
    // Буквы - "chars"
    // Марафон - "marathon"
    // Спринт - "sprint"
    // Абракадабра - "abra"
    // Цифры - "digits"
    // Яндекс.Рефераты - "referats"
    // По словарю - "voc-XXXX", где XXXX - номер словаря (виден в адресной строке), например Соточка - "voc-25856"
    //
    // Пример для обычного и обычного in English - const gameTypes = ["normal", "voc-5539"];
    const gameTypes = [];

    // Настройка включает загрузку детальной статистики и отображение расширенного индикатора, показывающего количество соответствующих достижений
    // Детальная статистика за день доступна только у пользователей c премиум-аккаунтами
    // Установите false вместо true, чтобы отключить попытки загузки такой статистики, и всегда показывать только базовый индикатор в виде одной звездочки
    const enableDetailedStats = true;

    ///////////////////////////////////////////////////////////////////////////////
    // Конец настроек
    ///////////////////////////////////////////////////////////////////////////////

    let searchParams = new URLSearchParams(window.location.search);
    if (!searchParams.has("gmid")) {
        return;
    }

    let gameId = searchParams.get('gmid');
    let info = await httpGet(location.protocol + '//klavogonki.ru/g/' + gameId + '.info');
    let gameType = info.params.gametype;

    if (!gameType) {
        gameType = info.params.gametype_clean;
    }

    if (!gameType) {
        return;
    }

    if (gameTypes.length && !gameTypes.includes(gameType)) {
        console.debug('Stop executing for game type ' + gameType);
        return;
    }

    // let today = (new Date()).toISOString().slice(0, 10);
    // hack - fr-CA gives ISO format yyyy-MM-dd
    let today = (new Date()).toLocaleString('fr-CA', { timeZone: 'Europe/Moscow' }).slice(0, 10);

    function httpGet(url) {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open("Get", url);
            xhr.onload = () => resolve(JSON.parse(xhr.responseText));
            xhr.onerror = () => reject(console.log(xhr.statusText));
            xhr.send();
        });
    }

    async function loadAndProcessUserStat(userId, ratingElement) {
        let userStats = await httpGet(location.protocol + '//klavogonki.ru/api/profile/get-stats-details?userId=' + userId + '&gametype=' + gameType);
        if (!userStats.info) {
            console.debug('statistics is closed for user ' + userId);
            return;
        }
        let userBestSpeed = userStats.info.best_speed;

        await processUserStat(userId, userBestSpeed, ratingElement);
    }

    async function processUserStat(userId, userBestSpeed, carRatingElement) {

        if (enableDetailedStats) {
            let userDayDetailedStats = await httpGet(location.protocol + '//klavogonki.ru/api/profile/get-stats-details-data?userId=' + userId + '&gametype=' + gameType + '&fromDate=' + today + '&toDate=' + today + '&grouping=none');

            if (!userDayDetailedStats.list) {
                console.debug('detailed statistics is not enabled for user ' + userId + '. Proceeding with regular statistics');
                await processRegularUserStat(userId, userBestSpeed, carRatingElement);
            } else {

                let indicatorExists = carRatingElement.querySelectorAll('.perebor').length > 0;
                if (indicatorExists) {
                    console.warn('Indicator for user ' + userId + ' already exists');
                    return;
                }
                let dayResults = {};
                for (let listItem of userDayDetailedStats.list) {
                    for (let keyColor of Object.keys(targetSpeeds)) {
                        let userTargetSpeed = Math.ceil(userBestSpeed * targetSpeeds[keyColor]);

                        let userSpeedAchieved = listItem.speed >= userTargetSpeed;

                        if (userSpeedAchieved) {
                            if (!dayResults[keyColor]) {
                                dayResults[keyColor] = 0;
                            }
                            dayResults[keyColor]++;
                        }
                    };
                }

                for (let keyColor of Object.keys(dayResults)) {
                    if (!dayResults[keyColor]) {
                        continue;
                    }
                    let pereborIndicator = '<span class="perebor" style="color: ' + keyColor + ';"> ' + dayResults[keyColor] + '* <span>';
                    carRatingElement.insert(pereborIndicator);
                }
            }

        } else {
            await processRegularUserStat(userId, userBestSpeed, carRatingElement);
        }
    }

    async function processRegularUserStat(userId, userBestSpeed, carRatingElement) {
        let userDayStats = await httpGet(location.protocol + '//klavogonki.ru/api/profile/get-stats-details-data?userId=' + userId + '&gametype=' + gameType + '&fromDate=' + today + '&toDate=' + today + '&grouping=day');

        if (!userDayStats.list) {
            console.debug('statistics is closed for user ' + userId);
            return;
        }

        if (userDayStats.list.length === 0) {
            return;
        }

        let userStatsToday = userDayStats.list[0];
        let userMaxSpeedToday = userStatsToday.max_speed;

        for (let keyColor of Object.keys(targetSpeeds)) {
            let userTargetSpeed = Math.ceil(userBestSpeed * targetSpeeds[keyColor]);
            let userSpeedAchieved = userMaxSpeedToday >= userTargetSpeed;

            if (userSpeedAchieved) {
                let indicatorExists = carRatingElement.querySelectorAll('.perebor').length > 0;
                if (indicatorExists) {
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
            let user = player.user;

            if (!user) {
                continue;
            }

            let userId = user.id;
            let userBestSpeed = user.best_speed;

            let playerElementId = '#player' + player.id;

            let playerElement = document.querySelector(playerElementId);

            if (!playerElement) {
                console.error('cannot find car element for user ' + userId + ', skipping the user');
                console.debug('playerElementId', playerElementId);
                console.debug('player', player);
                continue;
            }

            let carRatingElement = playerElement.querySelector(".car_rating");

            await processUserStat(userId, userBestSpeed, carRatingElement);
        }
    }

    var playersObserverConfig = { childList: true };
    let playersElement = document.querySelector('#players');

    let statusObserverConfig = { attributes: true };
    let statusElement = document.querySelector('#status');

    const playersCallback = async function (mutationsList, observer) {
        for (let mutation of mutationsList) {

            for (let addedNode of mutation.addedNodes) {
                let recordElement = addedNode.querySelector('.newrecord');
                let newPlayerSpanElement = recordElement.querySelector('span');

                // guest player
                if (!newPlayerSpanElement) {
                    console.debug('Guest player joined, skipping');
                    continue;
                }

                let attrWithUserId = newPlayerSpanElement.getAttribute('ng:show');

                let userId = attrWithUserId.substring(attrWithUserId.indexOf('[') + 1, attrWithUserId.indexOf(']'));
                if (!userId) {
                    console.error('cannot find userId for added car element', addedNode);
                    console.debug('mutation', mutation);
                    console.debug('attrWithUserId', attrWithUserId);
                    console.debug('newPlayerSpanElement', newPlayerSpanElement);
                    console.debug('recordElement', recordElement);
                }

                let carRatingElement = addedNode.querySelector('.car_rating');

                await loadAndProcessUserStat(userId, carRatingElement);
            }
        }
    };

    let playersObserver = new MutationObserver(playersCallback);
    playersObserver.observe(playersElement, playersObserverConfig);

    const statusCallback = async function (mutationsList, observer) {
        if (mutationsList.length === 0) {
            return;
        }
        let raceStatus = mutationsList[0].target.className;

        // stop watching DOM once the race has been started, so no new players can join
        if (raceStatus === 'go') {
            playersObserver.disconnect();
            observer.disconnect();
        }
    };

    let statusObserver = new MutationObserver(statusCallback);
    statusObserver.observe(statusElement, statusObserverConfig);

    await initIndicators();
})();
