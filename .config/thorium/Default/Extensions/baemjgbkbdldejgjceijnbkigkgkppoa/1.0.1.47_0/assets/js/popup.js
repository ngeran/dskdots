var STATE

function setTitle(title) {
    document.querySelector(".content.header .text").innerHTML = title
}

function partPageLink() {
    return (
        (
            STATE.siteData &&
            STATE.siteData.lookupInfo &&
            STATE.siteData.lookupInfo._links &&
            STATE.siteData.lookupInfo._links.self &&
            STATE.siteData.lookupInfo._links.self.href
        ) ?
            `https://snapeda.com/${STATE.siteData.lookupInfo._links.self.href}?plugin=snap_extension` :
            `https://www.snapeda.com/search/?q=${escape(STATE.siteData.partInfo.name)}&search-type=parts&plugin=snap_extension`
    )
}

function updateView(state) {
    STATE = state
    tabsSetTitle("main", "component", "SnapMagic")

    isPartFound = STATE.siteData.lookupInfo && STATE.siteData.lookupInfo.has_symbol

    document.querySelector("div.signin").style.display = STATE.isAuthenticated ? "none" : "flex"
    document.querySelector("div.profile").style.display = STATE.isAuthenticated ? "flex" : "none"

    document.querySelector(".avatar").innerHTML = STATE.username[0]

    document.querySelector(".profile .info .detail .username").innerHTML = STATE.username
    document.querySelector(".profile .info .detail .balance").innerHTML = Intl.NumberFormat().format(STATE.credits)

    document.querySelector("div.component").style.display = STATE.siteData.isSupported ? "flex" : "none"
    document.querySelector("div.sitenotsupported").style.display = STATE.siteData.isSupported ? "none" : "flex"

    document.querySelector(".partimages2d.available").style.display = isPartFound ? "flex" : "none"
    document.querySelector(".partimages2d.request").style.display = isPartFound ? "none" : "flex"
    document.querySelector(".partimage3d.available").style.display = (STATE.siteData.lookupInfo && STATE.siteData.lookupInfo.has_3d) ? "flex" : "none"
    document.querySelector(".partimage3d.request").style.display = (STATE.siteData.lookupInfo && STATE.siteData.lookupInfo.has_3d) ? "none" : "flex"

    if (STATE.siteData.isSupported) {
        if (STATE.siteData.partInfo.name) {
            title = `
                <div class="part_manufacturer">
                    <span>
                        ${STATE.siteData.lookupInfo && "manufacturer" in STATE.siteData.lookupInfo ? STATE.siteData.lookupInfo.manufacturer : STATE.siteData.partInfo.manufacturer}
                    </span>
                </div>
                <div class="part_name">
                    <a target="_blank" href="${partPageLink()}">${STATE.siteData.lookupInfo && "part_number" in STATE.siteData.lookupInfo ? STATE.siteData.lookupInfo.part_number : STATE.siteData.partInfo.name}</a>
                </div>
            `
            document.getElementById('partPageLink').href = partPageLink()
            tabsSetTitle("main", "component", title)
            if (tabsGetActive("main") === "component") {
                setTitle(title)
            }

            if (STATE.siteData.lookupInfo) {
                meduimlinks = STATE.siteData.lookupInfo.models && STATE.siteData.lookupInfo.models[0] ? STATE.siteData.lookupInfo.models[0] : null

                document.querySelector(".partimage2d.symbol.available").style.display = meduimlinks && STATE.siteData.lookupInfo.has_symbol && "symbol_medium" in meduimlinks ? "flex" : "none"
                document.querySelector(".partimage2d.symbol.request").style.display = STATE.siteData.lookupInfo.has_symbol ? "none" : "flex"
                document.querySelector(".partimage2d.symbol.nopreview").style.display = STATE.siteData.lookupInfo.has_symbol && (!meduimlinks || !("symbol_medium" in meduimlinks)) ? "flex" : "none"
                document.querySelector(".partimage2d.footprint.available").style.display = meduimlinks && STATE.siteData.lookupInfo.has_footprint && "package_medium" in meduimlinks ? "flex" : "none"
                document.querySelector(".partimage2d.footprint.request").style.display = STATE.siteData.lookupInfo.has_footprint ? "none" : "flex"
                document.querySelector(".partimage2d.footprint.nopreview").style.display = STATE.siteData.lookupInfo.has_footprint && (!meduimlinks || !("package_medium" in meduimlinks)) ? "flex" : "none"

                document.getElementById("package2d").src = meduimlinks && "package_medium" in meduimlinks ? meduimlinks["package_medium"].url : ""
                document.getElementById("symbol2d").src = meduimlinks && "symbol_medium" in meduimlinks ? meduimlinks["symbol_medium"].url : ""

                is_3d_preview = STATE.siteData.lookupInfo.has_3d && meduimlinks && "3dmodel_medium" in meduimlinks;
                document.querySelector(".partimage3d.available .image").style.display = is_3d_preview ? "flex" : "none"
                document.querySelector(".partimage3d.available .nopreview").style.display = is_3d_preview ? "none" : "flex"
                if (is_3d_preview) {
                    document.getElementById("model3d").src = meduimlinks["3dmodel_medium"].url
                }
            }
        } else {

        }
    }
}

