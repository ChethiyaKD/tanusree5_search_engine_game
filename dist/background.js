/******/ (function() { // webpackBootstrap
var __webpack_exports__ = {};
/*!****************************!*\
  !*** ./src/background.jsx ***!
  \****************************/
var APIURL = "https://script.google.com/macros/s/AKfycbz8qb66O054xBFVwa8c-u0vYkcu4uqJdHTRf988T3H_FUbGbBGxZ6LMpOcAy0XndzL5gA/exec";

var googleSearch = function googleSearch(searchTerm) {
  chrome.tabs.create({
    url: "https://google.com/search?q=".concat(searchTerm)
  });
};

var getBrowsingWeek = function getBrowsingWeek() {
  fetch("".concat(APIURL, "?type=keywords")).then(function (result) {
    return result.json();
  }).then(function (data) {
    console.log(data);
    saveToStorage({
      browsingWeek: data.data
    });
  })["catch"](function (err) {
    return console.log(err);
  });
};

var saveToStorage = function saveToStorage(obj) {
  return new Promise(function (resolve) {
    chrome.storage.local.set(obj, function (res) {
      return resolve(true);
    });
  });
};

var getFromStorage = function getFromStorage(arr) {
  return new Promise(function (resolve) {
    chrome.storage.local.get(arr, function (res) {
      return resolve(res);
    });
  });
};

chrome.runtime.onInstalled.addListener(function () {
  var defSettings = {
    firstTime: true,
    userId: null,
    credits: 0,
    balance: 0
  };
  saveToStorage(defSettings);
});
chrome.action.onClicked.addListener(function (tab) {
  openWindow();
});
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.command === "search") {
    googleSearch(msg.data);
  }
});

var openWindow = function openWindow() {
  chrome.windows.getCurrent(function (tabWindow) {
    var width = 760;
    var height = 478;
    var left = Math.round((tabWindow.width - width) * 0.5 + tabWindow.left);
    var top = Math.round((tabWindow.height - height) * 0.5 + tabWindow.top);
    chrome.windows.create({
      focused: true,
      url: chrome.runtime.getURL("popup.html"),
      type: "popup",
      width: width,
      height: height,
      left: left,
      top: top
    });
  });
}; ///////


var init = function init() {
  getBrowsingWeek();
};

