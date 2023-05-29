import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LoaderService } from 'src/app/core/loader.service';
import { DSRService } from 'src/app/services/dsr.service';
import { UCNService } from 'src/app/services/ucn.service';

@Component({
  selector: 'app-ucm-action',
  templateUrl: './ucm-action.component.html',
  styleUrls: ['./ucm-action.component.css'],
  providers: [MessageService]
})
export class UcmActionComponent {
  ucnForm: FormGroup;
  generatedUcnCode = new FormControl('', [Validators.required]);
  loggedInUserCode = '';
  loggedInUserName = '';
  visitCode;

  advertiserList = [];
  brandList = [];
  durationList = [];
  languageList = [];
  platformList = [];
  formatList = [];
  ratioList = [];
  isCopy = false;

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public ucnService: UCNService,
    private toastService: MessageService,
    private _loaderService: LoaderService) {
    this.loggedInUserCode = decodeURI(this.route.snapshot.queryParams.uCode);
    this.loggedInUserName = decodeURI(this.route.snapshot.queryParams.uName);
    this.visitCode = this.route.snapshot.params.id;
    console.log(this.loggedInUserCode, 'this.loggedInUserCode', this.visitCode);
  }

  async ngOnInit() {
    this.initForm();
    await this.getAdvertiser();
    this.getBrand();
    this.getLanguage();
    this.getPlatform()
    this.getDuration()
  }

  initForm() {
    this.ucnForm = this.fb.group({
      brandCode: [null, Validators.required],
      caption: ['', [Validators.required, Validators.minLength(4)]],
      DurationID: [null, Validators.required],
      LanguageID: [null, Validators.required],

      PlatformCode: [null, Validators.required],
      FormatCode: [null, Validators.required],
      ratio: [null],
      InsertedUserCode: [(this.loggedInUserCode || '').trim()],
      CompanyID: [1]
    });

  }

  onFormValueChange() {
    console.log('FORM CHANGE ::>');
    this.isCopy = false;
    this.generateUcnCode();
  }

  getAdvertiser() {
    this.ucnService.getAdvertiser().subscribe(res => {
      if (res) {
        this.advertiserList = (res || []);
        this.ucnForm.get('CompanyID').setValue(this.advertiserList[0]?.CompanyID);
       // this.ucnForm.get('CompanyID').disable();
        console.log('GET ADVERTISER :>');
      }
    }, err => {
      console.log(err, 'getAdvertiser');
    });
  }

  getBrand() {
    const advertiser = this.ucnForm.get('CompanyID').value;
    this.ucnService.getBrand(advertiser).subscribe(res => {
      this.brandList = res || [];
    console.log('GET BRAND :>');
    });
  }

  getLanguage() {
    this.ucnService.getLanguage().subscribe(res => {
      this.languageList = res || [];
    });
  }

  getPlatform() {
    this.ucnService.getPlatform().subscribe(res => {
      this.platformList = res || [];
    });
  }

  getPlatformFormat(pId) {
    this.ucnService.getPlatformFormat(pId).subscribe(res => {
      this.formatList = res || [];
    });
  }

  onFormatChange() {
    this.ucnForm.get('FormatCode').setValue(null);
    const pId = this.ucnForm.get('PlatformCode').value;
    const platform = this.platformList.find(a => a.Platform == pId);
    this.formatList = [];

    if (pId) {
      this.getPlatformFormat(platform?.PlatformID);
    }
  }

  onPlatformFormatChange() {
    this.ratioList = [];
    const pId = this.ucnForm.get('PlatformCode').value;
    const formatCode = this.ucnForm.get('FormatCode').value;
    if (pId && formatCode) {
      this.getRatio(pId, formatCode);
    }

  }

  getDuration() {
    this.ucnService.getDuration().subscribe(res => {
      this.durationList = res || [];
    });
  }

  getRatio(pId, formatCode) {
    this.ucnService.getRatio().subscribe(res => {
      this.ratioList = (res || []).filter(a => a.Platform == pId && a.Format == formatCode);
    });
  }

  onCopyToClipboard() {
    const ucnCode = this.generatedUcnCode.value;

    if (ucnCode) {
      const selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = ucnCode;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
      this.isCopy = true;
    }
  }

  generateUcnCode() {
    if (this.ucnForm.valid) {
      this.onPreviewUcn();
    }
  }

  onPreviewUcn() {
    const formData = this.ucnForm.getRawValue();
    if (!this.ucnForm.valid) {
      this.ucnForm.markAllAsTouched();
      return;
    }

    const payload = {
      "UCNdigitalCode": "",
      "brandname": formData.brandCode,
      "caption": formData.caption,
      "duration": formData.DurationID,
      "language": formData.LanguageID,
      "platform": formData.PlatformCode,
      "format": formData.FormatCode,
      "ratio": formData.ratio,
      "InsertedUserCode": formData.InsertedUserCode
    };

    this._loaderService.ShowLoader();
    this.ucnService.previewUCN(payload).subscribe(res => {
      if (res && res.length) {
        this.generatedUcnCode.setValue(res[0].UCNdigitalCode);
        this.displayErrorSuccess('UCN generated successfully.', true);
      } else {
        this.displayErrorSuccess('Internal Server Error.');
      }
      this._loaderService.HideLoader();
    }, err => {
      this._loaderService.HideLoader();
      this.displayErrorSuccess('Internal Server Error.');
    });
  }

  onUcnSave() {
    if (!this.ucnForm.valid) {
      this.ucnForm.markAllAsTouched();
      return;
    }

    const formData = this.ucnForm.getRawValue();
    const ucnCode = this.generatedUcnCode.value;

    const payload = {
      "UCNid": null,
      "UCNdigitalCode": ucnCode,

      "BrandID": this.getIdFromName(formData.brandCode, 'Brand', 'BrandID', this.brandList),
      //"brandname": formData.brandCode,

      "caption": formData.caption,
      "DurationID": this.getIdFromName(formData.DurationID, 'DurationCode', 'DurationID', this.durationList),
      //"duration": formData.DurationID,

      "LanguageID": this.getIdFromName(formData.LanguageID, 'Language', 'LanguageID', this.languageList),
      //"language": formData.LanguageID,

      "PlatformID": this.getIdFromName(formData.PlatformCode, 'Platform', 'PlatformID', this.platformList),
      //"platform": formData.PlatformCode,

      "FormatID": this.getIdFromName(formData.FormatCode, 'Format', 'FormatID', this.formatList),
      //"format": formData.FormatCode,

      "RatioID": this.getIdFromName(formData.ratio, 'Ratio', 'RatioID', this.ratioList),
      //"ratio": formData.ratio,
      "config": '',

      "EnteredBy": formData.InsertedUserCode,
      "UpdatedBy": null,
      "CompanyID": 1, //formData.CompanyID
    };

    this._loaderService.ShowLoader();
    this.ucnService.saveUCN(payload).subscribe(res => {
      if (res) {
        // this.generatedUcnCode.setValue(res[0].UCNdigitalCode);
        this.displayErrorSuccess('UCN submitted successfully.', true);
        setTimeout(() => { this.onUcnCancel() }, 2000);
      } else {
        this.displayErrorSuccess('Internal Server Error.');
      }
      this._loaderService.HideLoader();
    }, err => {
      this._loaderService.HideLoader();
      this.displayErrorSuccess('Internal Server Error.');
    });
  }

  getIdFromName(name, matchKey, returnKey, list) {
    const matchRecord = (list || []).find(a => a[matchKey] == name);
    if (matchRecord) {
      return matchRecord[returnKey];
    }
    return null;
  }

  displayErrorSuccess(message, isSucess = false) {
    this.toastService.add({ severity: isSucess ? 'success' : 'error', summary: isSucess ? 'Success' : 'Error', detail: message, life: 3000 });
  }

  onUcnCancel() {
    this.router.navigate(['ucn-digital'], { queryParamsHandling: "merge" });
  }
}
