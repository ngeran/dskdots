var snapEDASiteSettings = {
    "microchipdirect\.com/product/": {
        partNameSelector: `nav[aria-label="breadcrumb"]+div > div > div > div:last-child > div > div`,
        partNamePattern: "^(.*)$",
        manufacturerOverride: "Microchip",
    },
    "microchip\.com.*/product/": {
        partNameSelector: `h1.dcf-title`,
        partNamePattern: "^(.*)$",
        manufacturerOverride: "Microchip",
    },
}