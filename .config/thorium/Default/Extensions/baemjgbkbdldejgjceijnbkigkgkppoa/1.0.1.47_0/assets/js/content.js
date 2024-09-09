var snapEDASettings = null
var attempt = 0
var attempt_max = 10

function displayPopup(data, mode = 0) {
    if (!snapEDASettings.closedByUser) {
        snapEdaPopup = document.querySelector(".snapeda-popup")
        if (!snapEdaPopup) {
            snapEdaPopup = document.createElement("div")
            snapEdaPopup.classList.add("hidden")
            snapEdaPopup.classList.add("snapeda-popup")
            snapEdaPopup.classList.add("snapeda-container")
            snapEdaPopup.innerHTML = snapEDASettings.popupContent
            document.body.appendChild(snapEdaPopup)

            snapEdaPopup.querySelector(".view.found .snapeda-header .logo img").src = data.extensionURL + "assets/icons/logo.svg"
            snapEdaPopup.querySelector(".view.found .snapeda-header .close img").src = data.extensionURL + "assets/icons/close.png"
            snapEdaPopup.querySelector(".view.found .snapeda-content .icon img").src = data.extensionURL + "assets/icons/chip.png"
            snapEdaPopup.querySelector(".view.found .snapeda-footer img").src = data.extensionURL + "assets/icons/logo-with-tick.png"
            snapEdaPopup.querySelector(".view.found .snapeda-header .close img").addEventListener("click", hidePopup)

            snapEdaPopup.querySelector(".view.download .snapeda-header .close img").src = data.extensionURL + "assets/icons/close.png"
            snapEdaPopup.querySelector(".view.download .snapeda-content .icon img").src = data.extensionURL + "assets/img/snapeda.svg"

            title = snapEdaPopup.querySelector(".snapeda-popup .snapeda-header .title")
            title.addEventListener("mousedown", function(event) {
                event.preventDefault()
                snapEDASettings.moveState = true;
                snapEDASettings.mousePosition = {
                    x: event.clientX,
                    y: event.clientY
                }
            })
            title.addEventListener("mouseup", function() {
                snapEDASettings.moveState = false;
            })
            document.addEventListener("mousemove", popupMove)
        }
        document.querySelectorAll(".snapeda-popup .view").forEach((element) => {
            element.style.display = "none";
        })
        switch (mode) {
            case 0:
                snapEdaPopup.classList.remove("hidden")
                snapEdaPopup.querySelector(".view.found").style.display = "flex";
                break;
            case 1:
                snapEdaPopup.classList.remove("hidden")
                snapEdaPopup.querySelector(".view.download").style.display = "flex";
                break;
        }
    }
}

function popupMove(event) {
    if (snapEDASettings && snapEDASettings.moveState) {
        event.preventDefault()
        snapEdaPopup.style.left = (snapEdaPopup.offsetLeft + (event.clientX - snapEDASettings.mousePosition.x)) + "px";
        snapEdaPopup.style.top = (snapEdaPopup.offsetTop + (event.clientY - snapEDASettings.mousePosition.y)) + "px";
        snapEDASettings.mousePosition = {
            x: event.clientX,
            y: event.clientY
        }
    }
}

function hidePopup(event, force) {
    if (event) {
        event.preventDefault()
        force = true
    }
    if (force) {
        // snapEDASettings.closedByUser = true;
    }
    document.removeEventListener("mousemove", popupMove)

    snapEdaPopup = document.querySelector(".snapeda-popup")
    if (snapEdaPopup) {
        snapEdaPopup.classList.add("hidden")
            // setTimeout(function() {
            //     if (snapEdaPopup.parentElement) {
            //         snapEdaPopup.parentElement.removeChild(snapEdaPopup)
            //     }
            // }, 1000)
    }
}

function getPartInfo() {
    attempt++
    if (snapEDASiteSettings) {
        for (pagePattern in snapEDASiteSettings) {
            var re = new RegExp(pagePattern, "i")
            if (re.test(window.location.href)) {
                snapEDASettings = Object.assign({}, snapEDADefaultSiteSettings, snapEDASiteSettings[pagePattern])

                partNameElement = document.querySelector(snapEDASettings.partNameSelector)
                partName = ""
                if (partNameElement) {
                    var re = new RegExp(snapEDASettings.partNamePattern, "i")
                    var matches = re.exec(partNameElement.innerText)
                    if (matches && "length" in matches && matches.length > 1) {
                        partName = matches[1].trim()
                    }
                    snapEDASettings.partNameModifier.forEach(modifier => {
                        re = new RegExp(modifier.search, "gi")
                        partName = partName.replace(re, modifier.replace)
                    })
                }

                partManufacturer = ""
                if (!snapEDASettings.manufacturerOverride) {
                    manufacturerElement = document.querySelector(snapEDASettings.manufacturerSelector)
                    if (manufacturerElement) {
                        var re = new RegExp(snapEDASettings.manufacturerPattern, "i")
                        var matches = re.exec(manufacturerElement.innerText)
                        if (matches && "length" in matches && matches.length > 1) {
                            partManufacturer = matches[1].trim()
                        }
                    }
                } else {
                    partManufacturer = snapEDASettings.manufacturerOverride
                }

                console.log("SNAPEDA: ", partName, partManufacturer)

                if (partName) {
                    chrome.runtime.onMessage.addListener(
                        function(request, sender) {
                            switch (request.func) {
                                case "SnapEDA_BT_State":
                                    snapEdaPopup = document.querySelector(".snapeda-popup")
                                    if (snapEdaPopup && (!request.state || !request.state.lookupInfo || !request.state.lookupInfo.has_symbol)) {
                                        hidePopup()
                                    };
                                    if (!snapEdaPopup && request.state && request.state.lookupInfo && request.state.lookupInfo.has_symbol) {
                                        displayPopup(request.state, 0)
                                    }
                                    break;
                                case "SnapEDA_PC_PopupOpened":
                                    hidePopup()
                                    break;
                                case "SnapEDA_PC_ShowDownloadNotification":
                                    displayPopup(request.state, 1)
                                    break;
                            }
                        }
                    )

                    chrome.runtime.sendMessage({ func: "SnapEDA_CB_PartInfo", partInfo: { name: partName, manufacturer: partManufacturer } })
                } else {
                    if (attempt < attempt_max) {
                        setTimeout(getPartInfo, 1000)
                    }
                }

                break;
            }
        }
    }
}

setTimeout(getPartInfo, 1000)