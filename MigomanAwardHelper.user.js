// ==UserScript==
// @name          MigomanAwardHelper.user
// @namespace     klavogonki
// @version       0.0.5
// @description   рассылает призовые очки и картинки
// @include       http://klavogonki.ru/u/*
// @author        vnest
// ==/UserScript==

(async function () {
    'use strict';

	var menuItems = [];
	var input;
	var outputJournalSuccess;
	var outputJournalError;
	var outputMessagesSuccess;
	var outputMessagesError;

	var outputForumErrorScoreSend;
	var outputForumErrorJournalSend;

	var scoreAwardCount;
	var journalAwardCount;

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
			return false;
		} else {
			logMessage(`Sent OK ${amount} points to user ${userId}`);
			return true;
		}
    }

	async function sendJournalMessageAsync(userId, message, awardIndex) {
        let url = location.protocol + '//klavogonki.ru/api/profile/add-journal-post';

        let result = JSON.parse(await httpPost(url, {
			userId: userId,
			text: message
		}));
		logDebug('received respons 2', result['err']);
		if(result['err']) {
			logError(`ERROR sending journal message to user ${userId}`, result);
			return false;
		} else {
			logMessage(`Sent OK journal message to user ${userId}`);
			return true;
		}
    }

	async function ProcessAwardsAsync(sendPoints, sendJournalMessages)  {
		for (let menuItem of menuItems) {
			menuItem.style['pointer-events'] = 'none';
			menuItem.style['color'] = 'lightgrey';
		}
		
		var userRewardsParsed = JSON.parse(input.value);
		var allRewards = userRewardsParsed.map(urp => urp.rewards).reduce((a, b) => a.concat(b));
		var scoreRewards = allRewards.filter(r => r.privateMessage);
		var journalRewards = allRewards.filter(r => r.journalMessage);

		scoreAwardCount = scoreRewards.length;
		journalAwardCount = journalRewards.length;

		var scoreAwardSuccessIndex = 0;
		var journalAwardSucessIndex = 0;

		var scoreAwardErrorIndex = 0;
		var journalAwardErrorIndex = 0;
		var errorSendScoreUsers = [];
		var errorSendJournalUsers = [];


		for (let userRewardsInfo of userRewardsParsed) {
			let userId = userRewardsInfo.userId;
			let userName = userRewardsInfo.userName;
			let userRewards = userRewardsInfo.rewards;
			for (let userReward of userRewards) {
				let amount = userReward.amount;
				let privateMessage = userReward.privateMessage;
				let journalMessage = userReward.journalMessage;

				if(sendPoints && privateMessage) {
					if (await sendPointsAsync(userId, amount, privateMessage)) {
						scoreAwardSuccessIndex++;
					} else {
						scoreAwardErrorIndex++;
						if (errorSendScoreUsers.indexOf(userName) == -1) {
							errorSendScoreUsers.push(userName);
						}
					}
					updateOutputValue(outputMessagesSuccess, scoreAwardSuccessIndex, scoreAwardCount, true, true);
					updateOutputValue(outputMessagesError, scoreAwardErrorIndex, scoreAwardCount, true, false);
					await sleep(100);
				}
				if(sendJournalMessages && journalMessage) {
					if (await sendJournalMessageAsync(userId, journalMessage)) {
						journalAwardSucessIndex++;
					} else {
						journalAwardErrorIndex++;
						if (errorSendJournalUsers.indexOf(userName) == -1) {
							errorSendJournalUsers.push(userName);
						}
					}
					updateOutputValue(outputJournalSuccess, journalAwardSucessIndex, journalAwardCount, false, true);
					updateOutputValue(outputJournalError, journalAwardErrorIndex, journalAwardCount, false, false);
					await sleep(500);
				}
			}
		}

		if(errorSendJournalUsers.length > 0) {
			outputForumErrorJournalSend.value = `Награды в журнал не отправляются: ${errorSendJournalUsers.join(', ')}`;
		}

		if(errorSendScoreUsers.length > 0) {
			outputForumErrorScoreSend.value = `Очки не отправляются: ${errorSendScoreUsers.join(', ')}`;
		}

		for (let menuItem of menuItems) {
			menuItem.style['pointer-events'] = 'unset';
			menuItem.style['color'] = 'unset';
		}
	}

	function updateOutputValue (outputElement, index, count, scores, sucess) {
		outputElement.value = `${scores ? 'POINTS' : 'JOURNAL'} ${sucess ? 'OK' : 'ERROR'}: ${index} of ${count}`;
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
		  menuItems.push(a);
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
		
		var menu = createMenu(sidebarNode, login);

		outputJournalSuccess = addOutputElement(sidebarNode, true);
		outputJournalError = addOutputElement(sidebarNode, true);
		outputMessagesSuccess = addOutputElement(sidebarNode, true);
		outputMessagesError = addOutputElement(sidebarNode, true);
		outputForumErrorJournalSend = addOutputElement(sidebarNode, false);
		outputForumErrorScoreSend = addOutputElement(sidebarNode, false);

		return outputMessagesError;
	}

	function addOutputElement(sidebarNode, disabled) {
		let outputElement = document.createElement("INPUT");
		outputElement.setAttribute("type", "text");
		if(disabled) {
			outputElement.setAttribute("disabled", disabled);
		}
		outputElement.style.width = '100%';
		outputElement.style['margin-bottom'] = '9px';
		return sidebarNode.appendChild(outputElement);
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