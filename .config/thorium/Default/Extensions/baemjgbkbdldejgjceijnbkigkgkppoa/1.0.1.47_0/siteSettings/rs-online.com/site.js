var snapEDASiteSettings = {
    "rs-online\\.com/web/p/": {
        partNameSelector: `dl[data-testid="key-details-desktop"] > dt[data-testid="mpn-desktop"] + dd`,
        partNamePattern: "^(.*)$",
        manufacturerSelector: `dl[data-testid="key-details-desktop"] > dt[data-testid="brand-desktop"] + dd`,
        manufacturerPattern: "^(.*)$",
    },
    "rs-online\\.com/product/": {
        partNameSelector: `.manufacturer-part-number > span`,
        partNamePattern: "^(.*)$",
        manufacturerSelector: `.product-detail-page-component_info__1e43e > div:nth-child(2)`,
        manufacturerPattern: "^[^ ]+ (.*)$",
    },
    "rsdelivers.*/product/": {
        partNameSelector: `.product-detail-page-component_info__1e43e > div:last-child`,
        partNamePattern: "^[^:]+: (.*)$",
        manufacturerSelector: `.product-detail-page-component_info__1e43e > div:nth-child(2)`,
        manufacturerPattern: "^[^ ]+ (.*)$",
    },
}