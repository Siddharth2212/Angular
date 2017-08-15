import {Component, Input, OnInit} from '@angular/core';
import {Dish} from '../shared/dish';
import {DishService} from '../services/dish.service';
import {ActivatedRoute, Params} from '@angular/router';
import {Location} from '@angular/common';
import 'rxjs/add/operator/switchMap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Comment} from '../shared/comment';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})

export class DishdetailComponent implements OnInit {
  feedbackForm: FormGroup;    // Form model that will host the reactive form
  feedback: Comment;         // Corresponding data model

  dish: Dish;
  dishIds: number[];
  prev: number;
  next: number;

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
              private route: ActivatedRoute,
              private location: Location, private fb: FormBuilder) {
    this.createForm();
  }

  ngOnInit() {

    this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    this.route.params
      .switchMap((params: Params) => this.dishservice.getDish(+params['id']))
      .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); });
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
    this.dish.comments.push(this.feedback);
    console.log(this.feedback);
    this.feedbackForm.reset({
      author: '',
      rating: 5,
      comment: ''
    });
  }
}
