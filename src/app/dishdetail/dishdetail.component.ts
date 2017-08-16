import {Component, Inject, Input, OnInit} from '@angular/core';
import {Dish} from '../shared/dish';
import {DishService} from '../services/dish.service';
import {ActivatedRoute, Params} from '@angular/router';
import {Location} from '@angular/common';
import 'rxjs/add/operator/switchMap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Comment} from '../shared/comment';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  animations: [
    trigger('visibility', [
      state('shown', style({
        transform: 'scale(1.0)',
        opacity: 1
      })),
      state('hidden', style({
        transform: 'scale(0.5)',
        opacity: 0
      })),
      transition('* => *', animate('0.5s ease-in-out'))
    ])
  ]
})

export class DishdetailComponent implements OnInit {
  feedbackForm: FormGroup;    // Form model that will host the reactive form
  feedback: Comment;         // Corresponding data model

  dish: Dish;
  dishcopy = null;
  dishIds: number[];
  prev: number;
  next: number;
  errMess: string;
  visibility = 'shown';

  formErrors = {
    'author': '',
    'rating': '',
    'comment': ''
  };

  validationMessages = {
    'author': {
      'required':      'First Name is required.',
      'minlength':     'First Name must be at least 2 characters long.',
    },
    'comment': {
      'required':      'Comment is required.'
    }
  };

  onValueChanged(data?: any) {
    if (!this.feedbackForm) { return; }
    const form = this.feedbackForm;
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  constructor(private dishservice: DishService,
              private route: ActivatedRoute, @Inject('BaseURL') private BaseURL,
              private location: Location, private fb: FormBuilder) {
    this.createForm();
  }

  ngOnInit() {

    this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds, errmess => this.errMess = <any>errmess);
    this.route.params
      .switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishservice.getDish(+params['id']); })
      .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; },
        errmess => { this.dish = null; this.errMess = <any>errmess; });
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2)]],
      rating: 5,
      comment: ''
    });

    this.feedbackForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();  // reset form validation messages
  }

  setPrevNext(dishId: number) {
    let index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1)%this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1)%this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }

  onSubmit() {
    this.feedback = this.feedbackForm.value;
    this.feedback.date = (new Date()).toISOString();
    this.dishcopy.comments.push(this.feedback);
    this.dishcopy.save()
      .subscribe(dish => { this.dish = dish; console.log(this.dish); });
    console.log(this.feedback);
    this.feedbackForm.reset({
      author: '',
      rating: 5,
      comment: ''
    });
  }
}
