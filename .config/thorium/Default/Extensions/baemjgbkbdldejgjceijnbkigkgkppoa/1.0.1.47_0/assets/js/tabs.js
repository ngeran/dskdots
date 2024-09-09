function tabsSwitchClick(event) {
    element = this
    while (!(element.classList.contains("tab") && element.classList.contains("switch"))) {
        element = element.parentElement
    }
    newTab = element.getAttribute("tab-id")
    while (!(element.classList.contains("tabs") && element.classList.contains("container"))) {
        element = element.parentElement
    }
    currentTab = element.getAttribute("tab-active")


    element.setAttribute("tab-active", newTab)
    if ((el = element.querySelector(`.tab.content[tab-id="${currentTab}"]`))) { el.classList.remove("active") }
    if ((el = element.querySelector(`.tab.switch[tab-id="${currentTab}"]`))) { el.classList.remove("active") }
    if ((el = element.querySelector(`.tab.switch[tab-id="${currentTab}"] a`))) { el.classList.remove("active") }
    if ((el = element.querySelector(`.tab.switch[tab-id="${currentTab}"] svg`))) { el.classList.remove("active") }
    if ((el = element.querySelector(`.tab.switch[tab-id="${currentTab}"] .indicator`))) { el.classList.remove("active") }
    if ((el = element.querySelector(`.tab.content[tab-id="${newTab}"]`))) { el.classList.add("active") }
    if ((el = element.querySelector(`.tab.switch[tab-id="${newTab}"]`))) { el.classList.add("active") }
    if ((el = element.querySelector(`.tab.switch[tab-id="${newTab}"] a`))) { el.classList.add("active") }
    if ((el = element.querySelector(`.tab.switch[tab-id="${newTab}"] svg`))) { el.classList.add("active") }
    if ((el = element.querySelector(`.tab.switch[tab-id="${newTab}"] .indicator`))) { el.classList.add("active") }
    if (element.tabsActiveChanged) {
        element.tabsActiveChanged(newTab)
    }
}

function tabsInit(tabGroup, activeChangedCallback = null) {
    var tabs = document.querySelector(`.tabs.container[tab-group="${tabGroup}"]`)
    tabs.tabsActiveChanged = activeChangedCallback
    tabs.querySelectorAll(".tab.switch").forEach(function(element) {
        element.addEventListener("click", tabsSwitchClick)
    })
    tabsSetActive(tabGroup, tabs.getAttribute("tab-active"))
}

function tabsSetActive(tabGroup, tabId) {
    if (tabId) {
        if ((el = document.querySelector(`.tabs.container[tab-group="${tabGroup}"]`).querySelector(`.tab.switch[tab-id="${tabId}"]`))) {
            el.click()
        }
    }
}

function tabsGetTitle(tabGroup, tabId) {
    result = ""
    if ((el = document.querySelector(`.tabs.container[tab-group="${tabGroup}"]`).querySelector(`.tab.content[tab-id="${tabId}"]`))) {
        var title = el.getAttribute("tab-title")
        if (typeof title === "string") {
            result = title
        }
    }
    return result
}

function tabsSetTitle(tabGroup, tabId, title) {
    if ((el = document.querySelector(`.tabs.container[tab-group="${tabGroup}"]`).querySelector(`.tab.content[tab-id="${tabId}"]`))) {
        var title = el.setAttribute("tab-title", title)
    }
}

function tabsGetActive(tabGroup) {
    result = null
    if ((el = document.querySelector(`.tabs.container[tab-group="${tabGroup}"] .tab.content.active`))) {
        result = el.getAttribute("tab-id")
    }
    return result
}