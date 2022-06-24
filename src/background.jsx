const APIURL =
  "https://script.google.com/macros/s/AKfycbzMlzSCOnyjZDgrqxLeGTv5p9PyjwA1S6jQ-VWlkFWpv-kMF_WPdIBi3V_OmjxJ2NNrLw/exec";

const googleSearch = async (searchTerm) => {
  chrome.tabs.create({ url: `https://google.com/search?q=${searchTerm}` });
  let storageRes = await getFromStorage("history");
  if (!storageRes.history) return;

  storageRes.history.push({
    searchTerm: searchTerm,
    date: new Date().toUTCString(),
  });
  saveToStorage({ history: storageRes.history });
};

const getBrowsingWeek = () => {
  fetch(`${APIURL}?type=keywords`)
    .then((result) => result.json())
    .then((data) => {
      console.log(data);
      saveToStorage({ browsingWeek: data.data });
    })
    .catch((err) => console.log(err));
};

const getHistory = () =>
  new Promise(async (resolve) => {
    let storageRes = await getFromStorage("history");
    if (storageRes.history) resolve(storageRes.history);
  });

const postData = (data) => {
  return new Promise((resolve) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: data,
      redirect: "follow",
    };

    fetch(APIURL, requestOptions)
      .then((response) => response.json())
      .then((result) => resolve(result))
      .catch((error) => console.log("error", error));
  });
};

const createUser = (uuid) => {
  const raw = JSON.stringify({
    id: uuid,
    credits: 0,
    type: "updateUser",
  });

  postData(raw);
};

const uploadHistory = () => {
  return new Promise(async (resolve) => {
    let storageRes = await getFromStorage(["id", "history"]);
    if (storageRes.id && storageRes.history) {
      const raw = JSON.stringify({
        id: storageRes.id,
        history: JSON.stringify(storageRes.history),
        type: "uploadHistory",
      });

      let done = await postData(raw);
      resolve(done);
    }
  });
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
  const defSettings = {
    firstTime: true,
    userId: null,
    credits: 0,
    balance: 0,
    history: [],
  };
  saveToStorage(defSettings);
});

chrome.action.onClicked.addListener(function (tab) {
  openWindow();
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.command === "search") {
    googleSearch(msg.data);
  }
  if (msg.command === "getHistory") {
    (async () => {
      let history = await getHistory();
      sendResponse(history);
    })();
  }
  if (msg.command === "createUser") {
    createUser(msg.data);
  }
  if (msg.command === "uploadHistory") {
    (async () => {
      let res = await uploadHistory();
      sendResponse(res);
    })();
  }
  return true;
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

///////

const init = () => {
  getBrowsingWeek();
};

init();
