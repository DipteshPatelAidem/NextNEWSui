import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { maxBy, chain, get, find, findIndex, uniqBy } from 'lodash';
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
  UCNVersionList = [];

  displayVersionModal = false;
  versionConfigHistory = [];
  isValueChanged = false;
  getMatchVersion = [];

  fieldList = [{
    id: 'brandCode',
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



  constructor(
    public fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public ucnService: UCNService,
    private toastService: MessageService,
    private _loaderService: LoaderService) {
    this.loggedInUserCode = (decodeURI(this.route.snapshot.queryParams.uCode) || '').trim();
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
        this.getAllUCNVersion();
      }
    }, err => {
      console.log(err, 'getAdvertiser');
    });
  }

  getAllUCNVersion() {
    const companyID = this.ucnMasterForm.get('advertiser').value;
    this.ucnService.getAllUCNVersion(companyID).subscribe(res => {
      if (res) {
        this.clearFormArray(this.masters);
        this.patchMasterConfig(res);

        const result = chain((res || [])).groupBy("MasterConfigHeaderID").map((v, i) => {
          return {
            MasterConfigHeaderName: `Version ${i}`,
            StartDate: get(find(v, 'StartDate'), 'StartDate'),
            EndDate: get(find(v, 'EndDate'), 'EndDate'),
            EnteredByUserName: get(find(v, 'EnteredByUserName'), 'EnteredByUserName'),
            EnteredOn: get(find(v, 'EnteredOn'), 'EnteredOn'),
            configList: v
          }
        }).value();

        this.UCNVersionList = (result || []);
      }
    }, err => {
      console.log(err, 'getAllUCNVersion');
    });
  }

  patchMasterConfig(data) {
    const maxVersion = (maxBy(data || [], 'MasterConfigHeaderID') || {}).MasterConfigHeaderID;
    this.getMatchVersion = (data || []).filter(a => a.MasterConfigHeaderID == maxVersion);
    this.getMatchVersion.forEach(a => {
      this.masters.push(this.addConfig(a));
    });
  }

  onFormValueChange() {
    const initialValue = this.masters.getRawValue();

    let result = initialValue.filter((o1) => {
      return findIndex(this.getMatchVersion,
        { 'limit': o1.limit, 'key': o1.key, 'prefix': o1.prefix }
      ) !== -1 ? false : true;
    });

    this.isValueChanged = result.length != 0;
  }

  get masters() {
    return this.ucnMasterForm.get('masterConfigs') as FormArray;
  }

  initForm() {
    this.ucnMasterForm = this.fb.group({
      advertiser: ['', Validators.required],
      masterConfigs: new FormArray([], Validators.required)
    });
  }

  addConfig(item) {
    return this.fb.group({
      key: new FormControl(item.key, Validators.required),
      limit: new FormControl(item.limit, Validators.required),
      prefix: new FormControl(item.prefix),
    });
  }

  onAddNewMaster() {
    this.masters.push(this.addConfig({
      key: null,
      limit: 1,
      prefix: '',
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

  openVersionModal(configList) {
    this.displayVersionModal = true;
    this.versionConfigHistory = configList || [];
  }

  onCompanyChange() {
    this.getAllUCNVersion();
  }

  postMaster() {
    const formValue = this.ucnMasterForm.getRawValue();
    const MasterConfigHeaderID = parseInt(((this.getMatchVersion || [])[0] || {}).MasterConfigHeaderID || 0);
    const duplicateKeys = (formValue.masterConfigs || []).map(a => a.key);
    const checkDuplicate = duplicateKeys.filter((item, index) => duplicateKeys.indexOf(item) !== index)

    console.log(checkDuplicate);

    if (checkDuplicate.length) {
      this.displayError('Duplicate key not allowed.');
      return;
    }

    (formValue.masterConfigs || []).forEach((item, index) => {
      item.index = (index + 1);
      item.MasterConfigHeaderID = (MasterConfigHeaderID || 0) + 1;
    });

    return;

    const payload = {
      CompanyID: formValue.advertiser,
      EnteredBy: this.loggedInUserCode,
      ucndigitalmasterconfig: formValue.masterConfigs
    };

    if (this.ucnMasterForm.valid) {
      this.ucnService.postUCNMasterConfig(payload).subscribe(res => {
        if (res) {
          this._loaderService.HideLoader();
          this.toastService.add({ severity: 'success', summary: 'Success', detail: `Record submitted successfully.`, life: 3000 });
          this.getAllUCNVersion();
          this.isValueChanged = false;
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

  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }

}
