var snapEDASiteSettings = {
    "/productdetail": {
        partNameSelector: `h1.m-content`,
        partNamePattern: "^[\\s]*([^\\s\\n]+)",
        partNameModifier: [{
            search: "#$",
            replace: "B"
        }],
        manufacturerOverride: "Murata",
    },
}