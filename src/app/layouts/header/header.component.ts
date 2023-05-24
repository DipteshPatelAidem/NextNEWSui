import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router';
import { sortBy } from 'lodash';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userDetails;
  unReadNotifications = [];
  allNotifications = [];
  loggedInUserName = '';
  greetLabel = '';
  logo = 'A';
  homeRedirectLink = environment.homeRedirectURL || 'https://mis.aidem.in/aidem/MenuForm.aspx';

  constructor(@Inject(DOCUMENT) private document: Document,
    private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.loggedInUserName = this.getParameterByName('uName');
    this.initGreet();
    this.initLogo()
  }

  initGreet() {
    const hrs = new Date().getHours();
    let greet;

    if (hrs < 12)
      greet = 'Good Morning';
    else if (hrs >= 12 && hrs <= 17)
      greet = 'Good Afternoon';
    else if (hrs >= 17 && hrs <= 24)
      greet = 'Good Evening';

    this.greetLabel = this.loggedInUserName ? (greet + ' ' + this.loggedInUserName) : '';
  }

  initLogo() {
    const intials = (this.loggedInUserName || '').split(' ');
    const firstChar = intials[0] || '';
    const secChar = intials[1] || '';
    this.logo = firstChar.charAt(0) + secChar.charAt(0);
  }

  getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  goToHomePage() {
    this.router.navigate(['daily-sales-report'], { queryParamsHandling: "merge" });
  }
}
