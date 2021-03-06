import {Component, Inject, OnInit} from '@angular/core';
import {Dish} from '../shared/dish';
import {Promotion} from '../shared/promotion';
import {DishService} from '../services/dish.service';
import {LeaderService} from '../services/leader.service';
import {PromotionService} from '../services/promotion.service';
import {Leader} from '../shared/leader';
import { flyInOut, expand } from '../animations/app.animation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
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
  dish: Dish;
  promotion: Promotion;
  leader: Leader;
  errMess: string;
  errMessPromotion: string;
  errMessLeader: string;

  constructor(@Inject('BaseURL') private BaseURL, private dishService: DishService,
              private promotionService: PromotionService, private leaderService: LeaderService) { }

  ngOnInit() {
    this.dishService.getFeaturedDish().subscribe(dish => this.dish = dish, errmess => this.errMess = <any>errmess);
    this.promotionService.getFeaturedPromotion()
      .subscribe(promotion => this.promotion = promotion, errmess => this.errMessPromotion = <any>errmess);
    this.leaderService.getFeaturedLeader()
      .subscribe(leader => this.leader = leader, errmess => this.errMessLeader = <any>errmess);
  }

}
