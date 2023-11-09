const express = require("express");
var cors = require('cors')
const app = express();

app.use(cors())

app.get("/", (request, response) => {
    const layers = [
        {
            title: "GPWv4: Population Density – 2015",
            url: "http://sedac.ciesin.columbia.edu/geoserver/wms",
            id: "gpw-v4:gpw-v4-population-density_2015"
        },
        {
            title: "Probabilities of Urban Expansion to 2030",
            url: "http://sedac.ciesin.columbia.edu/geoserver/wms",
            id: "lulc:lulc-global-grid-prob-urban-expansion-2030"
        }
    ]

    response.json({total: layers.length, layers});
});

app.listen(3000, () => {
    console.log("Listen on the port 3000...");
});
