const APIURL =
  "https://script.google.com/macros/s/AKfycbyNCAcwQhVeDRpMTM62EGYJw50G---8V4z1WJoJLVmxJf0YeioaMKYHFu0SXHi67aXN/exec";
// const APIURL =
//   "https://script.google.com/macros/s/AKfycbxqmBMb5NkK8u1JKvOHQME9fHCutxG4sZVR2_vDfGfIdOnS2ARRRWTTheIaILuRdYgPnA/exec";
const serpAPIKEY =
  "7ff28bfd424339b1679a3d5455f2ced6dd0177d74ef8e62240b03be3a675588b";

const staticResult = [
  {
    position: 1,
    title: "Coffee - Wikipedia",
    link: "https://en.wikipedia.org/wiki/Coffee",
    displayed_link: "https://en.wikipedia.org › wiki › Coffee",
    thumbnail:
      "https://serpapi.com/searches/62c1ba9ef55d774dfd018a03/images/b7cc67a2b78dbb467fd73da3a5c83de33f1075c739f8422a9f36bd05bdd0ca9f.jpeg",
    snippet:
      "Coffee is a brewed drink prepared from roasted coffee beans, the seeds of berries from certain flowering plants in the Coffea genus. From the coffee fruit, ...",
    snippet_highlighted_words: ["Coffee", "coffee", "coffee"],
    sitelinks: {
      inline: [
        {
          title: "Coffee bean",
          link: "https://en.wikipedia.org/wiki/Coffee_bean",
        },
        {
          title: "History",
          link: "https://en.wikipedia.org/wiki/History_of_coffee",
        },
        {
          title: "Coffee preparation",
          link: "https://en.wikipedia.org/wiki/Coffee_preparation",
        },
        {
          title: "Coffee production",
          link: "https://en.wikipedia.org/wiki/Coffee_production",
        },
      ],
    },
    rich_snippet: {
      bottom: {
        extensions: [
          "Region of origin: Horn of Africa and ‎South Ara...‎",
          "Color: Black, dark brown, light brown, beige",
          "Introduced: 15th century",
        ],
        detected_extensions: {
          introduced_th_century: 15,
        },
      },
    },
    about_this_result: {
      source: {
        description:
          "Wikipedia is a multilingual free online encyclopedia written and maintained by a community of volunteers through open collaboration and a wiki-based editing system. Individual contributors, also called editors, are known as Wikipedians. Wikipedia is the largest and most-read reference work in history.",
        icon: "https://serpapi.com/searches/62c1ba9ef55d774dfd018a03/images/b7cc67a2b78dbb467fd73da3a5c83de3a991c60432db4437d53a378874df5fd3c8eee73e16e6b2baf77aba3b1336b6b6.png",
      },
      keywords: ["coffee"],
      languages: ["English"],
      regions: ["the United States"],
    },
    about_page_link:
      "https://www.google.com/search?q=About+https://en.wikipedia.org/wiki/Coffee&tbm=ilp&ilps=ADNMCi0tVhSB-fGHOJYgrIxB0xlXYrPGPA",
    cached_page_link:
      "https://webcache.googleusercontent.com/search?q=cache:U6oJMnF-eeUJ:https://en.wikipedia.org/wiki/Coffee+&cd=14&hl=en&ct=clnk&gl=us",
    related_pages_link:
      "https://www.google.com/search?q=related:https://en.wikipedia.org/wiki/Coffee+Coffee",
  },
  {
    position: 2,
    title: "The Coffee Bean & Tea Leaf | CBTL",
    link: "https://www.coffeebean.com/",
    displayed_link: "https://www.coffeebean.com",
    snippet:
      "Born and brewed in Southern California since 1963, The Coffee Bean & Tea Leaf® is passionate about connecting loyal customers with carefully handcrafted ...",
    snippet_highlighted_words: ["Coffee"],
    about_this_result: {
      source: {
        description:
          "The Coffee Bean & Tea Leaf is an American coffee shop chain founded in 1963. Since 2019, it is a trade name of Ireland-based Super Magnificent Coffee Company Ireland Limited, itself wholly owned subsidiary of multinational Jollibee Foods Corporation.",
        icon: "https://serpapi.com/searches/62c1ba9ef55d774dfd018a03/images/b7cc67a2b78dbb467fd73da3a5c83de37f4dd49485528fe7b21de475d2107126d1322bc34dca9b3f60f1c42148ce2d4e.png",
      },
      keywords: ["coffee"],
      languages: ["English"],
      regions: ["the United States"],
    },
    about_page_link:
      "https://www.google.com/search?q=About+https://www.coffeebean.com/&tbm=ilp&ilps=ADNMCi2oSYB5WqnhmnflS86OdMdpjMzz9g",
    cached_page_link:
      "https://webcache.googleusercontent.com/search?q=cache:WpQxSYo2c6AJ:https://www.coffeebean.com/+&cd=15&hl=en&ct=clnk&gl=us",
    related_pages_link:
      "https://www.google.com/search?q=related:https://www.coffeebean.com/+Coffee",
  },
  {
    position: 3,
    title: "The History of Coffee - National Coffee Association",
    link: "https://www.ncausa.org/about-coffee/history-of-coffee",
    displayed_link: "https://www.ncausa.org › ... › History of Coffee",
    snippet:
      "Coffee grown worldwide can trace its heritage back centuries to the ancient coffee forests on the Ethiopian plateau. There, legend says the goat herder ...",
    snippet_highlighted_words: ["Coffee", "coffee"],
    sitelinks: {
      inline: [
        {
          title: "An Ethiopian Legend",
          link: "https://www.ncausa.org/about-coffee/history-of-coffee#:~:text=An%20Ethiopian%20Legend",
        },
        {
          title: "The Arabian Peninsula",
          link: "https://www.ncausa.org/about-coffee/history-of-coffee#:~:text=The%20Arabian%20Peninsula,-Coffee%20cultivation%20and%20trade%20began",
        },
        {
          title: "Coffee Comes To Europe",
          link: "https://www.ncausa.org/about-coffee/history-of-coffee#:~:text=Coffee%20Comes%20to%20Europe",
        },
      ],
    },
    about_this_result: {
      source: {
        description:
          "The National Coffee Association or, is the main market research, consumer information, and lobbying association for the coffee industry in the United States.",
      },
      keywords: ["coffee"],
      languages: ["English"],
      regions: ["the United States"],
    },
    about_page_link:
      "https://www.google.com/search?q=About+https://www.ncausa.org/about-coffee/history-of-coffee&tbm=ilp&ilps=ADNMCi2T6KU_7eHEV4EzZS1EnLrQVwD53A",
    cached_page_link:
      "https://webcache.googleusercontent.com/search?q=cache:v1hp0SS8WggJ:https://www.ncausa.org/about-coffee/history-of-coffee+&cd=16&hl=en&ct=clnk&gl=us",
  },
  {
    position: 4,
    title: "9 Health Benefits of Coffee, Based on Science - Healthline",
    link: "https://www.healthline.com/nutrition/top-evidence-based-health-benefits-of-coffee",
    displayed_link:
      "https://www.healthline.com › nutrition › top-evidence-b...",
    snippet:
      "Coffee is a major source of antioxidants in the diet. It has many health benefits, such as improved brain function and a lower risk of several diseases.",
    snippet_highlighted_words: ["Coffee"],
    sitelinks: {
      inline: [
        {
          title: "1. Boosts Energy Levels",
          link: "https://www.healthline.com/nutrition/top-evidence-based-health-benefits-of-coffee#:~:text=1.%20Boosts%20energy%20levels",
        },
        {
          title: "2. May Be Linked To A Lower...",
          link: "https://www.healthline.com/nutrition/top-evidence-based-health-benefits-of-coffee#:~:text=2.%20May%20be%20linked%20to%20a%20lower%20risk%20of%20type%202%20diabetes",
        },
        {
          title: "3. Could Support Brain...",
          link: "https://www.healthline.com/nutrition/top-evidence-based-health-benefits-of-coffee#:~:text=3.%20Could%20support%20brain%20health",
        },
      ],
    },
    about_this_result: {
      source: {
        description:
          "Healthline Media, Inc. is an American website and provider of health information headquartered in San Francisco, California. It was founded in its current form 2006 and established as a standalone entity in January 2016.",
        icon: "https://serpapi.com/searches/62c1ba9ef55d774dfd018a03/images/b7cc67a2b78dbb467fd73da3a5c83de339c2b8dc2d17f23567c77e0bbc2f014386fb25182a64ce9fe79002d3e19a37e4.png",
      },
      keywords: ["coffee"],
      languages: ["English"],
      regions: ["the United States"],
    },
    about_page_link:
      "https://www.google.com/search?q=About+https://www.healthline.com/nutrition/top-evidence-based-health-benefits-of-coffee&tbm=ilp&ilps=ADNMCi005zP34LoVlgtSYcT3k6ep4HgZPQ",
    cached_page_link:
      "https://webcache.googleusercontent.com/search?q=cache:r1UW6FGz3F4J:https://www.healthline.com/nutrition/top-evidence-based-health-benefits-of-coffee+&cd=17&hl=en&ct=clnk&gl=us",
  },
  {
    position: 5,
    title: "coffee | Origin, Types, Uses, History, & Facts | Britannica",
    link: "https://www.britannica.com/topic/coffee",
    displayed_link: "https://www.britannica.com › ... › Food",
    date: "May 17, 2022",
    snippet:
      "coffee, beverage brewed from the roasted and ground seeds of the tropical evergreen coffee plants of African origin. Coffee is one of the ...",
    snippet_highlighted_words: ["coffee", "coffee", "Coffee"],
    about_this_result: {
      source: {
        description:
          "britannica.com was first indexed by Google more than 10 years ago",
        icon: "https://serpapi.com/searches/62c1ba9ef55d774dfd018a03/images/b7cc67a2b78dbb467fd73da3a5c83de3d94b9642f9e73eae53139d628085d840c483d7851a2d359fa0ad991302dd4dc3.png",
      },
      keywords: ["coffee"],
      languages: ["English"],
      regions: ["the United States"],
    },
    about_page_link:
      "https://www.google.com/search?q=About+https://www.britannica.com/topic/coffee&tbm=ilp&ilps=ADNMCi0xG2ABk5g9BrBwiawxBsBHMAwr8A",
    cached_page_link:
      "https://webcache.googleusercontent.com/search?q=cache:Wikbu4ipU28J:https://www.britannica.com/topic/coffee+&cd=18&hl=en&ct=clnk&gl=us",
    related_pages_link:
      "https://www.google.com/search?q=related:https://www.britannica.com/topic/coffee+Coffee",
  },
  {
    position: 6,
    title: "Peet's Coffee: The Original Craft Coffee",
    link: "https://www.peets.com/",
    displayed_link: "https://www.peets.com",
    snippet:
      "Since 1966, Peet's Coffee has offered superior coffees and teas by sourcing the best quality coffee beans and tea leaves in the world and adhering to strict ...",
    snippet_highlighted_words: ["Coffee", "coffees", "coffee"],
    about_this_result: {
      source: {
        description:
          "Peet's Coffee is a San Francisco Bay Area-based specialty coffee roaster and retailer owned by JAB Holding Company via JDE Peet's.",
        icon: "https://serpapi.com/searches/62c1ba9ef55d774dfd018a03/images/b7cc67a2b78dbb467fd73da3a5c83de37df725a437f7ce9737eb1dd6b39997770635523bf5e28f914a51454c2769e162.png",
      },
      keywords: ["coffee"],
      related_keywords: ["coffees"],
      languages: ["English"],
      regions: ["California"],
    },
    about_page_link:
      "https://www.google.com/search?q=About+https://www.peets.com/&tbm=ilp&ilps=ADNMCi2xqgiMSzEyTwg-QewuVQYGctzClw",
    cached_page_link:
      "https://webcache.googleusercontent.com/search?q=cache:BCjzno6zP6wJ:https://www.peets.com/+&cd=19&hl=en&ct=clnk&gl=us",
    related_pages_link:
      "https://www.google.com/search?q=related:https://www.peets.com/+Coffee",
  },
  {
    position: 7,
    title: "Starbucks Coffee Company",
    link: "https://www.starbucks.com/",
    displayed_link: "https://www.starbucks.com",
    snippet:
      "More than just great coffee. Explore the menu, sign up for Starbucks® Rewards, manage your gift card and more.",
    snippet_highlighted_words: ["coffee"],
    about_this_result: {
      source: {
        description:
          "Starbucks Corporation is an American multinational chain of coffeehouses and roastery reserves headquartered in Seattle, Washington. It is the world's largest coffeehouse chain.\nAs of November 2021, the company had 33,833 stores in 80 countries, 15,444 of which were located in the United States.",
        icon: "https://serpapi.com/searches/62c1ba9ef55d774dfd018a03/images/b7cc67a2b78dbb467fd73da3a5c83de3ad916b247a53360f0877bed9eba55dd7f02f4cc3b02948c98349d227b7e0c3a1.png",
      },
      keywords: ["coffee"],
      languages: ["English"],
      regions: ["the United States"],
    },
    about_page_link:
      "https://www.google.com/search?q=About+https://www.starbucks.com/&tbm=ilp&ilps=ADNMCi0cMyV0H7KdBl4d_vac7u0R1ouGYg",
    cached_page_link:
      "https://webcache.googleusercontent.com/search?q=cache:1vGXgo_FlHkJ:https://www.starbucks.com/+&cd=20&hl=en&ct=clnk&gl=us",
    related_pages_link:
      "https://www.google.com/search?q=related:https://www.starbucks.com/+Coffee",
  },
  {
    position: 8,
    title: "Coffee | The Nutrition Source",
    link: "https://www.hsph.harvard.edu/nutritionsource/food-features/coffee/",
    displayed_link: "https://www.hsph.harvard.edu › ... › Food Features",
    snippet:
      "Coffee beans are the seeds of a fruit called a coffee cherry. Coffee cherries grow on coffee trees from a genus of plants called Coffea. There are a wide ...",
    snippet_highlighted_words: ["Coffee", "coffee", "Coffee", "coffee"],
    sitelinks: {
      inline: [
        {
          title: "Coffee And Health",
          link: "https://www.hsph.harvard.edu/nutritionsource/food-features/coffee/#:~:text=Coffee%20and%20Health",
        },
        {
          title: "Types",
          link: "https://www.hsph.harvard.edu/nutritionsource/food-features/coffee/#:~:text=Types,-Coffee%20beans%20are%20the%20seeds",
        },
        {
          title: "Make",
          link: "https://www.hsph.harvard.edu/nutritionsource/food-features/coffee/#:~:text=",
        },
      ],
    },
    about_this_result: {
      source: {
        description:
          "The Harvard T.H. Chan School of Public Health is the public health school of Harvard University, located in the Longwood Medical Area of Boston, Massachusetts.",
        icon: "https://serpapi.com/searches/62c1ba9ef55d774dfd018a03/images/b7cc67a2b78dbb467fd73da3a5c83de3229aae72459d52def89429ddcb1d5343f77deb2f4657de73e4f71607635e3ae3.png",
      },
      keywords: ["coffee"],
      languages: ["English"],
      regions: ["the United States"],
    },
    about_page_link:
      "https://www.google.com/search?q=About+https://www.hsph.harvard.edu/nutritionsource/food-features/coffee/&tbm=ilp&ilps=ADNMCi3F4RO_DIqjcm9VUCXmfmpqrX5h3w",
    cached_page_link:
      "https://webcache.googleusercontent.com/search?q=cache:aCQFR0EWgPwJ:https://www.hsph.harvard.edu/nutritionsource/food-features/coffee/+&cd=24&hl=en&ct=clnk&gl=us",
  },
];

