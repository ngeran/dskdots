var snapEDASiteSettings = {
    "/products/": {
        partNameSelector: `h2.part-number > strong`,
        partNamePattern: "^(.*)$",
        manufacturerSelector: `div.desktop-footer > div.row:nth-of-type(2) div.spacer > p`,
        manufacturerPattern: "© [0-9]{4} ([^\.]*)\.",
    },
}