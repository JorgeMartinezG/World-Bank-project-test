const findTagsByPath = require("xml-utils/find-tags-by-path.js");
const findTagByName = require("xml-utils/find-tag-by-name.js");
const express = require("express");
var cors = require("cors");
const app = express();

app.use(cors());

app.get("/", (request, response) => {
  // For using hardcoded layers, uncomment the following block.
  /*
  const layers = [
    {
      title: "GPWv4: Population Density – 2015",
      url: "http://sedac.ciesin.columbia.edu/geoserver/wms",
      id: "gpw-v4:gpw-v4-population-density_2015",
    },
    {
      title: "Probabilities of Urban Expansion to 2030",
      url: "http://sedac.ciesin.columbia.edu/geoserver/wms",
      id: "lulc:lulc-global-grid-prob-urban-expansion-2030",
    },
  ];

  response.json({ total: layers.length, layers });
  */

  // Check layers.txt file for more layer ids.
  const allowedLayers = [
    "gpw-v4:gpw-v4-population-density_2015",
    "lulc:lulc-global-grid-prob-urban-expansion-2030",
    "wildareas-v2:wildareas-v2-last-of-the-wild-geographic",
  ];

  const serverUrl = "http://sedac.ciesin.columbia.edu/geoserver/wms";

  const capabilitiesUrl = `${serverUrl}?service=WMS&request=getcapabilities`;

  fetch(capabilitiesUrl)
    .then((res) => res.text())
    .then((xmlstr) => {
      const xmlArray = findTagsByPath(xmlstr, ["Layer", "Layer"]).map(
        (t) => t.outer,
      );
      const parsedLayers = xmlArray.map((xmlItem) => ({
        title: findTagByName(xmlItem, "Title").inner,
        id: findTagByName(xmlItem, "Name").inner,
      }));

      return parsedLayers;
    })
    .then((layers) =>
      layers.filter((layer) => allowedLayers.includes(layer.id)),
    )
    .then((layers) => layers.map((layer) => ({ ...layer, url: serverUrl })))
    .then((layers) => ({ total: layers.length, layers }))
    .then((output) => {
      console.log(output);
      response.json(output);
    });
});

app.listen(3000, () => {
  console.log("Listen on the port 3000...");
});