const getSerp = (searchTerm) => {
  return new Promise((resolve) => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      `https://serpapi.com/search.json?engine=google&q=${searchTerm}&api_key=${serpAPIKEY}&num=77`,
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
    console.log(serpRes);

    let storageRes = await getFromStorage(["history", "staticResult"]);
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
    console.log(reveresed);
    let data = [];
    console.log(submittedCount);
    if (submittedCount.length === 0) submittedCount.length = 3;
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
  let storageRes = await getFromStorage([
    "userId",
    "history",
    "submittedKeywords",
  ]);
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
    storageRes.submittedKeywords.push(task.keyword);
    saveToStorage({ submittedKeywords: storageRes.submittedKeywords });
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

const getServey = async () => {
  let storageRes = await getFromStorage("serveyQuestions");
  fetch(`${APIURL}?type=surveyQuesions`)
    .then((result) => result.json())
    .then((data) => {
      console.log(data);
      let filtered = [];
      if (!storageRes.serveyQuestions) {
        saveToStorage({ serveyQuestions: data.data });
        return;
      }
      for (let d of data.data) {
        let found = storageRes.serveyQuestions.find(
          (s) => s.question === d.question
        );
        if (!found) {
          filtered.push(d);
        }
      }
      if (filtered.length > 0) {
        storageRes.serveyQuestions = [
          ...storageRes.serveyQuestions,
          ...filtered,
        ];
        saveToStorage({ serveyQuestions: storageRes.serveyQuestions });
      }
    })
    .catch((err) => console.log(err));
};

const answerServey = (data) => {
  return new Promise(async (resolve) => {
    let storageRes = await getFromStorage(["userId", "serveyQuestions"]);
    const raw = JSON.stringify({
      userId: storageRes.userId,
      type: "serveyAnswers",
      servey: data,
    });

    let res = await postData(raw);
    for (let answered of data) {
      let index = storageRes.serveyQuestions.indexOf(
        storageRes.serveyQuestions.find((s) => s.question === answered.question)
      );
      storageRes.serveyQuestions[index].answer = answered.answer;
    }
    saveToStorage({ serveyQuestions: storageRes.serveyQuestions });
    resolve(res);
  });
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
    whitelistedKeywords: [],
    searchHistoryCheck: true,
    staticResult: staticResult,
    submittedKeywords: [],
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
  if (msg.command === "answerServey") {
    (async () => {
      let res = answerServey(msg.data);
      sendResponse(res);
    })();
  }
  if (msg.command === "init") {
    getServey();
  }
  return true;
});

const openWindow = () => {
  chrome.windows.getCurrent((tabWindow) => {
    const width = 760;
    const height = 570;
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
  getServey();
};

init();
