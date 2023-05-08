import { Component } from '@angular/core';
import { LoaderService } from './core/loader.service';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'NEWS';
  show: boolean;

  constructor(private _loaderService: LoaderService,
    private router: Router) {
    const _navigate = this.router.navigate;
    this.router.navigate = function (commands: any[], extras: any = {}) {
      extras = { ...extras, preserveQueryParams: extras.preserveQueryParams !== undefined ? extras.preserveQueryParams : true };
      return _navigate.call(this, commands, extras);
    };
  }

  ngOnInit() {
    this._loaderService.loadState.subscribe(res => {
      this.show = res;
    });
  }

}
