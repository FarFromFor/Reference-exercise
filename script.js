import SearchPageLogic from './SearchPageLogic.js';

document.addEventListener("DOMContentLoaded", () => {
    window.tabs = new SearchPageLogic()
    window.tabs.handle()
});