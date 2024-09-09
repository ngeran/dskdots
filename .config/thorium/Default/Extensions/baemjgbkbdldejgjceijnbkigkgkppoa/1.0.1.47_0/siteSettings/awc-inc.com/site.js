var snapEDASiteSettings = {
    "/product/": {
        partNameSelector: `h1.mfg-part-number > span`,
        partNamePattern: "^(.*)$",
        manufacturerSelector: `div.mfg-name > a[itemprop="name"]`,
        manufacturerPattern: "^(.*)$",
    },
}