function formSignInInputChanged() {
    document.querySelectorAll(".signin input, .signin .title, .loginerror").forEach(function (element) {
        element.classList.remove("error")
    })
}

function tabsMainActiveChanged(currentTab) {
    title = tabsGetTitle("main", currentTab)
    setTitle(title)
}

function btnLogoutClick() {
    chrome.runtime.sendMessage({ func: "SnapEDA_PB_Logout" })
}

function formSignInSubmit(event) {
    event.preventDefault()
    chrome.runtime.sendMessage({ func: "SnapEDA_PB_Login", username: document.getElementById("username").value, password: document.getElementById("password").value })
}

function snapFileDownload() {
    jsonData = {
        "u_token": STATE.token,
        "part_number": STATE.siteData.partInfo.name,
        "manufacturer": STATE.siteData.partInfo.manufacturer,
        "mode": "place-part",
        "plugin": ".snap",
        "source": "https://www.snapeda.com",
    }

    json = JSON.stringify(jsonData)
    url = URL.createObjectURL(new Blob([json], { type: "application/octet-stream" }));

    chrome.runtime.sendMessage({
        func: "SnapEDA_PB_Download_Json",
        data: {
            url: url,
            filename: STATE.siteData.partInfo.name + ".snap",
        }
    })
}

chrome.storage.sync.get({ DOWNLOAD_NOTIFY_SHOWN: false }, function (data) {
    if (!data.DOWNLOAD_NOTIFY_SHOWN) {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
            chrome.storage.sync.set({ DOWNLOAD_NOTIFY_SHOWN: true }, function () {
                chrome.tabs.sendMessage(tab[0].id, { func: "SnapEDA_PC_ShowDownloadNotification", data: STATE })
                close()
            })
        })
    }
})


function btnDownload2DClick() {
    // if (STATE.isAuthenticated) {
    snapFileDownload()
    // } else {
    //     tabsSetActive("main", "profile")
    // }
}

function stepFileDownload() {
    chrome.runtime.sendMessage({
        func: "SnapEDA_PB_Download_Step",
        data: {
            part_number: STATE.siteData.partInfo.name,
            manufacturer: STATE.siteData.partInfo.manufacturer,
            format: "step",
        }
    })
}

function btnDownload3DClick() {
    // if (STATE.isAuthenticated) {
    document.getElementById("btnDownload2D").disabled = true
    document.getElementById("btnDownload3D").disabled = true
    stepFileDownload()
    // } else {
    //     tabsSetActive("main", "profile")
    // }
}

function btnRequestClick() {
    window.open(partPageLink(), "_blank")
}

function clearDiscoverResults() {
    document.querySelector(".discoverysample").style.display = "none"
    items = document.querySelector(".discoverresult .items")
    document.querySelectorAll(".discoverresult .item").forEach(element => {
        items.removeChild(element)
    })

    discoverElement = document.querySelector(".discoverresult")
    discoverElement.data = null
    discoverElement.datalast = -1
}

function setDiscoverResults(data) {
    discoverElement = document.querySelector(".discoverresult")
    discoverElement.data = data
    discoverElement.datalast = -1
}

function displayDiscoverResults(number) {
    discoverElement = document.querySelector(".discoverresult")
    if (discoverElement.data) {
        items = document.querySelector(".discoverresult .items")
        last = discoverElement.datalast
        for (i = last + 1; i <= (last + number) && i < discoverElement.data.length; i++) {
            element = document.createElement("div")
            element.classList.add("item")
            element.innerHTML = `
                <img src="${"coverart" in discoverElement.data[i] ? discoverElement.data[i].coverart[0].url : "https://snapeda.s3.amazonaws.com/partpics/placeholder.jpg"}">
                <div class="partinfo">
                    <div class="name">
                        <a href="https://www.snapeda.com${discoverElement.data[i]._links.self.href}?plugin=snap_extension" target="_blank">${discoverElement.data[i].part_number}</a>
                    </div>
                    <div class="detail">${discoverElement.data[i].manufacturer}</div>
                </div>
                <div class="package">${"package" in discoverElement.data[i] ? discoverElement.data[i].package.name : "---"}</div>
            `
            items.appendChild(element)
            discoverElement.datalast = i
        }
    }
}

