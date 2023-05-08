import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { delay, map } from "rxjs/operators";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";

export const API_URL = {
    getChannels: environment.baseURL + 'channel/GetChannels?uCode=',
    getContactPersons: environment.baseURL + 'ContactPerson/GetContactPersons?search=',
    getAgency: environment.baseURL + 'agency/GetAgency',
    getAdvertiser: environment.baseURL + 'advertiser/GetAdvertiser',
    getPurpose: environment.baseURL + 'purpose/GetPurpose',
    getMeetingType: environment.baseURL + 'meetingtype/GetMeetingType',
    getAccompaniedBy: environment.baseURL + 'accompniedby/GetAccompniedBy',
    getBrand: environment.baseURL + 'brand/GetBrand?uCode=',
    getFurtherAction: environment.baseURL + 'furtheraction/GetFurtherAction',
    getVisitReportList: environment.baseURL + 'visitreport/GetVisitReportList',
    getVisitReportByVisitCode: environment.baseURL + 'visitreport/GetVisitReportByVisitCode?VisitCode=',
    getTitlePerson: environment.baseURL + 'titleperson/GetTitlePerson',
    postDsr: environment.baseURL + 'visitreport/VisitReportPost',
    postContactPerson: environment.baseURL + 'ContactPerson/ContactPersonPost'
};


@Injectable({
    providedIn: "root"
})
export class DSRService {
    constructor(private http: HttpClient) { }

    getContactPersons(term: string = null) {
        if (term) {
            return this.http.get<any>(API_URL.getContactPersons + term).pipe(map(rsp => {
                rsp.push({ PersonName2: 'newItem', disabled: true });
                return rsp;
            }));
        } else {
            return of([]);
        }
    }

    getChannels(uCode) {
        return this.http.get<any>(API_URL.getChannels + uCode).pipe(map(rsp => rsp));
    }

    getAgency() {
        return this.http.get<any>(API_URL.getAgency).pipe(map(rsp => rsp));
    }

    getAdvertiser() {
        return this.http.get<any>(API_URL.getAdvertiser).pipe(map(rsp => rsp));
    }

    getPurpose() {
        return this.http.get<any>(API_URL.getPurpose).pipe(map(rsp => rsp));
    }

    getMeetingType() {
        return this.http.get<any>(API_URL.getMeetingType).pipe(map(rsp => rsp));
    }

    getAccompaniedBy() {
        return this.http.get<any>(API_URL.getAccompaniedBy).pipe(map(rsp => rsp));
    }

    getBrand(uCode) {
        return this.http.get<any>(API_URL.getBrand +uCode).pipe(map(rsp => rsp));
    }

    getFurtherAction() {
        return this.http.get<any>(API_URL.getFurtherAction).pipe(map(rsp => rsp));
    }

    getVisitReportList(uCode, startDate, endDate) {
        const params = new HttpParams()
            .set('uCode', decodeURI(uCode))
            .set('startDate', startDate)
            .set('endDate', endDate);
        return this.http.get<any>(API_URL.getVisitReportList, { params }).pipe(map(rsp => rsp));
    }

    getVisitReportByVisitCode(visitCode) {
        return this.http.get<any>(API_URL.getVisitReportByVisitCode + visitCode).pipe(map(rsp => rsp));
    }

    getTitlePerson() {
        return this.http.get<any>(API_URL.getTitlePerson).pipe(map(rsp => rsp));
    }

    postDsr(payload) {
        return this.http.post<any>(API_URL.postDsr, payload);
    }

    postContactPerson(payload) {
        return this.http.post<any>(API_URL.postContactPerson, payload);
    }
}

