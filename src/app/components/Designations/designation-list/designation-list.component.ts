import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { catchError, concat, debounceTime, distinctUntilChanged, Observable, of, Subject, switchMap, tap } from "rxjs";
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-designation-list',
  templateUrl: './designation-list.component.html',
  styleUrls: ['./designation-list.component.css']
})
export class DesignationListComponent implements OnInit {
  dsrForm: FormGroup;
  designations: any[] = [];

  people$: Observable<any[]>;
  peopleLoading = false;
  peopleInput$ = new Subject<string>();
  enableAddNewPeople = false;

  cars = [
    { id: 1, name: 'Volvo' },
    { id: 2, name: 'Saab' },
    { id: 3, name: 'Opel' },
    { id: 4, name: 'Audi' },
  ];

  constructor(public fb: FormBuilder, public dataService: DataService) { }

  ngOnInit(): void {
    this.initForm();
    this.loadPeople();
  }

  initForm() {
    this.dsrForm = this.fb.group({
      business: [[], Validators.required],
      purpose: ['', Validators.required],
      dateOfMeeting: [formatDate(new Date(), 'yyyy-MM-dd', 'en'), Validators.required],
      meetingType: ['', Validators.required],
      accompanied: ['', Validators.required],

      nameOfAttendee: [null, Validators.required],
      agency: ['', Validators.required],
      companyAffiliation: ['', Validators.required],
      brand: ['', Validators.required],

      meetingFeedback: ['', Validators.required],
      actionItems: [[]],
      actionOther: [''],
      proposalValue: ['', Validators.required],
    });
  }

  trackByFn(item) {
    return item.id;
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
            return this.dataService.getPeople(searchTerm).pipe(
              catchError(() => of([])), // empty list on error
              tap((res) => {
                console.log(res);
                this.peopleLoading = false;
                this.enableAddNewPeople = (res || []).length == 0;
              })
            )
          } else {
            this.peopleLoading = false;
            if (this.enableAddNewPeople) {
              this.enableAddNewPeople = false;
            }
            return of([]);
          }
        })
      )
    );
  }


  onPeopleDropdownOpen() {
    this.dsrForm.get('nameOfAttendee').setValue(null);
  }

}
