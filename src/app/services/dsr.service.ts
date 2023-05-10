import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { delay, map } from "rxjs/operators";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { API_URL } from "../core/api-endpoint.constant";


@Injectable({
    providedIn: "root"
})
export class DSRService {
    constructor(private http: HttpClient) { }

    getContactPersons(term: string = null) {
        if (term) {
            return this.http.get<any>(environment.baseURL + API_URL.getContactPersons + term).pipe(map(rsp => {
                rsp.push({ PersonName2: 'newItem', disabled: true });
                return rsp;
            }));
        } else {
            return of([]);
        }
    }

    getChannels(uCode) {
        return this.http.get<any>(environment.baseURL + API_URL.getChannels + uCode).pipe(map(rsp => rsp));
    }

    getAgency() {
        return this.http.get<any>(environment.baseURL + API_URL.getAgency).pipe(map(rsp => rsp));
    }

    getAdvertiser() {
        return this.http.get<any>(environment.baseURL + API_URL.getAdvertiser).pipe(map(rsp => rsp));
    }

    getPurpose() {
        return this.http.get<any>(environment.baseURL + environment.baseURL + API_URL.getPurpose).pipe(map(rsp => rsp));
    }

    getMeetingType() {
        return this.http.get<any>(environment.baseURL + API_URL.getMeetingType).pipe(map(rsp => rsp));
    }

    getAccompaniedBy() {
        return this.http.get<any>(environment.baseURL + API_URL.getAccompaniedBy).pipe(map(rsp => rsp));
    }

    getBrand(uCode) {
        return this.http.get<any>(environment.baseURL + API_URL.getBrand + uCode).pipe(map(rsp => rsp));
    }

    getFurtherAction() {
        return this.http.get<any>(environment.baseURL + API_URL.getFurtherAction).pipe(map(rsp => rsp));
    }

    getVisitReportList(uCode, startDate, endDate) {
        const params = new HttpParams()
            .set('uCode', decodeURI(uCode))
            .set('startDate', startDate)
            .set('endDate', endDate);
        return this.http.get<any>(environment.baseURL + API_URL.getVisitReportList, { params }).pipe(map(rsp => rsp));
    }

    getVisitReportByVisitCode(visitCode) {
        return this.http.get<any>(environment.baseURL + API_URL.getVisitReportByVisitCode + visitCode).pipe(map(rsp => rsp));
    }

    getTitlePerson() {
        return this.http.get<any>(environment.baseURL + API_URL.getTitlePerson).pipe(map(rsp => rsp));
    }

    postDsr(payload) {
        return this.http.post<any>(environment.baseURL + API_URL.postDsr, payload);
    }

    postContactPerson(payload) {
        return this.http.post<any>(environment.baseURL + API_URL.postContactPerson, payload);
    }
}

