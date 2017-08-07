import { Component, OnInit } from '@angular/core';
import {Dish} from '../shared/dish';
import {DISH} from '../shared/dishes';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  dishes: Dish[] = DISH;
  selectedDish = DISHES[0];

  constructor() { }

  ngOnInit() {
  }

}