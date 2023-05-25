import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LoaderService } from 'src/app/core/loader.service';
import { UCNService } from 'src/app/services/ucn.service';

@Component({
  selector: 'app-ucn-master',
  templateUrl: './ucn-master.component.html',
  styleUrls: ['./ucn-master.component.css'],
  providers: [MessageService]
})
export class UcnMasterComponent {
  ucnMasterForm: FormGroup;
  loggedInUserCode;
  loggedInUserName;
  displayDeleteModal = false;
  selectedRecord = 0;
  advertiserList = [];

  displayVersionModal = false;

  fieldList = [{
    id: 'brandName',
    name: 'Brand Code'
  },
  {
    id: 'caption',
    name: 'Caption'
  },
  {
    id: 'language',
    name: 'Language'
  },
  {
    id: 'duration',
    name: 'Duration'
  },
  {
    id: 'destination',
    name: 'Destination'
  },
  {
    id: 'format',
    name: 'Format'
  },
  {
    id: 'ratio',
    name: 'Ratio'
  }];

  masterConfigs = [{
    index: 1,
    field: 'brandName',
    value: 5,
    suffix: '',
    updatedBy: 'Jignesh',
    updatedDate: '24-05-2023 04:38PM'
  },
  {
    index: 2,
    field: 'caption',
    value: 5,
    suffix: '',
    updatedBy: 'Pulkit',
    updatedDate: '24-05-2023 04:38PM'
  },
  {
    index: 3,
    field: 'language',
    value: 2,
    suffix: '',
    updatedBy: 'Diptesh',
    updatedDate: '24-05-2023 04:38PM'
  },
  {
    index: 4,
    field: 'duration',
    value: 2,
    suffix: '',
    updatedBy: 'Tarun',
    updatedDate: '24-05-2023 04:38PM'
  },
  {
    index: 5,
    field: 'destination',
    value: 2,
    suffix: '',
    updatedBy: 'Jignesh',
    updatedDate: '24-05-2023 04:38PM'
  },
  {
    index: 6,
    field: 'format',
    value: 2,
    suffix: '',
    updatedBy: 'Jignesh',
    updatedDate: '24-05-2023 04:38PM'
  },
  {
    index: 7,
    field: 'ratio',
    value: 1,
    suffix: '',
    updatedBy: 'Jignesh',
    updatedDate: '24-05-2023 04:38PM'
  }];

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public ucnService: UCNService,
    private toastService: MessageService,
    private _loaderService: LoaderService) {
    this.loggedInUserCode = decodeURI(this.route.snapshot.queryParams.uCode);
    this.loggedInUserName = decodeURI(this.route.snapshot.queryParams.uName);
  }

  ngOnInit() {
    this.initForm();
    this.getAdvertiser();
  }

  getAdvertiser() {
    this.ucnService.getAdvertiser().subscribe(res => {
      if (res) {
        this.advertiserList = (res || []);
        this.ucnMasterForm.get('advertiser').setValue(this.advertiserList[0]?.CompanyID);
       // this.ucnMasterForm.get('advertiser').disable();
      }
    }, err => {
      console.log(err, 'getAdvertiser');
    });
  }

  get masters() {
    return this.ucnMasterForm.get('masterConfigs') as FormArray;
  }

  initForm() {
    this.ucnMasterForm = this.fb.group({
      advertiser: ['', Validators.required],
      masterConfigs: new FormArray([])
    });

    this.masterConfigs.forEach(a => {
      this.masters.push(this.addConfig(a));
    });
  }

  addConfig(item) {
    return this.fb.group({
      index: new FormControl({ value: item.index, disabled: true }, Validators.required),
      field: new FormControl(item.field, Validators.required),
      value: new FormControl(item.value, Validators.required),
      suffix: new FormControl(item.suffix, Validators.required),
      updatedBy: new FormControl(item.updatedBy, Validators.required),
      updatedDate: new FormControl(item.updatedDate, Validators.required),
    });
  }

  onAddNewMaster() {
    this.masters.push(this.addConfig({
      index: 8,
      field: null,
      value: 1,
      suffix: '',
      updatedBy: '',
      updatedDate: ''
    }));
  }

  openRemoveMasterConfirmation(index) {
    this.selectedRecord = index;
    this.displayDeleteModal = true;
  }

  onRemoveMasterConfig() {
    this.masters.removeAt(this.selectedRecord);
    this.displayDeleteModal = false;
  }

  openVersionModal(){
    this.displayVersionModal = true;
  }

}
