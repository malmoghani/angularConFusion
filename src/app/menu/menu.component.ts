import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { flyInOut, expand } from '../animations/app.animation';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut(), expand()
  ]
})
export class MenuComponent implements OnInit {
  dishes: Dish[] | undefined;
  errMess: string | undefined;

  constructor(private dishService: DishService,
    @Inject('BaseURL') private BaseURL: string) { }

  getBaseURL(): string {
    return this.BaseURL;
  }

  ngOnInit() {
    this.dishService.getDishes().subscribe((dishes) => (this.dishes = dishes), errmess => this.errMess = <any>errmess);
  }


}
