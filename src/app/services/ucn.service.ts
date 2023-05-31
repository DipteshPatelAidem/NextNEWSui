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

    getAdvertiser() {
        return this.http.get<any>(environment.baseURL + API_URL.getUcnAdvertiser).pipe(map(rsp => rsp));
    }

    getBrand(advertiser) {
        return this.http.get<any>(environment.baseURL + API_URL.getUcnBrand + advertiser).pipe(map(rsp => rsp));
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

    getDuration() {
        return this.http.get<any>(environment.baseURL + API_URL.getUcnDuration).pipe(map(rsp => rsp));
    }

    getRatio() {
        return this.http.get<any>(environment.baseURL + API_URL.getUcnRatio).pipe(map(rsp => rsp));
    }

    getAllUCN(uCode) {
        return this.http.get<any>(environment.baseURL + API_URL.getAllUcn).pipe(map(rsp => rsp));
    }

    previewUCN(payload) {
        return this.http.post<any>(environment.baseURL + API_URL.previewUCN, payload).pipe(map(rsp => rsp));
    }

    saveUCN(payload) {
        return this.http.post<any>(environment.baseURL + API_URL.saveUCN, payload).pipe(map(rsp => rsp));
    }

    getAllUCNVersion(companyID) {
        return this.http.get<any>(environment.baseURL + API_URL.getUcnVersionList + companyID).pipe(map(rsp => rsp));
    }

    postUCNMasterConfig(payload) {
        return this.http.post<any>(environment.baseURL + API_URL.saveUCNMaster, payload).pipe(map(rsp => rsp));
    }

}