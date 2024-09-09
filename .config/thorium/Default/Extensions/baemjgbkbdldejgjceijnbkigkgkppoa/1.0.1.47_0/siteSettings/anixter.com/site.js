var snapEDASiteSettings = {
    "/products/.*/p/": {
        partNameSelector: `span.inner-product-heading > b:nth-child(2)`,
        partNamePattern: "^(.*)$",
        manufacturerSelector: `span.inner-product-heading > b:nth-child(1)`,
        manufacturerPattern: "^(.*)$",
    },
}