import { Component, OnInit, Inject } from '@angular/core';
import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';
import { flyInOut, expand } from '../animations/app.animation';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    expand()
  ]

})
export class AboutComponent implements OnInit {
  leaders: Leader[] | undefined;
  errMess: string | undefined;
  constructor(private leadService: LeaderService, @Inject('BaseURL') private BaseURL: string) { }

  getBaseURL(): string {
    return this.BaseURL;
  }

  ngOnInit() {
    this.leadService
      .getLeaders()
      .subscribe((leaders) => (this.leaders = leaders), errmess => this.errMess = <any>errmess);
  }
}




