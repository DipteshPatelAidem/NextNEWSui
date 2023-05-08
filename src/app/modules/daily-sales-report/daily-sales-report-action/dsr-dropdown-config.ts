export class DropDownConfig {
    patch(dsrComponent) {
        this.getChannels(dsrComponent);
        this.getAgency(dsrComponent);
        this.getAdvertiser(dsrComponent);
        this.getPurpose(dsrComponent);
        this.getMeetingType(dsrComponent);
        this.getAccompaniedBy(dsrComponent);
        this.getBrand(dsrComponent);
        this.getFurtherAction(dsrComponent);
        this.getTitlePerson(dsrComponent);
    }

    getChannels(dsrComponent) {
        dsrComponent.dsrService.getChannels(dsrComponent.loggedInUserCode).subscribe(res => {
            if (res) {
                dsrComponent.channelList = res || [];
                this.fetchAll(dsrComponent);
            }
        }, err => {
            console.log(err, 'getChannels');
        });
    }

    getAgency(dsrComponent) {
        dsrComponent.dsrService.getAgency().subscribe(res => {
            if (res) {
                dsrComponent.agencyList = res || [];
                this.fetchAll(dsrComponent);
            }
        }, err => {
            console.log(err, 'getAgency');
        });
    }

    getAdvertiser(dsrComponent) {
        dsrComponent.dsrService.getAdvertiser().subscribe(res => {
            if (res) {
                dsrComponent.advertiserList = res || [];
                dsrComponent.contactOfList = (res || []).map(a => ({ code: a.AdvertiserCode, name: a.AdvertiserName }));
                this.fetchAll(dsrComponent);
            }
        }, err => {
            console.log(err, 'getAdvertiser');
        });
    }

    getPurpose(dsrComponent) {
        dsrComponent.dsrService.getPurpose().subscribe(res => {
            if (res) {
                dsrComponent.purposeList = res || [];
                this.fetchAll(dsrComponent);
            }
        }, err => {
            console.log(err, 'getPurpose');
        });
    }

    getMeetingType(dsrComponent) {
        dsrComponent.dsrService.getMeetingType().subscribe(res => {
            if (res) {
                dsrComponent.meetingTypeList = res || [];
                this.fetchAll(dsrComponent);
            }
        }, err => {
            console.log(err, 'getMeetingType');
        });
    }

    getAccompaniedBy(dsrComponent) {
        dsrComponent.dsrService.getAccompaniedBy().subscribe(res => {
            if (res) {
                dsrComponent.accompaniedByList = res || [];
                this.fetchAll(dsrComponent);
            }
        }, err => {
            console.log(err, 'getAccompaniedBy');
        });
    }

    getBrand(dsrComponent) {
        dsrComponent.dsrService.getBrand(dsrComponent.loggedInUserCode).subscribe(res => {
            if (res) {
                dsrComponent.brandList = res || [];
                this.fetchAll(dsrComponent);
            }
        }, err => {
            console.log(err, 'getBrand');
        });
    }

    getFurtherAction(dsrComponent) {
        dsrComponent.dsrService.getFurtherAction().subscribe(res => {
            if (res) {
                dsrComponent.furtherActionList = res || [];
                this.fetchAll(dsrComponent);
            }
        }, err => {
            console.log(err, 'getFurtherAction');
        });
    }

    getTitlePerson(component) {
        component.dsrService.getTitlePerson().subscribe(res => {
            if (res) {
                component.titlePersonCode = res || [];
                if (component?.newPersonForm?.get('intTitlePersonCode')) {
                    component?.newPersonForm?.get('intTitlePersonCode').setValue(((res || [])[0] || {}).GenericID);
                }
            }
        }, err => {
            console.log(err, 'titleOfPersons');
        });
    }

    getVisitReportList(dsrComponent) {
        dsrComponent.dsrService.getVisitReportList().subscribe(res => {
            if (res) {
                dsrComponent.visitReportList = res || [];
            }
        }, err => {
            console.log(err, 'getVisitReportList');
        });
    }

    getVisitReportByVisitCode(dsrComponent) {
        dsrComponent.dsrService.getVisitReportByVisitCode().subscribe(res => {
            if (res) {
                dsrComponent.visitReportByVisitCode = res || [];
                this.fetchAll(dsrComponent);
            }
        }, err => {
            console.log(err, 'getVisitReportByVisitCode');
        });
    }

    fetchAll(cmp) {
        if (cmp.furtherActionList.length
            && cmp.brandList.length
            && cmp.accompaniedByList.length
            && cmp.meetingTypeList.length
            && cmp.purposeList.length
            && cmp.advertiserList.length
            && cmp.agencyList.length
            && cmp.channelList.length
            && cmp.visitCode) {
            cmp.getVisitReportByVisitCode();
        }
    }

}