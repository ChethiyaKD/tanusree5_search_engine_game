const googleSearch = (searchTerm) => {
  chrome.tabs.create({ url: `https://google.com/search?q=${searchTerm}` });
};

const saveToStorage = (obj) =>
  new Promise((resolve) => {
    chrome.storage.local.set(obj, (res) => resolve(true));
  });

const getFromStorage = (arr) =>
  new Promise((resolve) => {
    chrome.storage.local.get(arr, (res) => resolve(res));
  });

chrome.runtime.onInstalled.addListener(() => {
  const defSettings = { firstTime: true, userId: null, credits: 0, balance: 0 };
  saveToStorage(defSettings);
});

chrome.action.onClicked.addListener(function (tab) {
  openWindow();
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.command === "search") {
    googleSearch(msg.data);
  }
});

const openWindow = () => {
  chrome.windows.getCurrent((tabWindow) => {
    const width = 760;
    const height = 478;
    const left = Math.round((tabWindow.width - width) * 0.5 + tabWindow.left);
    const top = Math.round((tabWindow.height - height) * 0.5 + tabWindow.top);

    chrome.windows.create({
      focused: true,
      url: chrome.runtime.getURL("popup.html"),
      type: "popup",
      width,
      height,
      left,
      top,
    });
  });
};
