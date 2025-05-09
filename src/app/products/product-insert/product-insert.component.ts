import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ProductService } from '../../services/product.service';
import { fromEvent, exhaustMap } from 'rxjs';

@Component({
    selector: 'app-product-insert',
    templateUrl: './product-insert.component.html',
    styleUrls: ['./product-insert.component.css'],
    imports: [FormsModule, ReactiveFormsModule]
})
export class ProductInsertComponent implements OnInit {

  insertForm: FormGroup;
  name: FormControl;
  price: FormControl;
  description: FormControl;
  imageUrl: FormControl;

  @ViewChild('form') form: ElementRef;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) { }

  ngAfterViewInit(): void {
    fromEvent(this.form.nativeElement, 'submit')
      .pipe(
        exhaustMap(() => this
          .productService
          .insertProduct(this.insertForm.value))
      )
      .subscribe({
          next: (product) => {
            console.log('Product saved with id: ' + product.id);
            this.productService.initProducts();
            this.router.navigateByUrl('/products');
          },
          error: (error) => console.log('Could not save product: ' + error)
        }
      )
  }

  // onSubmit() {
  //   const newProduct = this.insertForm.value;
  //   console.log(newProduct);
  //   this
  //     .productService
  //     .insertProduct(newProduct)
  //     .subscribe({
  //       next: (product) => {
  //         console.log('Product saved with id: ' + product.id);
  //         this.productService.resetList();
  //         this.router.navigateByUrl('/products');
  //       },
  //       error: (error) => console.log('Could not save product: ' + error)
  //     }
  //   )
  // }

  ngOnInit() {
    let validImgUrlRegex: string = '^(https?\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,5}(?:\/\S*)?(?:[-A-Za-z0-9+&@#/%?=~_|!:,.;])+\.(?:jpg|jpeg|gif|png))$';

    this.name = new FormControl('', [Validators.required, Validators.maxLength(50)]);
    this.price = new FormControl('', [Validators.required, Validators.min(0), Validators.max(10000000)]);
    this.description = new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(500)]);
    this.imageUrl = new FormControl('', [Validators.pattern(validImgUrlRegex)]);

    this.insertForm = this.fb.group(
      {
        'name': this.name,
        'price': this.price,
        'description': this.description,
        'imageUrl': this.imageUrl,
        'discontinued': false,
        'fixedPrice': false
      }
    );
  }

}
