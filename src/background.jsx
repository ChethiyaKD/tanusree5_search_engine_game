const APIURL =
  "https://script.google.com/macros/s/AKfycbyhhI4uuo5HrXku1yMEbu9ZoYDAmf6QHSG9KiWEgRDCOuTZmFlzw-3888blAcIKvtJaxg/exec";
const serpAPIKEY =
  "ede9da382a0e902a00d18bb52d2ec91d1766187663d782bf7d8e0f2013016aa3";

const getSerp = (searchTerm) => {
  return new Promise((resolve) => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      `https://serpapi.com/search.json?engine=google&q=${searchTerm}&api_key=${serpAPIKEY}&num=15`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => resolve(result))
      .catch((error) => console.log("error", error));
  });
};

const googleSearch = (searchTerm) => {
  return new Promise(async (resolve) => {
    let serpRes = await getSerp(searchTerm);

    let storageRes = await getFromStorage("history");
    if (!storageRes.history) return;

    storageRes.history.push({
      searchTerm: searchTerm,
      date: new Date().toUTCString(),
      url: serpRes.search_metadata.google_url,
      submitted: false,
    });
    saveToStorage({ history: storageRes.history });
    let submittedCount = storageRes.history.filter((h) => h.submitted);
    let reveresed = serpRes.organic_results.reverse();
    let data = [];
    for (
      let i = 0;
      i < Math.floor(reveresed.length * (submittedCount.length / 3));
      i++
    ) {
      data.push(reveresed[i]);
    }
    resolve(data);
  });
};

const toMinsAndSecs = (millis) => {
  let minutes = Math.floor(millis / 60000);
  let seconds = ((millis % 60000) / 1000).toFixed(0);
  return `${minutes} :${seconds < 10 ? "0" : ""}${seconds}`;
};

const submitTask = async (task) => {
  let storageRes = await getFromStorage(["userId", "history"]);
  if (storageRes.userId && storageRes.history) {
    let history = storageRes.history;
    const raw = JSON.stringify({
      userId: storageRes.userId,
      keyword: task.keyword,
      timeTaken: toMinsAndSecs(
        Date.now() - new Date(history[history.length - 1].date)
      ),
      url: task.link,
      type: "submitTask",
    });
    console.log(raw);
    let done = await postData(raw);
  }
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
const getWeek2 = () => {
  fetch(`${APIURL}?type=week_2`)
    .then((result) => result.json())
    .then((data) => {
      console.log(data);
      saveToStorage({ weekTwoKeywords: data.data });
    })
    .catch((err) => console.log(err));
};

const getHistory = () =>
  new Promise(async (resolve) => {
    let storageRes = await getFromStorage("history");
    // console.log(storageRes);
    if (storageRes.history) resolve(storageRes.history);
  });

const postData = (data) => {
  console.log(data);
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

const authUser = (userId) => {
  return new Promise(async (resolve) => {
    const raw = JSON.stringify({
      userId: userId,
      type: "authUser",
    });

    let res = await postData(raw);
    resolve(res);
  });
};

const uploadHistory = (data) => {
  return new Promise(async (resolve) => {
    let storageRes = await getFromStorage(["userId", "history"]);
    if (storageRes.userId && storageRes.history) {
      const raw = JSON.stringify({
        userId: storageRes.userId,
        history: data,
        type: "uploadHistory",
      });
      console.log(raw);
      let done = await postData(raw);
      resolve(done);

      for (let h of storageRes.history) {
        let found = data.find((d) => d.url === h.url && d.date === h.date);
        if (found) h.submitted = true;
      }
      saveToStorage({ history: storageRes.history });
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
    weekTwoKeywords: [],
  };
  saveToStorage(defSettings);
});

chrome.action.onClicked.addListener(function (tab) {
  openWindow();
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log(msg);
  if (msg.command === "search") {
    (async () => {
      let serpRes = await googleSearch(msg.data);
      sendResponse(serpRes);
    })();
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
      let res = await uploadHistory(msg.history);
      sendResponse(res);
    })();
  }
  if (msg.command === "authUser") {
    (async () => {
      let res = await authUser(msg.userId);
      sendResponse(res);
    })();
  }
  if (msg.command === "googleSearch") {
    console.log(msg.data);
  }
  if (msg.command === "openLink") {
    chrome.tabs.create({ url: msg.url });
  }
  if (msg.command === "submitTask") {
    submitTask(msg.task);
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
  getWeek2();
};

init();
