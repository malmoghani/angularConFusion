import { Component, OnInit, Inject } from '@angular/core';
import { PromotionService } from '../services/promotion.service';
import { DishService } from '../services/dish.service';
import { Dish } from '../shared/dish';
import { Promotion } from '../shared/promotion';

import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';
import { flyInOut, expand } from '../animations/app.animation';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
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
export class HomeComponent implements OnInit {
  dish!: Dish;
  dishErrMess!: string;
  promotionErrMess!: string;
  leadErrMess!: string;
  promotion!: Promotion;
  featuredLeader!: Leader;


  constructor(
    private dishService: DishService,
    private promotionService: PromotionService,
    private leadService: LeaderService,
    @Inject('BaseURL') private BaseURL: string
  ) { }

  getBaseURL(): string {
    return this.BaseURL;
  }

  ngOnInit(): void {
    this.dishService.getFeaturedDish().subscribe((dish) => (this.dish = dish), errmess => this.dishErrMess = <any>errmess);

    this.promotionService
      .getFeaturedPromostion()
      .subscribe((promotion) => (this.promotion = promotion), errmess => this.promotionErrMess = <any>errmess);

    this.leadService
      .getFeaturedLeader()
      .subscribe((featuredLeader) => (this.featuredLeader = featuredLeader), errmess => this.leadErrMess = <any>errmess);
  }
}
