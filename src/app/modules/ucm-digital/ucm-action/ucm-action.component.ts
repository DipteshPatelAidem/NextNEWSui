import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LoaderService } from 'src/app/core/loader.service';
import { UCNService } from 'src/app/services/ucn.service';

@Component({
  selector: 'app-ucm-action',
  templateUrl: './ucm-action.component.html',
  styleUrls: ['./ucm-action.component.css'],
  providers: [MessageService]
})
export class UcmActionComponent {
  ucnForm: FormGroup;
  generatedUcnCode = new FormControl('HELLO', [Validators.required]);
  loggedInUserCode = '';
  loggedInUserName = '';
  visitCode;


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

  ngOnInit() {
    this.initForm();
    this.getBrand();
    this.getLanguage();
    this.getPlatform()
    this.getDuration()
    this.getRatio()
  }

  initForm() {
    this.ucnForm = this.fb.group({
      brandCode: [null, Validators.required],
      caption: ['', Validators.required],
      DurationID: [null, Validators.required],
      LanguageID: [null, Validators.required],

      PlatformCode: [null, Validators.required],
      FormatCode: [null, Validators.required],
      ratio: [null],
      InsertedUserCode: [(this.loggedInUserCode || '').trim()]
    });

  }

  onFormValueChange() {
    console.log('FORM CHANGE ::>');
    this.isCopy = false;
    this.generateUcnCode();
  }

  getBrand() {
    this.ucnService.getBrand().subscribe(res => {
      this.brandList = res || [];
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

  orFormatChange() {
    const pId = this.ucnForm.get('PlatformCode').value;
    this.formatList = [];
    if (pId) {
      this.getPlatformFormat(pId);
    }
  }

  getDuration() {
    this.ucnService.getDuration().subscribe(res => {
      this.durationList = res || [];
    });
  }

  getRatio() {
    this.ucnService.getRatio().subscribe(res => {
      this.ratioList = res || [];
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
    // this.ucnForm.get('UcnCode').setValue('');
  }

  onUcnSave() {
    const payload = this.ucnForm.getRawValue();
    const ucnCode = this.generatedUcnCode.value;

    if (this.ucnForm.valid) {
      console.log('PAYLOAD ::>', JSON.stringify({ ...payload, ...{ ucnCode } }));
    }
  }

  onUcnCancel() {
    this.router.navigate(['ucn-digital'], { queryParamsHandling: "merge" });
  }
}
