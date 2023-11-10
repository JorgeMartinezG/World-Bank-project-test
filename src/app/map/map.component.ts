import {
  Component,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import { Map, control, MapOptions, tileLayer, latLng } from "leaflet";
import * as L from "leaflet";
import "leaflet-control-geocoder";
import { Layer, LayersList, Overlay } from "../types";
import { MapService } from "./map.service";

const layers = {
  topo: L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
    maxZoom: 17,
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
  }),
  esriTopo: L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    {
      attribution:
        "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community",
    },
  ),
  esriGray: L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    {
      attribution: "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ",
      maxZoom: 16,
    },
  ),
  osm: tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    opacity: 0.7,
    maxZoom: 19,
    detectRetina: true,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }),
};

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.css"],
})
export class MapComponent implements OnDestroy {
  @Output() map$: EventEmitter<Map> = new EventEmitter();
  @Input() options: MapOptions = {
    layers: [layers.esriTopo],
    zoom: 3,
    center: latLng(0, 0),
  };
  public map: Map;

  constructor(private mapService: MapService) {}

  ngOnDestroy() {
    this.map.clearAllEventListeners;
    this.map.remove();
  }

  onMapReady(map: Map) {
    const basemaps = {
      "Esri Topo": layers.esriTopo,
      Openstreetmap: layers.osm,
      "Topo map": layers.topo,
      "Esri Gray": layers.esriGray,
    };

    // Add layers from server.
    this.mapService.getOverlays().subscribe((res: LayersList) => {
      const overlays = res.layers.reduce(
        (acc: Overlay, item: Layer) => ({
          ...acc,
          [item.title]: tileLayer.wms(item.url, {
            layers: item.id,
            format: "image/png",
            version: "1.1.0",
            transparent: true,
          }),
        }),
        {},
      );

      control.layers(basemaps, overlays, { collapsed: false }).addTo(map);
    });

    (L.Control as any).geocoder({ collapsed: false }).addTo(map);

    this.map = map;
    this.map$.emit(map);
  }
}
