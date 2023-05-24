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
  masterConfigs = [{
    index: 1,
    field: 'brandName',
    value: 5,
    suffix: ''
  },
  {
    index: 2,
    field: 'caption',
    value: 5,
    suffix: ''
  },
  {
    index: 3,
    field: 'language',
    value: 2,
    suffix: ''
  },
  {
    index: 4,
    field: 'duration',
    value: 2,
    suffix: ''
  },
  {
    index: 5,
    field: 'destination',
    value: 2,
    suffix: ''
  },
  {
    index: 6,
    field: 'format',
    value: 2,
    suffix: ''
  },
  {
    index: 7,
    field: 'ratio',
    value: 1,
    suffix: ''
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
  }

  get masters() {
    return this.ucnMasterForm.get('masterConfigs') as FormArray;
  }

  initForm() {
    this.ucnMasterForm = this.fb.group({
      masterConfigs: new FormArray([])
    });

    this.masterConfigs.forEach(a => {
      this.masters.push(this.addConfig(a));
    });
  }

  addConfig(item) {
    return this.fb.group({
      index: new FormControl(item.index, Validators.required),
      field: new FormControl(item.field, Validators.required),
      value: new FormControl(item.value, Validators.required),
      suffix: new FormControl(item.suffix, Validators.required),
    });
  }


}