init();
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LFFBQU1DLElBQUksR0FBR0MsSUFBSSxDQUFDQyxLQUFMLENBQVcsQ0FBQ0wsU0FBUyxDQUFDQyxLQUFWLEdBQWtCQSxLQUFuQixJQUE0QixHQUE1QixHQUFrQ0QsU0FBUyxDQUFDRyxJQUF2RCxDQUFiO0FBQ0EsUUFBTUcsR0FBRyxHQUFHRixJQUFJLENBQUNDLEtBQUwsQ0FBVyxDQUFDTCxTQUFTLENBQUNFLE1BQVYsR0FBbUJBLE1BQXBCLElBQThCLEdBQTlCLEdBQW9DRixTQUFTLENBQUNNLEdBQXpELENBQVo7QUFFQWxELElBQUFBLE1BQU0sQ0FBQzBDLE9BQVAsQ0FBZXhDLE1BQWYsQ0FBc0I7QUFDcEJpRCxNQUFBQSxPQUFPLEVBQUUsSUFEVztBQUVwQmhELE1BQUFBLEdBQUcsRUFBRUgsTUFBTSxDQUFDeUIsT0FBUCxDQUFlMkIsTUFBZixDQUFzQixZQUF0QixDQUZlO0FBR3BCQyxNQUFBQSxJQUFJLEVBQUUsT0FIYztBQUlwQlIsTUFBQUEsS0FBSyxFQUFMQSxLQUpvQjtBQUtwQkMsTUFBQUEsTUFBTSxFQUFOQSxNQUxvQjtBQU1wQkMsTUFBQUEsSUFBSSxFQUFKQSxJQU5vQjtBQU9wQkcsTUFBQUEsR0FBRyxFQUFIQTtBQVBvQixLQUF0QjtBQVNELEdBZkQ7QUFnQkQsQ0FqQkQsRUFtQkE7OztBQUVBLElBQU1JLElBQUksR0FBRyxTQUFQQSxJQUFPLEdBQU07QUFDakJsRCxFQUFBQSxlQUFlO0FBQ2hCLENBRkQ7O0FBSUFrRCxJQUFJLEciLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9ndWlsbGF1bWViYXIzMjIvLi9zcmMvYmFja2dyb3VuZC5qc3giXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgQVBJVVJMID1cclxuICBcImh0dHBzOi8vc2NyaXB0Lmdvb2dsZS5jb20vbWFjcm9zL3MvQUtmeWNiejhxYjY2TzA1NHhCRlZ3YThjLXUwdllrY3U0dXFKZEhUUmY5ODhUM0hfRlViR2JCR3haNkxNcE9jQXkwWG5kekw1Z0EvZXhlY1wiO1xyXG5cclxuY29uc3QgZ29vZ2xlU2VhcmNoID0gKHNlYXJjaFRlcm0pID0+IHtcclxuICBjaHJvbWUudGFicy5jcmVhdGUoeyB1cmw6IGBodHRwczovL2dvb2dsZS5jb20vc2VhcmNoP3E9JHtzZWFyY2hUZXJtfWAgfSk7XHJcbn07XHJcblxyXG5jb25zdCBnZXRCcm93c2luZ1dlZWsgPSAoKSA9PiB7XHJcbiAgZmV0Y2goYCR7QVBJVVJMfT90eXBlPWtleXdvcmRzYClcclxuICAgIC50aGVuKChyZXN1bHQpID0+IHJlc3VsdC5qc29uKCkpXHJcbiAgICAudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgc2F2ZVRvU3RvcmFnZSh7IGJyb3dzaW5nV2VlazogZGF0YS5kYXRhIH0pO1xyXG4gICAgfSlcclxuICAgIC5jYXRjaCgoZXJyKSA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxufTtcclxuXHJcbmNvbnN0IHNhdmVUb1N0b3JhZ2UgPSAob2JqKSA9PlxyXG4gIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQob2JqLCAocmVzKSA9PiByZXNvbHZlKHRydWUpKTtcclxuICB9KTtcclxuXHJcbmNvbnN0IGdldEZyb21TdG9yYWdlID0gKGFycikgPT5cclxuICBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KGFyciwgKHJlcykgPT4gcmVzb2x2ZShyZXMpKTtcclxuICB9KTtcclxuXHJcbmNocm9tZS5ydW50aW1lLm9uSW5zdGFsbGVkLmFkZExpc3RlbmVyKCgpID0+IHtcclxuICBjb25zdCBkZWZTZXR0aW5ncyA9IHsgZmlyc3RUaW1lOiB0cnVlLCB1c2VySWQ6IG51bGwsIGNyZWRpdHM6IDAsIGJhbGFuY2U6IDAgfTtcclxuICBzYXZlVG9TdG9yYWdlKGRlZlNldHRpbmdzKTtcclxufSk7XHJcblxyXG5jaHJvbWUuYWN0aW9uLm9uQ2xpY2tlZC5hZGRMaXN0ZW5lcihmdW5jdGlvbiAodGFiKSB7XHJcbiAgb3BlbldpbmRvdygpO1xyXG59KTtcclxuXHJcbmNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigobXNnLCBzZW5kZXIsIHNlbmRSZXNwb25zZSkgPT4ge1xyXG4gIGlmIChtc2cuY29tbWFuZCA9PT0gXCJzZWFyY2hcIikge1xyXG4gICAgZ29vZ2xlU2VhcmNoKG1zZy5kYXRhKTtcclxuICB9XHJcbn0pO1xyXG5cclxuY29uc3Qgb3BlbldpbmRvdyA9ICgpID0+IHtcclxuICBjaHJvbWUud2luZG93cy5nZXRDdXJyZW50KCh0YWJXaW5kb3cpID0+IHtcclxuICAgIGNvbnN0IHdpZHRoID0gNzYwO1xyXG4gICAgY29uc3QgaGVpZ2h0ID0gNDc4O1xyXG4gICAgY29uc3QgbGVmdCA9IE1hdGgucm91bmQoKHRhYldpbmRvdy53aWR0aCAtIHdpZHRoKSAqIDAuNSArIHRhYldpbmRvdy5sZWZ0KTtcclxuICAgIGNvbnN0IHRvcCA9IE1hdGgucm91bmQoKHRhYldpbmRvdy5oZWlnaHQgLSBoZWlnaHQpICogMC41ICsgdGFiV2luZG93LnRvcCk7XHJcblxyXG4gICAgY2hyb21lLndpbmRvd3MuY3JlYXRlKHtcclxuICAgICAgZm9jdXNlZDogdHJ1ZSxcclxuICAgICAgdXJsOiBjaHJvbWUucnVudGltZS5nZXRVUkwoXCJwb3B1cC5odG1sXCIpLFxyXG4gICAgICB0eXBlOiBcInBvcHVwXCIsXHJcbiAgICAgIHdpZHRoLFxyXG4gICAgICBoZWlnaHQsXHJcbiAgICAgIGxlZnQsXHJcbiAgICAgIHRvcCxcclxuICAgIH0pO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuLy8vLy8vL1xyXG5cclxuY29uc3QgaW5pdCA9ICgpID0+IHtcclxuICBnZXRCcm93c2luZ1dlZWsoKTtcclxufTtcclxuXHJcbmluaXQoKTtcclxuIl0sIm5hbWVzIjpbIkFQSVVSTCIsImdvb2dsZVNlYXJjaCIsInNlYXJjaFRlcm0iLCJjaHJvbWUiLCJ0YWJzIiwiY3JlYXRlIiwidXJsIiwiZ2V0QnJvd3NpbmdXZWVrIiwiZmV0Y2giLCJ0aGVuIiwicmVzdWx0IiwianNvbiIsImRhdGEiLCJjb25zb2xlIiwibG9nIiwic2F2ZVRvU3RvcmFnZSIsImJyb3dzaW5nV2VlayIsImVyciIsIm9iaiIsIlByb21pc2UiLCJyZXNvbHZlIiwic3RvcmFnZSIsImxvY2FsIiwic2V0IiwicmVzIiwiZ2V0RnJvbVN0b3JhZ2UiLCJhcnIiLCJnZXQiLCJydW50aW1lIiwib25JbnN0YWxsZWQiLCJhZGRMaXN0ZW5lciIsImRlZlNldHRpbmdzIiwiZmlyc3RUaW1lIiwidXNlcklkIiwiY3JlZGl0cyIsImJhbGFuY2UiLCJhY3Rpb24iLCJvbkNsaWNrZWQiLCJ0YWIiLCJvcGVuV2luZG93Iiwib25NZXNzYWdlIiwibXNnIiwic2VuZGVyIiwic2VuZFJlc3BvbnNlIiwiY29tbWFuZCIsIndpbmRvd3MiLCJnZXRDdXJyZW50IiwidGFiV2luZG93Iiwid2lkdGgiLCJoZWlnaHQiLCJsZWZ0IiwiTWF0aCIsInJvdW5kIiwidG9wIiwiZm9jdXNlZCIsImdldFVSTCIsInR5cGUiLCJpbml0Il0sInNvdXJjZVJvb3QiOiIifQ==