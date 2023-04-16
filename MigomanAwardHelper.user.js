// ==UserScript==
// @name          MigomanAwardHelper.user
// @namespace     klavogonki
// @version       0.0.1
// @description   рассылает призовые очки и картинки
// @include       http://klavogonki.ru/u/*
// @author        vnest
// ==/UserScript==

(async function () {
    'use strict';

	var input;

    function getLogMessage(message) {
        return "MigomanAwardHelper: " + message;
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

	function getCookie(name) {
		const value = `; ${document.cookie}`;
		const parts = value.split(`; ${name}=`);
		if (parts.length === 2) return parts.pop().split(';').shift();
	}

    function sleep (milliseconds) {
        return new Promise((resolve) => setTimeout(resolve, milliseconds))
    }

    function httpGet(url, retriesLeft) {
        if(retriesLeft == undefined) {
            retriesLeft = retryCount;
        }
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open("Get", url);
            xhr.onload = () => {
                if(xhr.status == 200) {
                    return resolve(JSON.parse(xhr.responseText));
                } else if (xhr.status == 429) {
                    logDebug('RETRIES LEFT ' + retriesLeft, xhr);
                    if(retriesLeft > 0) {
                        retriesLeft--;
                        sleep(retryTimeout).then(() => {
                            return resolve(httpGet(url, retriesLeft));
                        });
                    } else {
                        return reject(logError(xhr.status + '; ' + xhr.responseText));
                    }
                }
            };
            xhr.onerror = () => {
                return reject(logError(xhr.statusText));
            };
            xhr.send();
        });
    }

	function httpPost(url, requestData) {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open("POST", url);
			xhr.setRequestHeader('X-XSRF-TOKEN', getCookie('XSRF-TOKEN'));
            xhr.onload = () => {
				logDebug('received response', xhr.responseText);
				return resolve(xhr.responseText);
			};
            xhr.onerror = () => reject(logError(xhr.statusText));
            xhr.send(JSON.stringify(requestData));
        });
	}

	async function sendPointsAsync(userId, amount, message) {
        let url = location.protocol + '//klavogonki.ru/api/profile/send-scores';

        let result = JSON.parse(await httpPost(url, {
			respondentId: userId,
			message: message,
			amount: amount
		}));
		logDebug('received respons 2', result);
		if(result['err']) {
			logError(`ERROR sending ${amount} points to user ${userId}`, result);
		} else {
			logMessage(`Sent OK ${amount} points to user ${userId}`);
		}
    }

	async function sendJournalMessageAsync(userId, message) {
        let url = location.protocol + '//klavogonki.ru/api/profile/add-journal-post';

        let result = JSON.parse(await httpPost(url, {
			userId: userId,
			text: message
		}));
		logDebug('received respons 2', result['err']);
		if(result['err']) {
			logError(`ERROR sending journal message to user ${userId}`, result);
		} else {
			logMessage(`Sent OK journal message to user ${userId}`);
		}
    }

	async function ProcessAwardsAsync(sendPoints, sendJournalMessages)  {
		var userRewardsParsed = JSON.parse(input.value);
		for (let userRewardsInfo of userRewardsParsed) {
			let userId = userRewardsInfo.userId;
			let userRewards = userRewardsInfo.rewards;
			for (let userReward of userRewards) {
				let amount = userReward.amount;
				let privateMessage = userReward.privateMessage;
				let journalMessage = userReward.journalMessage;

				if(sendPoints) {
					await sendPointsAsync(userId, amount, privateMessage);
				}
				if(sendJournalMessages && journalMessage) {
					await sendJournalMessageAsync(userId, journalMessage);
				}
			}
		}
	}

	function createMenu (sidebarNode, login) {
		var menuStructure = [
		  {
			text: 'Отправить очки',
			action: () => ProcessAwardsAsync(true, false)
		  },
		  {
			text: 'Отправить картинки',
			action: () => ProcessAwardsAsync(false, true)
		  },
		  {
			text: 'Отправить очки и картинки',
			action: () => ProcessAwardsAsync(true, true)
		  },
		];
	
		var menu = document.createElement('ul');
		menu.className = 'profile-nav';
		menuStructure.forEach(function (item) {
		  var li = document.createElement('li');
		  var a = document.createElement('a');
		  a.addEventListener('click', item.action);
		//   a.href = item.url;
		  a.textContent = item.text;
		  li.appendChild(a);
		  menu.appendChild(li);
		});
		return sidebarNode.appendChild(menu);
	  }

	function initMenu () {
		logMessage('initmenu');
		var sidebarNode = document.querySelector('.sidebar');
		if (!sidebarNode) {
		  return false;
		}
	
		var loginNode = document.querySelector('.profile-header .name');
		if (!loginNode || !loginNode.firstChild) {
		  return false;
		}
	
		input = document.createElement("INPUT");
		input.setAttribute("type", "text");
		input.style.width = '100%';
		input.style['margin-bottom'] = '9px';
		sidebarNode.appendChild(input);

		var login = loginNode.firstChild.textContent.trim();
		return createMenu(sidebarNode, login);
	}

	var observer = window.setInterval(function () {
		if (!initMenu()) {
		  return;
		}
		window.clearInterval(observer);
		var injector = angular.element('body').injector();
		injector.invoke(function ($routeParams, $rootScope, $timeout) {
		  var id = $routeParams.user;
		  $rootScope.$on('routeSegmentChange', function () {
			if (id !== $routeParams.user) {
			  id = $routeParams.user;
			  // Wait for the digest cycle:
			  $timeout(initMenu);
			}
		  })
		});
	  }, 500);

	  
})();