var snapEDASiteSettings = {
    "/ProductDetail/": {
        partNameSelector: "span#spnManufacturerPartNumber",
        partNamePattern: "^(.*)$",
        manufacturerSelector: `tr[id="pdp_specs_SpecList[0]"] td.attr-value-col`,
        manufacturerPattern: "^(.*)$",
    },
}