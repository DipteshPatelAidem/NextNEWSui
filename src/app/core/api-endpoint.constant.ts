export const API_URL = {
    // DSR
    getChannels: 'channel/GetChannels?uCode=',
    getContactPersons: 'ContactPerson/GetContactPersons?search=',
    getAgency: 'agency/GetAgency',
    getAdvertiser: 'advertiser/GetAdvertiser',
    getPurpose: 'purpose/GetPurpose',
    getMeetingType: 'meetingtype/GetMeetingType',
    getAccompaniedBy: 'accompniedby/GetAccompniedBy',
    getBrand: 'brand/GetBrand?uCode=',
    getFurtherAction: 'furtheraction/GetFurtherAction',
    getVisitReportList: 'visitreport/GetVisitReportList',
    getVisitReportByVisitCode: 'visitreport/GetVisitReportByVisitCode?VisitCode=',
    getTitlePerson: 'titleperson/GetTitlePerson',
    postDsr: 'visitreport/VisitReportPost',
    postContactPerson: 'ContactPerson/ContactPersonPost',

    // UCN
    getUcnBrand : 'ucn/GetBrand',
    getUcnLanguage : 'ucn/GetLanguage',
    getUcnPlatform : 'ucn/Getplatform',
    getUcnPlatformFormat : 'ucn/GetplatformFormat?platform=',
    getUcnDuration : 'ucn/GetDuration',
    getUcnRatio : 'ucn/GetRatio'
};