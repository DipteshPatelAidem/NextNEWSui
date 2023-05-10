import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { delay, map } from "rxjs/operators";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { API_URL } from "../core/api-endpoint.constant";


@Injectable({
    providedIn: "root"
})
export class UCNService {
    constructor(private http: HttpClient) { }

    getBrand() {
        return this.http.get<any>(environment.baseURL + API_URL.getUcnBrand).pipe(map(rsp => rsp));
    }

    getLanguage() {
        return this.http.get<any>(environment.baseURL + API_URL.getUcnLanguage).pipe(map(rsp => rsp));
    }

    getPlatform() {
        return this.http.get<any>(environment.baseURL + API_URL.getUcnPlatform).pipe(map(rsp => rsp));
    }

    getPlatformFormat(pId) {
        return this.http.get<any>(environment.baseURL + API_URL.getUcnPlatformFormat + pId).pipe(map(rsp => rsp));
    }

    getDuration(){
        return this.http.get<any>(environment.baseURL + API_URL.getUcnDuration).pipe(map(rsp => rsp));
    }

    getRatio(){
        return this.http.get<any>(environment.baseURL + API_URL.getUcnRatio).pipe(map(rsp => rsp));
    }
}