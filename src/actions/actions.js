export function saveToStorage(obj) {
    return new Promise(resolve => {
        chrome.storage.local.set(obj, res => resolve(true))
    })
}

export function getFromStorage(arr) {
    return new Promise(resolve => {
        chrome.storage.local.get(arr, res => resolve(res))
    })
}
export function sendMessage(msg) {
    return new Promise(resolve => {
        chrome.runtime.sendMessage(msg, response => resolve(response))
    })
}

