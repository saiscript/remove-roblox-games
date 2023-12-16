// ==UserScript==
// @name         no weird roblox games
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  removes most 'sus' games off of the roblox website
// @author       me
// @match        *://www.roblox.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=roblox.com
// @grant        none
// @run-at       document-end
// ==/UserScript==

const linkFilter = ['10812131401', '14968620152', '9816549907']; // remove game containers if they lead you to these links or include these game ids
const titleFilter = ['18', '18+', 'r34', 'r63', 'sus', '34', '63', 'sussy', 'dirty', 'neko girl', 'nekogirl', 'neko-girl']; // remove game containers that include one of these keywords in the title

function removeElements(elements) {
    elements.forEach(element => {
        const linkElement = element.querySelector('.game-card-link');
        const titleElement = element.querySelector('.game-card-name.game-name-title');

        if (linkElement) {
            const href = linkElement.getAttribute('href');
            if (href && linkFilter.find(id => href.includes(id))) {
                linkElement.closest('.grid-item-container').remove();
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

(function() {
    removeElements(document.querySelectorAll('.grid-item-container.game-card-container'));
    observeNewElements();

    const intervalId = setInterval(function () {
        const preExistingElements = document.querySelectorAll('.grid-item-container.game-card-container');
        removeElements(preExistingElements);
    }, 250);

    setTimeout(() => {
        clearInterval(intervalId);
    }, 3000);
})();
