// -=-=-=-=-= HELPERS =-=-=-=-=-
function isObject(v) {
    return v && typeof v === "object" && !Array.isArray(v)
}

function isArray(v) {
    return v && typeof v === "object" && Array.isArray(v)
}

function eq(a, b) {
    if (isObject(a) && isObject(b)) {
        return JSON.stringify(a) === JSON.stringify(b)
    }

    if (isArray(a) && isArray(b)) {
        // very simple array comparison
        return JSON.stringify(a.sort()) === JSON.stringify(b.sort())
    }

    return a === b
}


// -=-=-=-=-= API =-=-=-=-=-
var DEFAULT_SEARCH_TOKEN = "7eBj9xbhYZHsm0zdzi4p8oaJAQmqEHXY"

function apiCall(endpoint, data, method, callback) {
    endpoint = (endpoint.includes("?") ? endpoint + "&" : endpoint + "?") + "plugin=snap_extension"
    fetch(`https://www.snapeda.com${endpoint}`, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, method: method, body: data })
        .then(response => {
            response.json()
                .then(responseJSON => {
                    callback(responseJSON)
                })
                .catch(err => { console.log("API error", err) })
        })
        .catch(err => { console.log("API error", err) })
}

async function apiIsAuthenticated() {
    var p = new Promise(function (resolve) {
        chrome.storage.sync.get({ APIKEY: "" }, function (data) {
            resolve(data.APIKEY !== "")
        })
    })
    return await p
}

async function apiLogin(username, password) {
    var p = new Promise(function (resolve) {
        var result = false
        var params = encodeURI("username=" + username + "&password=" + password)
        apiCall("account/api-login/", params, "POST", callback = (apiResult) => {
            if (apiResult) {
                if (apiResult.status === "logged_in") {
                    result = true;
                    chrome.storage.sync.set({ APIKEY: apiResult.token, USERNAME: apiResult.username, CREDITS: apiResult.credits }, function () {
                        resolve({ result: result })
                    })
                } else {
                    resolve({ result: apiResult.error })
                }
            }
        })
    })
    return await p
}

async function apiLogout() {
    var p = new Promise(function (resolve) {
        chrome.storage.sync.remove(["APIKEY", "USERNAME", "CREDITS"], function () {
            result = true;
            resolve({ result: result })
        })
    })
    return await p
}

async function apiProfileInfo() {
    var p = new Promise(function (resolve) {
        chrome.storage.sync.get({ USERNAME: "", CREDITS: "" }, function (data) {
            var result = {
                result: true,
                username: data.USERNAME,
                credits: data.CREDITS,
            }
            resolve(result)
        })
    })
    return await p
}

async function apiSearch(partInfo) {
    var p = new Promise(function (resolve) {
        chrome.storage.sync.get({ APIKEY: "" }, function (data) {
            var SEARCH_TOKEN = data.APIKEY || DEFAULT_SEARCH_TOKEN
            var params = "q=" + escape(partInfo.name) + "&token=" + SEARCH_TOKEN
            apiCall("/api/v1/parts/search?" + params, null, "GET", (apiResult) => {
                if (!apiResult.error && apiResult.results.length > 0) {
                    found = false
                    apiResult.results.forEach(element => {
                        if (!found &&
                            element.part_number.toLowerCase() === partInfo.name.toLowerCase() &&
                            (
                                element.manufacturer.toLowerCase().includes(partInfo.manufacturer.toLowerCase()) ||
                                partInfo.manufacturer.toLowerCase().includes(element.manufacturer.toLowerCase())
                            )
                        ) {
                            found = true;
                            resolve({ result: true, data: element, isAuthenticated: data.APIKEY !== "" })
                        }
                    });
                    if (!found) {
                        resolve({ result: false })
                    }
                } else {
                    resolve({ result: false })
                }
            })
        })
    })
    return await p
}

