// ==UserScript==
// @name           KG_PereborChallengeIndicator
// @version        1.1.1
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
    // Дополнительно тут указываются heroChar символы, которые будут отображаться за достижение заданных скоростей определнное количество дней подряд
    const targetSpeeds = {
        "red": {
            "coeff": 1,
            "heroChar": "✪"
        },
        "green": {
            "coeff": 0.95,
            "heroChar": "@"
        },
        "blue": {
            "coeff": 0.90,
            "heroChar": "#"
        },
        // "orange": {
        //     "coeff": 0.75,
        //     "heroChar": "#"
        // },
        // "yellow": {
        //     "coeff": 0.50,
        //     "heroChar": "#"
        // }
    };

    // Настройка включает дополнительный индикатор за достижение заданных скоростей определнное количество дней подряд
    const enableStraightDaysIndicator = true;
    // Поменяйте на нужные вам цвета и количество дней подряд, в течение которых будет отслеживаться достижений заданных скоростей
    const straightDaysColors = {
        "#fb031a": 30,
        "#fb03f2": 20,
        "#fba103": 13,
        "#14fb03": 8,
        "#fbf803": 5,
        "#06cdf8": 3,
        "white": 2
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

    let bestSpeedByUser = {};

    function getLogMessage(message) {
        return "KG_PereborChallengeIndicator: " + message;
    }

    function logDebug(message, parameters) {
        console.debug(getLogMessage(message), parameters)
    }

    function logMessage(message, parameters) {
        console.log(getLogMessage(message), parameters)
    }

    function logWarning(message, parameters) {
        console.warn(getLogMessage(message), parameters)
    }

    function logError(message, parameters) {
        console.error(getLogMessage(message), parameters)
    }

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
        logDebug('Stop executing for game type ' + gameType);
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
            xhr.onerror = () => reject(logError(xhr.statusText));
            xhr.send();
        });
    }

    async function processUserStat(userId, playerElement) {

        let carRatingElement = playerElement.querySelector(".car_rating");


        let userGameBasicStats = await httpGet(location.protocol + '//klavogonki.ru/api/profile/get-stats-details?userId=' + userId + '&gametype=' + gameType);
        if (!userGameBasicStats.info) {
            if (userGameBasicStats.err === 'invalid gametype') {
                logDebug('first race in this mode for user ' + userId);
            } else {
                logDebug('statistics is closed for user ' + userId);
                let closedIndicator = '<span class="perebor-closed" style="color: black;"> ✖ <span>';
                if (!carRatingElement) {
                    let topAwardElement = playerElement.querySelector(".top-award");
                    let carRatingHtml = '<div class="car_rating"></div>';
                    topAwardElement.insert(carRatingHtml);
                    carRatingElement = playerElement.querySelector(".car_rating");
                }

                let indicatorExists = carRatingElement.querySelectorAll('.perebor-closed').length > 0;
                if (!indicatorExists) {
                    carRatingElement.insert(closedIndicator);
                }
            }
            return false;
        }

        let userBestSpeed = userGameBasicStats.info.best_speed;
        bestSpeedByUser[userId] = userBestSpeed;

        if (!carRatingElement) {
            logDebug('no races recently in this mode for user ' + userId);
            return true; // statistics is old, but exists and opened, can be new achievements
        }

        let userDayStats = await httpGet(location.protocol + '//klavogonki.ru/api/profile/get-stats-details-data?userId=' + userId + '&gametype=' + gameType + '&fromDate=' + today + '&toDate=' + today + '&grouping=day');

        if (enableDetailedStats) {
            let userDayDetailedStats = await httpGet(location.protocol + '//klavogonki.ru/api/profile/get-stats-details-data?userId=' + userId + '&gametype=' + gameType + '&fromDate=' + today + '&toDate=' + today + '&grouping=none');

            if (!userDayDetailedStats.list) {
                logDebug('detailed statistics is not enabled for user ' + userId + '. Proceeding with regular statistics');
                await processRegularUserStat(userId, userBestSpeed, carRatingElement, userDayStats);
            } else {

                let indicatorExists = carRatingElement.querySelectorAll('.perebor').length > 0;
                if (indicatorExists) {
                    logWarning('Indicator for user ' + userId + ' already exists');
                    return true;
                }
                let dayResults = {};
                for (let listItem of userDayDetailedStats.list) {
                    for (let keyColor of Object.keys(targetSpeeds)) {
                        let targetSpeedItem = targetSpeeds[keyColor];
                        let userTargetSpeed = Math.ceil(userBestSpeed * targetSpeedItem.coeff);

                        let userSpeedAchieved = listItem.speed >= userTargetSpeed;

                        if (userSpeedAchieved) {
                            if (!dayResults[keyColor]) {
                                dayResults[keyColor] = 0;
                            }
                            dayResults[keyColor]++;
                            break;
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
            await processRegularUserStat(userId, userBestSpeed, carRatingElement, userDayStats);
        }

        if (enableStraightDaysIndicator) {
            try {
                await processStraghtDaysAchievements(userId, carRatingElement, userGameBasicStats, userDayStats);
            } catch (error) {
                logError('Error on processing straghtDaysAchievements for user ' + userId, error);
                logDebug('carRatingElement', carRatingElement);
                logDebug('userGameBasicStats', userGameBasicStats);
                logDebug('userDayStats', userDayStats);
            }
        }

        return true;
    }

    async function processRegularUserStat(userId, userBestSpeed, carRatingElement, userDayStats) {

        if (!userDayStats.list) {
            logDebug('statistics is closed for user ' + userId);
            return;
        }

        if (userDayStats.list.length === 0) {
            return;
        }

        let userStatsToday = userDayStats.list[0];
        let userMaxSpeedToday = userStatsToday.max_speed;

        for (let keyColor of Object.keys(targetSpeeds)) {
            let targetSpeedItem = targetSpeeds[keyColor];
            let userTargetSpeed = Math.ceil(userBestSpeed * targetSpeedItem.coeff);
            let userSpeedAchieved = userMaxSpeedToday >= userTargetSpeed;

            if (userSpeedAchieved) {
                let indicatorExists = carRatingElement.querySelectorAll('.perebor').length > 0;
                if (indicatorExists) {
                    logDebug('Indicator for user ' + userId + ' already exists');
                    break;
                }
                let pereborIndicator = '<span class="perebor" style="color: ' + keyColor + ';"> * <span>';
                carRatingElement.insert(pereborIndicator);
                break; // stop checking subsequent targets
            }
        };
    }

    async function processStraghtDaysAchievements(userId, carRatingElement, userGameBasicStats, userTodayStats) {
        let straightDaysColorsKeys = Object.keys(straightDaysColors);
        let maxLookupDays = straightDaysColors[straightDaysColorsKeys[0]];
        let date = new Date(today);

        let straightDayResults = {};

        let userBestSpeed = userGameBasicStats.info.best_speed;
        if (!userGameBasicStats.best_speed_post) {
            // TODO: find first date with userBestSpeed within date range up to maxLookupDays
            logWarning('no best_speed_post data for user id', userId);
            logDebug('userGameBasicStats', userGameBasicStats);
            return;
        }
        if (!userGameBasicStats.best_speed_post.message) {
            logWarning('no best_speed_post.message data for user id', userId);
            logDebug('userGameBasicStats', userGameBasicStats);
            return;
        }
        if (!userGameBasicStats.best_speed_post.message.info) {
            logWarning('no best_speed_post.message.info data for user id', userId);
            logDebug('userGameBasicStats', userGameBasicStats);
            return;
        }
        let userbestSpeedDateString = userGameBasicStats.best_speed_post.message.info.updated;
        let userBestSpeedDate = new Date(userbestSpeedDateString);

        if (!userTodayStats.list) {
            logDebug('statistics is closed for user ' + userId);
            return;
        }

        if (userTodayStats.list.length === 0) {
            logDebug('no races for today for user ' + userId);
            return;
        }

        let userStatsToday = userTodayStats.list[0];
        let userMaxSpeedToday = userStatsToday.max_speed;



        for (let keyColor of Object.keys(targetSpeeds)) {
            let targetSpeedItem = targetSpeeds[keyColor];
            let userTargetSpeed = Math.ceil(userBestSpeed * targetSpeedItem.coeff);

            let userTargetSpeedAchieved = userMaxSpeedToday >= userTargetSpeed;

            if (userTargetSpeedAchieved) {

                straightDayResults[keyColor] = 1;
                break;
            }
        }

        let straightDayResultsKeys = Object.keys(straightDayResults);
        if (!straightDayResultsKeys.length) {
            return;
        }

        if (straightDayResultsKeys.length != 1) {
            logError('Invalid straightDayResultsKeys result', straightDayResultsKeys);
            // TODO: add debug info
            return;
        }

        let straightDaysKeyColor = straightDayResultsKeys[0];

        let userBestSpeedHistory = userGameBasicStats.journal;
        let targetSpeedItem = targetSpeeds[straightDaysKeyColor];

        for (let i = 0; i < maxLookupDays; i++) {
            date.setDate(date.getDate() - 1);
            let dateISO = date.toISOString();
            let dateISOShort = dateISO.slice(0, 10);

            let stats = await httpGet(location.protocol + '//klavogonki.ru/api/profile/get-stats-details-data?userId=' + userId + '&gametype=' + gameType + '&fromDate=' + dateISOShort + '&toDate=' + dateISOShort + '&grouping=day');

            if (!stats.list) {
                logDebug('statistics is closed for user ' + userId);
                return;
            }

            if (stats.list.length === 0) {
                logDebug('no races for ' + dateISOShort + ' for user ' + userId);
                break;
            }

            let userStatsDate = stats.list[0];

            let userBestSpeedDateAdjusted = userBestSpeed;
            if (userBestSpeedHistory) {
                if (date < userBestSpeedDate) {

                    let userBestSpeedDateLookup = userBestSpeedHistory.find(historyItem => {

                        if (historyItem.message.type !== "record") {
                            return false;
                        }

                        let userBestHistoricalSpeedDateString = historyItem.message.info.updated;
                        let userBestHistoricalSpeedDate = new Date(userBestHistoricalSpeedDateString);

                        return userBestHistoricalSpeedDate <= date;
                    });


                    if (userBestSpeedDateLookup) {
                        userBestSpeedDateAdjusted = userBestSpeedDateLookup.message.speed;
                    }
                }
            }
            let userTargetSpeed = Math.ceil(userBestSpeedDateAdjusted * targetSpeedItem.coeff);

            let userSpeedAchieved = userStatsDate.max_speed >= userTargetSpeed;
            if (!userSpeedAchieved) {
                break;
            }

            straightDayResults[straightDaysKeyColor]++;
        }

        let straightDaysAchieved = straightDayResults[straightDaysKeyColor];

        for (let straightDaysColorsKey of straightDaysColorsKeys) {
            let straightDaysNeeded = straightDaysColors[straightDaysColorsKey];
            if (straightDaysAchieved >= straightDaysNeeded) {

                let indicatorExists = carRatingElement.querySelectorAll('.perebor-days').length > 0;
                if (indicatorExists) {
                    logDebug('IndicatorDays for user ' + userId + ' already exists');
                    break;
                }
                let pereborIndicator = '<span class="perebor-days" style="background-color:black; color: ' + straightDaysColorsKey + ';">' + targetSpeedItem.heroChar + '<span>';
                carRatingElement.insert(pereborIndicator);

                break;
            }
        }
    }

    async function initIndicators() {

        for (let player of info.players) {
            try {
                let user = player.user;

                if (!user) {
                    continue;
                }

                let userId = user.id;

                let playerElementId = '#player' + player.id;

                let playerElement = document.querySelector(playerElementId);

                if (!playerElement) {
                    logError('cannot find car element for user ' + userId + ', skipping the user');
                    logDebug('playerElementId', playerElementId);
                    logDebug('player', player);
                    continue;
                }

                let success = await processUserStat(userId, playerElement);
                if (success) {
                    subscribeToPlayerFinish(playerElement, userId);
                }
            }
            catch (error) {
                logError('Error on initial processing a player', error);
                logDebug('Player', player);
                continue;
            }
        }

    }

    var playersObserverConfig = { childList: true };
    let playersElement = document.querySelector('#players');

    let statusObserverConfig = { attributes: true };
    let statusElement = document.querySelector('#status');



    function subscribeToPlayerFinish(playerElement, userId) {
        let ratingObserverConfig = { attributes: true };
        let ratingElement = playerElement.querySelector('.rating');
        let recordElement = playerElement.querySelector('.newrecord');

        let playerRatingCallback = async function (mutationsList, _) {
            if (mutationsList.length === 0) {
                return;
            }
            let resultSpeed = mutationsList[0].target.querySelector('.stats').children[1].querySelector('.bitmore').innerText;
            console.debug('finished result', resultSpeed);
            console.debug('user finished', userId);
            let userBestSpeed = bestSpeedByUser[userId];
            console.debug('user finished best speed', userBestSpeed);

            if (userBestSpeed > resultSpeed) {
                for (let keyColor of Object.keys(targetSpeeds)) {
                    let targetSpeedItem = targetSpeeds[keyColor];
                    let userTargetSpeed = Math.ceil(userBestSpeed * targetSpeedItem.coeff);
                    let userSpeedAchieved = resultSpeed >= userTargetSpeed;

                    if (userSpeedAchieved) {
                        console.debug('achieved ' + targetSpeedItem.coeff * 100 + '%!', userId);
                        //TODO: add element
                        let achievementIndicator = '<a class="perebor-achievement" style="color: ' + keyColor + '; border-bottom: 1px dashed ' + keyColor + ';">* ' + targetSpeedItem.coeff * 100 + '% от рекорда!' + '<a>';
                        recordElement.insert(achievementIndicator);
                        break;
                    }
                }
            }
        }

        let ratingObserver = new MutationObserver(playerRatingCallback);
        ratingObserver.observe(ratingElement, ratingObserverConfig);
    }

    const playersCallback = async function (mutationsList, _) {
        for (let mutation of mutationsList) {

            for (let addedNode of mutation.addedNodes) {

                let recordElement = addedNode.querySelector('.newrecord');

                let newPlayerSpanElement = recordElement.querySelector('span');

                // guest player
                if (!newPlayerSpanElement) {
                    logDebug('Guest player joined, skipping');
                    continue;
                }

                let attrWithUserId = newPlayerSpanElement.getAttribute('ng:show');

                let userId = attrWithUserId.substring(attrWithUserId.indexOf('[') + 1, attrWithUserId.indexOf(']'));
                if (!userId) {
                    logError('cannot find userId for added car element', addedNode);
                    logDebug('mutation', mutation);
                    logDebug('attrWithUserId', attrWithUserId);
                    logDebug('newPlayerSpanElement', newPlayerSpanElement);
                    logDebug('recordElement', recordElement);
                }

                let success = await processUserStat(userId, addedNode);

                if (success) {
                    subscribeToPlayerFinish(addedNode, userId);
                }
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
