let width = 0;
let height = 0;

chrome.action.onClicked.addListener(function (tab) {
  openWindow();
});

const openWindow = () => {
  chrome.windows.getCurrent((tabWindow) => {
    const width = 760;
    const height = 450;
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