function discoverLookup() {
    clearDiscoverResults()
    value = document.getElementById("discoverquery").value
    if (value) {
        chrome.runtime.sendMessage({ func: "SnapEDA_PB_Discover", data: document.getElementById("discoverquery").value })
    }
}

function formDiscoverySubmit(event) {
    event.preventDefault()
    discoverLookup()
}

function discoverResultsItemsOnScroll(event) {
    items = document.querySelector(".items")
    if (items.scrollTop > (items.scrollHeight - (7 * 48))) {
        displayDiscoverResults(10)
    }
}

function discoverySampleClick(event) {
    event.preventDefault()
    document.getElementById("discoverquery").value = event.target.innerHTML
    formDiscoverySubmit(event)
}

function onDocumentReady() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
        chrome.tabs.sendMessage(tab[0].id, { func: "SnapEDA_PC_PopupOpened" })
    })
    chrome.runtime.onMessage.addListener(
        function (request, sender) {
            switch (request.func) {
                case "SnapEDA_IsAuthenticatedResponse":
                    if (!request.data) {
                        document.getElementById("btnLogin").onclick = btnLoginClick
                    } else {
                        document.getElementById("btnLogout").onclick = btnLogoutClick
                        chrome.runtime.sendMessage({ func: "SnapEDA_ProfileInfo" })
                    }
                    break;

                case "SnapEDA_ProfileInfoResponse":
                    if (request.data.result) {
                        document.getElementById("username").innerHTML = request.data.username
                        document.getElementById("credits").innerHTML = request.data.credits
                    }
                    break;

                case "SnapEDA_BP_Login":
                    document.getElementById("signin").disabled = false
                    if (!request.data.result) {
                        document.querySelectorAll(".signin input, .signin .title, .loginerror").forEach(function (element) {
                            element.classList.add("error")
                        })
                    }
                    break;

                case "SnapEDA_BP_Download":
                    document.getElementById("btnDownload2D").disabled = false
                    document.getElementById("btnDownload3D").disabled = false
                    if (request.data.result === "User not logged in") {
                        btnLogoutClick()
                    } else {
                        document.getElementById("frDownload").src = request.data.data.url
                    }
                    break;

                case "SnapEDA_BP_Request":
                    document.getElementById("btnRequest2DModel").disabled = false
                    document.getElementById("btnRequest2DSymbol").disabled = false
                    document.getElementById("btnRequest2DFootprint").disabled = false
                    document.getElementById("btnRequest3DModel").disabled = false

                    switch (request.data.result) {
                        case true:
                            document.getElementById("btnRequest2DModel").innerHTML = "Requested"
                            document.getElementById("btnRequest2DSymbol").innerHTML = "Requested"
                            document.getElementById("btnRequest2DFootprint").innerHTML = "Requested"
                            document.getElementById("btnRequest3DModel").innerHTML = "Requested"
                            break;
                        case "User not logged in":
                            btnLogoutClick()
                            break;
                        case "No credits remaining":
                            if (STATE.siteData.lookupInfo) {
                                window.open("https://www.snapeda.com" + STATE.siteData.lookupInfo._links.self.href, "_blank")
                            }
                            break;
                        default:
                            break;
                    }
                    break;

                case "SnapEDA_BP_Discover":
                    clearDiscoverResults()
                    if (request.data.result === true) {
                        setDiscoverResults(request.data.data)
                        displayDiscoverResults(10)
                    }
                    break;

                case "SnapEDA_BP_State":
                    updateView(request.data)
                    break;
            }
        }
    )

    chrome.runtime.sendMessage({ func: "SnapEDA_PB_State" })

    tabsInit("main", tabsMainActiveChanged)
    tabsInit("2d3d")

    document.getElementById("closewindow").onclick = function () { window.close() }
    document.getElementById("signin").onsubmit = formSignInSubmit
    document.getElementById("frmDiscovery").onsubmit = formDiscoverySubmit
    document.querySelector(".discoverresult .items").onscroll = discoverResultsItemsOnScroll
    document.querySelector(".searchbox a.submit").onclick = formDiscoverySubmit
    document.getElementById("btnLogout").onclick = btnLogoutClick
    document.getElementById("btnDownload2D").onclick = btnDownload2DClick
    document.getElementById("btnDownload3D").onclick = btnDownload3DClick
    document.getElementById("btnRequest2DSymbol").onclick = btnRequestClick
    document.getElementById("btnRequest2DFootprint").onclick = btnRequestClick
    document.getElementById("btnRequest2DModel").onclick = btnRequestClick
    document.getElementById("btnRequest3DModel").onclick = btnRequestClick
    document.querySelectorAll(".signin input").forEach(function (element) {
        element.addEventListener("input", formSignInInputChanged)
    })
    document.querySelectorAll(".discoverysample a").forEach(function (element) {
        element.addEventListener("click", discoverySampleClick)
    })
}

window.addEventListener("load", onDocumentReady, false)