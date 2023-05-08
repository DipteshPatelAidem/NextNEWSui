import { formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, concat, of, distinctUntilChanged, debounceTime, tap, switchMap, catchError } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { DSRService } from 'src/app/services/dsr.service';
import { DropDownConfig } from './dsr-dropdown-config';
import { MessageService } from 'primeng/api';
import { LoaderService } from 'src/app/core/loader.service';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-daily-sales-report-action',
  templateUrl: './daily-sales-report-action.component.html',
  styleUrls: ['./daily-sales-report-action.component.css'],
  providers: [MessageService]
})
export class DailySalesReportActionComponent {
  dsrForm: FormGroup;
  newPersonForm: FormGroup;

  people$: Observable<any[]>;
  peopleLoading = false;
  peopleInput$ = new Subject<string>();
  enableAddNewPeople = false;

  channelList = [];
  agencyList = [];
  advertiserList = [];
  purposeList = [];
  meetingTypeList = [];
  accompaniedByList = [];
  brandList = [];
  furtherActionList = [];
  visitReportList = [];
  visitCode;
  loggedInUserCode = '';
  loggedInUserName = '';
  openNewPersonAddModal = false;

  titlePersonCode = [];
  contactForList = [{
    label: 'Advertiser',
    code: 'A'
  },
  {
    label: 'Agency',
    code: 'G'
  }];
  contactOfList = [];
  currentPeopleList = [];
  firstLoad = false;

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public dataService: DataService,
    public dsrService: DSRService,
    private toastService: MessageService,
    private _loaderService: LoaderService) {
    this.loggedInUserCode = decodeURI(this.route.snapshot.queryParams.uCode);
    this.loggedInUserName = decodeURI(this.route.snapshot.queryParams.uName);
    this.visitCode = this.route.snapshot.params.id;
    console.log(this.loggedInUserCode, 'this.loggedInUserCode', this.visitCode);
  }

  ngOnInit(): void {
    this.loadPeople();
    const dropdownConfig = new DropDownConfig();
    dropdownConfig.patch(this);

    this.initForm();
    this.initPersonForm();
  }

  initForm() {
    this.dsrForm = this.fb.group({
      ChannelCode: [[], Validators.required],
      VisitDate: [new Date().toISOString().split('T')[0], Validators.required],
      PersonCode: [null, Validators.required],
      PurposeID: [null, Validators.required],

      AgencyCode: [null],
      AdvertiserCode: [null],

      MeetingTypeID: [null, Validators.required],
      AccompaniedByCodes: [null],
      BrandCodes: [null],
      MeetingFeedback: [null, Validators.required],
      ActionName: [''],
      actionOther: [null],
      ProposalValue: [''],
      InsertedUserCode: [(this.loggedInUserCode || '').trim()]
    });
  }

  initPersonForm() {
    this.newPersonForm = this.fb.group({
      PersonCode: [''],
      PersonName: ['', Validators.required],
      intContactTypeCode: ['21'],
      intDesignationCode: [null],
      intTitlePersonCode: [''],
      intDepartmentCode: [null],
      intContactForCode: [null, Validators.required],
      strContactFor: ["A"],
      intEnteredBy: [(this.loggedInUserCode || '').trim()],
      intDelFlag: [null]
    });
  }

  private loadPeople() {
    this.people$ = concat(
      of([]), // default items
      this.peopleInput$.pipe(
        distinctUntilChanged(),
        debounceTime(800),
        tap(() => (this.peopleLoading = true)),
        switchMap((searchTerm: any) => {
          if (searchTerm && searchTerm.length > 2) {
            return this.dsrService.getContactPersons(searchTerm).pipe(
              catchError(() => of([])), // empty list on error
              tap((res) => {
                this.peopleLoading = false;
                this.enableAddNewPeople = (res || []).length == 0;
                this.currentPeopleList = res || [];
              })
            )
          } else {
            this.peopleLoading = false;
            if (this.enableAddNewPeople) {
              this.enableAddNewPeople = false;
            }
            console.log(this.currentPeopleList, 'else')
            return of(this.currentPeopleList);
          }
        })
      )
    );
  }

  onAffiliationChange() {
    const meetCode = this.dsrForm.get('PersonCode').value;
    const matchAdv = this.currentPeopleList.find(a => a.PersonCode == meetCode);
    if (matchAdv) {

      if (matchAdv.ContactFor == 'A') {
        this.dsrForm.get('AdvertiserCode').setValue(matchAdv.ContactForCode);
      } else {
        this.dsrForm.get('AgencyCode').setValue(matchAdv.ContactForCode);
      }
    }
  }

  onRemovePeople() {
    this.people$ = of([]);
    this.loadPeople();
  }

  onPeopleDropdownOpen() {
    if (this.visitCode && this.firstLoad) {
      //this.dsrForm.get('PersonCode').setValue(null);
      this.loadPeople();
      this.firstLoad = false;
    }
  }

  onActionItemChange() {
    const action = this.dsrForm.get('ActionName').value;
    if (action == 'Other') {
      this.dsrForm.get('actionOther').setValidators(Validators.required);
    } else {
      this.dsrForm.get('actionOther').clearValidators()
    }
    this.dsrForm.get('actionOther').updateValueAndValidity();
  }

  onDsrSave() {
    const payload = this.dsrForm.getRawValue();

    // if (payload && !payload.ActionName) {
    //   payload.ActionName = 'Follow up';
    // }

    if (payload && payload.ActionName == "Other") {
      payload.ActionName = payload.ActionName + ' - ' + payload.actionOther;
    }

    if (!payload.InsertedUserCode) {
      this.displayError('Userid is missing please open link again.');
    }

    if (this.visitCode) {
      payload.VisitCode = this.visitCode;
    }

    console.log('PAYLOAD :>', JSON.stringify(payload));
    if (this.dsrForm.valid) {
      this.dsrService.postDsr(payload).subscribe(res => {

        this._loaderService.HideLoader();
        this.toastService.add({ severity: 'success', summary: 'Success', detail: `Record ${!this.visitCode ? 'submitted' : 'updated'} successfully.`, life: 3000 });

        if (!this.visitCode) {
          this.dsrForm.reset();
          setTimeout(() => this.initForm());
        }

        this.scrollTop();
        setTimeout(() => { this.onDsrCancel() }, 4000);
      }, err => {
        console.log('POST ERROR :>', err);
        this._loaderService.HideLoader();
        this.displayError('Internal Server Error.');
        this.scrollTop();
      });
    } else {
      this.dsrForm.markAllAsTouched();
      this._loaderService.HideLoader();
      this.displayError('Please fill all required field(s).');
      this.scrollTop();
    }
  }

  scrollTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }


  getVisitReportByVisitCode() {
    this.dsrService.getVisitReportByVisitCode(this.visitCode).subscribe(res => {
      if (res && res.length) {
        const data = res[0];

        if (data && data.VisitDate) {
          data.VisitDate = data.VisitDate.split('T')[0];
        }

        if (data && data.OutcomeOfMeetingName) {
          data.ActionName = data.OutcomeOfMeetingName;
        }
        if (data && data.PersonCode) {
          this.people$ = of([
            {
              PersonName2: data.PeopleMeet,
              PersonCode: data.PersonCode,
              ContactFor: data.contactOf,
              ContactForCode: data.intContactForCode
            }]);
        }

        this.dsrForm.patchValue(data);
        this.firstLoad = true;
      }
    }, err => {
      console.log('getVisitReportByVisitCode ERROR :>', err);
      this._loaderService.HideLoader();
      this.firstLoad = true;
      this.displayError('Internal Server Error.');
    })
  }

  addNewPerson() {
    this.initPersonForm();
    this.newPersonForm.get('intTitlePersonCode').setValue((this.titlePersonCode[0] || {}).GenericID)
    this.openNewPersonAddModal = true;
  }

  onContactOfChange() {
    const contactOf = this.newPersonForm.get('strContactFor').value;
    if (contactOf == 'A') {
      this.contactOfList = this.advertiserList.map(a => ({ code: a.AdvertiserCode, name: a.AdvertiserName }));
    } else {
      this.contactOfList = this.agencyList.map(a => ({ code: a.AgencyCode, name: a.AgencyName }));
    }

    this.newPersonForm.get('intContactForCode').setValue(null);
  }

  onNewPersonSave() {
    const payload = cloneDeep(this.newPersonForm.getRawValue());

    if (!payload.intEnteredBy) {
      this.displayError('Userid is missing please open link again.');
    }

    console.log('PAYLOAD :>', JSON.stringify(payload));
    if (this.newPersonForm.valid) {
      this.dsrService.postContactPerson(payload).subscribe(res => {
        if (res) {
          this._loaderService.HideLoader();
          this.toastService.add({ severity: 'success', summary: 'Success', detail: `Record submitted successfully.`, life: 3000 });
          this.openNewPersonAddModal = false;

          const companyName = this.contactOfList.find(a => a.code == payload.intContactForCode);

          this.people$ = of([{
            PersonName2: `${payload.PersonName} - ${(companyName.name || '')} (${payload.intContactForCode} - ${payload.strContactFor})`,
            PersonCode: res || 0,
            ContactFor: payload.strContactFor,
            ContactForCode: payload.intContactForCode

          }]);

          this.dsrForm.get('PersonCode').setValue(res);
        }
      }, err => {
        console.log('POST ERROR :>', err);
        this._loaderService.HideLoader();
        this.displayError('Internal Server Error.');
      });
    } else {
      this._loaderService.HideLoader();
      this.displayError('Please fill all required item.');
    }
  }

  displayError(message) {
    this.toastService.add({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
  }

  onDsrCancel() {
    this.router.navigate(['daily-sales-report'], { queryParamsHandling: "merge" });
  }

}

