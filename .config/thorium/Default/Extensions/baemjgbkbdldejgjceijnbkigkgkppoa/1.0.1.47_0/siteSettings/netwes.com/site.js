var snapEDASiteSettings = {
    "/product/": {
        partNameSelector: "div.description-box > p:nth-child(3)",
        partNamePattern: "^Part number:\s?(.*)$",
        manufacturerSelector: `h1.pageName`,
        manufacturerPattern: "^([^\\s]+).*$",
    },
}