async function apiDiscover(query) {
    var p = new Promise(function (resolve) {
        chrome.storage.sync.get({ APIKEY: "" }, function (data) {
            var SEARCH_TOKEN = data.APIKEY || DEFAULT_SEARCH_TOKEN
            var params = "q=" + escape(query) + "&token=" + SEARCH_TOKEN + "&limit=1000"
            apiCall("/api/v1/parts/search?" + params, null, "GET", (apiResult) => {
                if (!apiResult.error) {
                    resolve({ result: true, data: apiResult.results })
                } else {
                    resolve({ result: false })
                }
            })
        })
    })
    return await p
}

async function apiDownload(partData, format) {
    var p = new Promise(function (resolve) {
        chrome.storage.sync.get({ APIKEY: DEFAULT_SEARCH_TOKEN }, function (data) {
            if (data.APIKEY) {
                params = "part_number=" + escape(partData.part_number) + "&manufacturer=" + escape(partData.manufacturer) + "&token=" + data.APIKEY + "&redirect=0&format=" + escape(format)
                apiCall("/api/v1/parts/download_part?" + params, null, "GET", callback = (apiResult) => {
                    if (!apiResult.error && apiResult.url) {
                        resolve({ result: true, data: apiResult })
                    } else {
                        resolve({ result: apiResult.error })
                    }
                })
            }
        })
    })
    return await p
}

async function apiRequest(partInfo) {
    var p = new Promise(function (resolve) {
        chrome.storage.sync.get({ APIKEY: "" }, function (data) {
            if (data.APIKEY) {
                params = "part_number=" + escape(partInfo.name) + "&manufacturer=" + escape(partInfo.manufacturer) + "&token=" + data.APIKEY + "&PartURL=" + escape(partInfo.url)
                apiCall("/api/v1/parts/request", params, "POST", callback = (apiResult) => {
                    if (!apiResult.error && apiResult.status === "request_sent") {
                        resolve({ result: true })
                    } else {
                        resolve({ result: apiResult.error })
                    }
                })
            }
        })
    })
    return await p
}


// -=-=-=-=-= BACKGROUND =-=-=-=-=-
async function apiToken() {
    var p = new Promise(function (resolve) {
        chrome.storage.sync.get({ APIKEY: DEFAULT_SEARCH_TOKEN }, function (data) {
            resolve(data.APIKEY)
        })
    })
    return await p
} var state = {
    activeTab: null,
    username: "",
    credits: 0,
    format: "eagle",
    isAuthenticated: false,
    token: "",
    tabs: {}
}

var sitePatterns = Array()

function initExtension() {
    apiIsAuthenticated().then(function (data) {
        state.isAuthenticated = data;
    })

    apiToken().then(function (data) {
        state.token = data;
    })

    chrome.storage.sync.get({ USERNAME: "", CREDITS: 0, FORMAT: "" }, function (data) {
        state.username = data.USERNAME
        state.credits = data.CREDITS
        state.format = data.FORMAT
    })

    fetch(chrome.runtime.getURL("siteSettings/sites.dir")).then(response => {
        response.text().then(siteSettingsDir => {
            siteSettingsDir.match(/[^\r\n]+/g).forEach(supportedSite => {
                if (supportedSite !== "_default") {
                    fetch(chrome.runtime.getURL(`siteSettings/${supportedSite}/patterns.txt`))
                        .then(response => {
                            response.text().then(patternsContent => {
                                if (patternsContent) {
                                    patternsArray = patternsContent.match(/[^\r\n]+/g)
                                    sitePatterns.push({
                                        patterns: patternsArray,
                                        dir: supportedSite
                                    })
                                }
                            })
                        })
                        .catch(function (err) {
                            console.log(`Error fetching ${supportedSite}`, err)
                        })
                }
            })
        })
    })
}

