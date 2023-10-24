// ==UserScript==
// @name         no weird roblox games
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  removes most 'sus' games off of the roblox website
// @author       me
// @match        *://www.roblox.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=roblox.com
// @grant        none
// @run-at       document-end
// ==/UserScript==

const linkFilter = ['https://www.roblox.com/games/10812131401', 'https://www.roblox.com/games/14968620152']; // remove game containers if they lead you to these links
const titleFilter = ['18', '18+', 'r34', 'r63', 'sus', '34', '63', 'sussy', 'dirty']; // remove game containers that include one of these keywords in the title

function removeElements(elements) {
    elements.forEach(element => {
        const linkElement = element.querySelector('.game-card-link');
        const titleElement = element.querySelector('.game-card-name.game-name-title');

        if (linkElement) {
            const href = linkElement.getAttribute('href');
            if (href && linkFilter.includes(href)) {
                element.remove();
            }
        }

        if (titleElement) {
            const title = titleElement.textContent.trim().toLowerCase();
            if (titleFilter.some(filter => title.includes(filter.toLowerCase()))) {
                element.remove();
            }
        }
    });
}

function observeNewElements() {
    const targetNode = document.body;
    const config = { childList: true, subtree: true };

    const mutationCallback = function(mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                const addedElements = Array.from(mutation.addedNodes).filter(node => node.nodeType === Node.ELEMENT_NODE);
                removeElements(addedElements);
            }
        }
    };

    const observer = new MutationObserver(mutationCallback);
    observer.observe(targetNode, config);
}

function bye() {
    removeElements(document.querySelectorAll('.grid-item-container.game-card-container'));
    observeNewElements();

    const intervalId = setInterval(function () {
        const preExistingElements = document.querySelectorAll('.grid-item-container.game-card-container');
        removeElements(preExistingElements);
    }, 250);

    setTimeout(() => {
        clearInterval(intervalId);
    }, 3000);
}

(function() {
    bye();
})();