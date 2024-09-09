var snapEDASiteSettings = {
    "estore\.heilindasia\.com/.*partdetail.asp": {
        partNameSelector: `h1`,
        partNamePattern: "^Part Detail: (.*)$",
        manufacturerSelector: `table.partdetail tr:nth-child(3) td:nth-child(2)`,
        manufacturerPattern: "^(.*)$",
    },
    "heilind\.com/.*html": {
        partNameSelector: `td[data-th="Manufacturer Part Number"]`,
        partNamePattern: "^(.*)$",
        manufacturerSelector: `td[data-th="Manufacturer"]`,
        manufacturerPattern: "^(.*)$",
    },
}