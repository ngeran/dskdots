var snapEDADefaultSiteSettings = {
    partNameSelector: "",
    partNamePattern: "^(.*)$",
    partNameModifier: [],
    manufacturerSelector: "",
    manufacturerPattern: "^(.*)$",
    manufacturerOverride: null,

    popupContent: `
    <div class="snapeda-popup view found">
        <div class="snapeda-popup snapeda-header">
            <div class="snapeda-popup logo">
                <a target="_blank" href="https://snapeda.com/?plugin=snap_extension"><img height="23" src="#"></a>
            </div>
            <div class="snapeda-popup title">&nbsp;</div>
            <div class="snapeda-popup close">
                <a href="#"><img src="#"></a>
            </div>
        </div>
        <div class="snapeda-popup snapeda-content">
            <div class="snapeda-popup icon">
                <img src="#">
            </div>
            <div class="snapeda-popup text">
                <div class="snapeda-popup line1">CAD Model Available!</div>
                <div class="snapeda-popup line2">Design electronics in a snap.</div>
            </div>
        </div>
        <div class="snapeda-popup snapeda-footer">
            <div>Click on the&nbsp;</div>
            <div><img src="#"></div>
            <div>&nbsp;to download</div>
        </div>
    </div>
    <div class="snapeda-popup view download">
        <div class="snapeda-popup snapeda-header">
            <div class="snapeda-popup close">
                <a href="#"><img src="#"></a>
            </div>
        </div>
        <div class="snapeda-popup snapeda-content">
            <div class="snapeda-popup icon">
                <img src="#">
            </div>
            <div class="snapeda-popup text">
                <div class="snapeda-popup line1">You just downloaded the .snap format</div>
                <div class="snapeda-popup line2">This format is used by the SnapEDA Desktop App to auto-import into your CAD tool in a Snap!</div>
                <div class="snapeda-popup line3">Don’t have the app yet?</div>
            </div>
            <div class="snapeda-popup download">
                <div class="snapeda-popup snapeda-button"><a href="https://snapeda.com/desktop" target="_blank">Get it here</a></div>
            </div>
        </div>
    </div>
    `,
}