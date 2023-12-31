import { Component } from "@angular/core";
import { Map } from "leaflet";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  // @ts-ignore
  private map: Map;

  receiveMap(map: Map) {
    this.map = map;
  }
}
