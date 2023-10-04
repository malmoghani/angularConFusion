import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validator, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';
import { visibility, flyInOut, expand } from '../animations/app.animation';

@Component({
  selector: 'app-dish-detail',
  templateUrl: './dish-detail.component.html',
  styleUrls: ['./dish-detail.component.scss'],

  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [visibility(), flyInOut(), expand()]

})
export class DishDetailComponent implements OnInit {
  dish: Dish | null | undefined;
  dishIds: string[];
  prev: string;
  next: string;
  errMess: string | undefined;
  dishcopy: any;

  commentForm: any;
  comment: Comment | undefined;
  shadowComment: Comment | undefined;

  visibility = 'shown';

  @ViewChild('fform') commentFormDirective: any;



  constructor(
    private dishService: DishService,
    private loaction: Location,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    @Inject('BaseURL') private BaseURL: any
  ) {
    this.dishIds = [];
    this.prev = 'null';
    this.next = 'null';
    this.createForm();
  }

  getBaseURL(): string {
    return this.BaseURL;
  }

  ngOnInit() {
    this.dishService
      .getDishIds()
      .subscribe((dishIds) => (this.dishIds = dishIds));
    this.route.params
      .pipe(
        switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishService.getDish(params['id']) })
      )
      .subscribe((dish) => {
        this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id);
        this.visibility = 'shown';
      }, errmess => this.errMess = <any>errmess);
  }

  formErrors: { [key: string]: string } = {
    author: '',
    comment: '',
  };

  validationMessages: { [key: string]: { [key: string]: string } } = {
    author: {
      required: 'Author Name is required.',
      minlength: 'Author Name must be at least 2 characters long.',
      maxlength: 'Author Name cannot be more than 25 characters long.',
    },
    rating: {
      required: 'Last Name is required.',
      minlength: 'Last Name must be at least 2 characters long.',
      maxlength: 'Last Name cannot be more than 25 characters long.',
    },
    comment: {
      required: 'Comment required.',
    },

  };

  goBack(): void {
    this.loaction.back();
  }

  setPrevNext(dishId: any) {
    const index = this.dishIds?.indexOf(dishId);
    this.prev =
      this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];

    this.next =
      this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  createForm() {
    this.commentForm = this.fb.group({
      author: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(25),
        ],
      ],
      rating: [
        5,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(5),
        ],
      ],
      comment: ['', Validators.required],

    });

    this.commentForm.valueChanges.subscribe((data: any) =>
      this.onValueChanged(data)
    );

    this.onValueChanged(); // (re)set validation messages now
  }

  onValueChanged(data?: any) {
    if (!this.commentForm) {
      return;
    }

    const form = this.commentForm;
    this.shadowComment = form.value;
    console.log(this.shadowComment);
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit() {
    this.comment = this.commentForm.value;
    this.commentForm.reset({
      author: '',
      rating: 5,
      comment: '',

    });
    this.commentFormDirective.resetForm();
    this.shadowComment = {};

    this.dish?.comments?.push({ ...this.comment, date: new Date().toISOString() });

    this.dishService.putDish(this.dishcopy)
      .subscribe(dish => {
        this.dish = dish; this.dishcopy = dish;
      },
        errmess => { this.dish = null; this.dishcopy = null; this.errMess = <any>errmess; });


  }

}
