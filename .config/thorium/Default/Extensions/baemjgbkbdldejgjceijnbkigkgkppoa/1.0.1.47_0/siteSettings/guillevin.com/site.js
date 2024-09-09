var snapEDASiteSettings = {
    "/product/.*": {
        partNameSelector: `ul.breadcrumbs > li:last-child`,
        partNamePattern: "^(.*)$",
        manufacturerSelector: `div.product-brand`,
        manufacturerPattern: "^(.*)$",
    },
}