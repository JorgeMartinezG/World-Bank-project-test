import { Injectable } from "@angular/core";
import { LayersList } from "../types";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class MapService {
  constructor(private http: HttpClient) {}

  getOverlays(): Observable<LayersList> {
    return this.http.get<LayersList>("http://localhost:3000");
  }
}