function sendStateUpdate(tab) {
    apiToken().then(function (data) {
        chrome.runtime.sendMessage({
            func: "SnapEDA_BP_State",
            data: {
                isAuthenticated: state.isAuthenticated,
                username: state.username,
                credits: state.credits,
                format: state.format,
                token: data,
                siteData: state.activeTab in state.tabs ? state.tabs[state.activeTab] : { isSupported: false, lookupInfo: null }
            }
        }).catch(() => { })
        if (tab) {
            chrome.tabs.sendMessage(tab, { func: "SnapEDA_BT_State", state: state.tabs[tab] }).catch(() => { })
        }
    })
}

function injectContentScript(tab) {
    if (tab) {
        chrome.tabs.get(tab, function (tabObject) {
            if (tabObject) {
                sitePatterns.forEach(siteEntry => {
                    siteEntry.patterns.forEach(pattern => {
                        if (pattern) {
                            var rePattern = "^https?://" + pattern + "/"
                            var re = new RegExp(rePattern, "i")
                            if (re.test(tabObject.url)) {
                                state.tabs[tab].isSupported = true
                                chrome.scripting.insertCSS({ target: { tabId: tab }, files: ["assets/css/opensans.css", "siteSettings/_default/site.css"] })
                                chrome.scripting.executeScript({ target: { tabId: tab }, files: ["siteSettings/_default/site.js"] }).then(function () {
                                    chrome.scripting.executeScript({ target: { tabId: tab }, files: ["siteSettings/" + siteEntry.dir + "/site.js"] }).then(function () {
                                        chrome.scripting.executeScript({ target: { tabId: tab }, files: ["assets/js/content.js"] })
                                    })
                                })
                            }
                        }
                    })
                })
                updateIcon(tab)
            }
        })
    }
}

function initExtensionForTab(tab) {
    if (tab) {
        state.tabs[tab] = {
            extensionURL: chrome.runtime.getURL(""),
            isSupported: false,
            partInfo: {
                name: "",
                manufacturer: "",
                url: ""
            },
            lookupInfo: null
        }

        injectContentScript(tab)
    }
}

function removeExtensionForTab(tab) {
    if (tab) {
        if (tab in state.tabs) {
            delete (state.tabs[tab])
            lookupInfoChanged(tab)
        }
    }
}

chrome.tabs.onUpdated.addListener(function (tab, changeInfo) {
    if (tab) {
        switch (changeInfo.status) {
            case "complete":
                initExtensionForTab(tab)
                break;
            case "loading":
                removeExtensionForTab(tab)
                break;
        }
    }
});

function updateIcon(tab) {
    if (tab) {
        if (state.activeTab in state.tabs && state.tabs[state.activeTab].isSupported) {
            chrome.action.setIcon({
                path: {
                    "16": "/assets/icons/logo/16-color.png",
                    "32": "/assets/icons/logo/32-color.png",
                    "64": "/assets/icons/logo/64-color.png",
                    "128": "/assets/icons/logo/128-color.png",
                    "256": "/assets/icons/logo/256-color.png"
                }
            });
            if (
                state.tabs[state.activeTab].lookupInfo &&
                state.tabs[state.activeTab].lookupInfo.has_symbol
            ) {
                chrome.action.setBadgeText({ text: "✓" })
                chrome.action.setBadgeBackgroundColor({ color: "#3B6285" })
            } else {
                chrome.action.setBadgeText({ text: "" })
            }
        } else {
            chrome.action.setBadgeText({ text: "" })
            chrome.action.setIcon({
                path: {
                    "16": "/assets/icons/logo/16-gray.png",
                    "32": "/assets/icons/logo/32-gray.png",
                    "64": "/assets/icons/logo/64-gray.png",
                    "128": "/assets/icons/logo/128-gray.png",
                    "256": "/assets/icons/logo/256-gray.png"
                }
            });
        }
    }
}

function activeTabChanged(tab) {
    if (tab) {
        state.activeTab = tab
        if (!(tab in state.tabs)) {
            initExtensionForTab(tab)
        } else {
            updateIcon(tab)
            sendStateUpdate(tab)
        }
    }
}

