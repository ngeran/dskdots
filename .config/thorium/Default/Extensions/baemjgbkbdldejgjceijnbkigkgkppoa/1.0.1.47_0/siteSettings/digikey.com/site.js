var snapEDASiteSettings = {
    "products/detail/.*": {
        partNameSelector: `td[data-testid="mfr-number"] div`,
        partNamePattern: "^(.*)$",
        manufacturerSelector: `tr[data-testid="overview-manufacturer"] td:nth-child(2) div`,
        manufacturerPattern: "^(.*)$",
    },
    "product-detail/.*": {
        partNameSelector: "#product-overview tr:nth-child(3) > td",
        partNamePattern: "^\\s*(.*)\\s*$",
        manufacturerSelector: "#product-overview tr:nth-child(2) > td",
        manufacturerPattern: "^\\s*(.*)\\s*$",
    },
}