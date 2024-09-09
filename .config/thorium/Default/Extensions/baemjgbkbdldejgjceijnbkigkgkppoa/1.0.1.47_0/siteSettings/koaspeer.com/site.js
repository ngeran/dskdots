var snapEDASiteSettings = {
    "/products/": {
        partNameSelector: `ul.breadcrumb li.active`,
        partNamePattern: "^(.*)$",
        manufacturerSelector: `.vsh-footer-copyright-with-ecia > p`,
        manufacturerPattern: "©[0-9]{4} ([^ ]+) ",
        manufacturerOverride: "KOA Speer",
    },
}