chrome.tabs.onActivated.addListener(
    function (activeInfo) {
        activeTabChanged(activeInfo.tabId)
    }
)

chrome.windows.onFocusChanged.addListener(function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        activeTabChanged(tabs.length === 0 ? null : tabs[0].id)
    })
})

function lookupInfoChanged(tab) {
    if (tab) {
        updateIcon(tab)
        sendStateUpdate(tab)
    }
}

function partLookup(tab) {
    if (tab) {
        if (state.tabs[tab].partInfo.name) {
            apiSearch(state.tabs[tab].partInfo).then(function (data) {
                if (tab in state.tabs) {
                    state.tabs[tab].lookupInfo = data.data
                    lookupInfoChanged(tab)
                }
            })
        }
    }
}

function partNameChanged(tab) {
    if (tab) {
        state.tabs[tab].lookupInfo = null
        lookupInfoChanged(tab)
        partLookup(tab)
    }
}

chrome.tabs.onRemoved.addListener(
    function (tab) {
        removeExtensionForTab(tab)
    }
)

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        tab = "tab" in sender ? sender.tab.id : sender.id

        switch (request.func) {
            case "SnapEDA_CB_PartInfo":
                if (!(tab in state.tabs) || !("partInfo" in state.tabs[tab]) || !eq(state.tabs[tab].partInfo, request.partInfo)) {
                    state.tabs[tab].partInfo = request.partInfo
                    state.tabs[tab].partInfo.url = sender.tab.url
                    partNameChanged(tab)
                }
                break;

            case "SnapEDA_PB_Login":
                apiLogin(request.username, request.password).then(function (data) {
                    chrome.runtime.sendMessage({ func: "SnapEDA_BP_Login", data: data })
                    state.isAuthenticated = data.result === true ? true : false
                    chrome.storage.sync.get({ USERNAME: "", CREDITS: 0, FORMAT: "" }, function (data) {
                        state.username = data.USERNAME
                        state.credits = data.CREDITS
                        state.format = data.FORMAT
                        sendStateUpdate(null)
                    })
                })
                break;

            case "SnapEDA_PB_Logout":
                apiLogout().then(function (data) {
                    state.isAuthenticated = false;
                    chrome.storage.sync.get({ USERNAME: "", CREDITS: 0, FORMAT: "" }, function (data) {
                        state.username = data.USERNAME
                        state.credits = data.CREDITS
                        state.format = data.FORMAT
                        sendStateUpdate(null)
                    })
                })
                break;

            case "SnapEDA_PB_Download_Step":
                chrome.storage.sync.get({ FORMAT: "eagle" }, function (data) {
                    format = data.FORMAT
                    if ("format" in request.data) {
                        format = request.data.format
                    };
                    if (format !== "step" && state.format !== format) {
                        chrome.storage.sync.set({ FORMAT: format })
                        state.format = format
                    }
                    apiDownload(request.data, format).then(function (data) {
                        chrome.runtime.sendMessage({ func: "SnapEDA_BP_Download", data: data })
                    })
                })
                break;

            case "SnapEDA_PB_Download_Json":
                chrome.downloads.download({
                    url: request.data.url,
                    filename: request.data.filename,
                    conflictAction: "overwrite",
                });
                break;

            case "SnapEDA_PB_Request":
                apiRequest(request.data).then(function (data) {
                    chrome.runtime.sendMessage({ func: "SnapEDA_BP_Request", data: data })
                })
                break;

            case "SnapEDA_PB_Discover":
                apiDiscover(request.data).then(function (data) {
                    chrome.runtime.sendMessage({ func: "SnapEDA_BP_Discover", data: data })
                })
                break;

            case "SnapEDA_PB_State":
                sendStateUpdate(null)
                break;
        }
    }
)

initExtension()
