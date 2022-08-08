const getFromStorage = (arr) =>
  new Promise((resolve) => {
    chrome.storage.local.get(arr, (res) => resolve(res));
  });

const saveToStorage = (obj) =>
  new Promise((resolve) => {
    chrome.storage.local.set(obj, () => resolve(true));
  });

const handleHistory = async (data) => {
  let storageRes = await getFromStorage("history");
  if (!storageRes.history) return;
  storageRes.history.push(data);
  saveToStorage(storageRes);
};

function init() {
  let timer = setInterval(() => {
    if (!window.location.origin.includes("google")) return;
    if (!window.location.href.includes("/search?q")) return;
    let searchInput = document.querySelector('input[class="gLFyf gsfi"]');
    if (!searchInput) return;
    clearInterval(timer);
    let url = window.location.href;
    handleHistory({
      date: new Date().toUTCString(),
      searchTerm: searchInput.value,
      url: url,
      submitted: false,
    });
  }, 500);
}

init();
