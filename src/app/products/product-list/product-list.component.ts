import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, EMPTY, combineLatest, Subscription, tap, catchError, startWith, count, map, debounceTime, filter, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

import { Product } from '../product.interface';
import { ProductService } from '../../services/product.service';
import { FavouriteService } from '../../services/favourite.service';
import { AsyncPipe, UpperCasePipe, SlicePipe, CurrencyPipe } from '@angular/common';

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css'],
    imports: [RouterLink, AsyncPipe, UpperCasePipe, SlicePipe, CurrencyPipe, ReactiveFormsModule]
})
export class ProductListComponent {

  title: string = 'Products';
  selectedProduct: Product;
  errorMessage;
  filter = new FormControl('');
  //latestFavouriteProduct: Product;

  products$: Observable<Product[]>;
  productsNb$: Observable<number>;
  filter$: Observable<string>;
  filteredProducts$: Observable<Product[]>;
  filtered$: Observable<boolean>;
  favouriteAdded$: Observable<Product>;

  constructor(
    private productService: ProductService,
    private favouriteService: FavouriteService,
    private router: Router) {

      this.favouriteAdded$ = this
                                .favouriteService
                                .favouriteAdded$
                                .pipe(
                                  filter(product => product != null),
                                  tap(console.log),
                                 // takeUntilDestroyed(),
                                )

    this.products$ = this
                      .productService
                      .products$
                      .pipe(
                        catchError(
                          error => {
                            alert(error);
                            return EMPTY;
                          }
                        )
                      );

    this.filter$ = this
                      .filter
                      .valueChanges
                      .pipe(
                        map(text => text.trim()), // remove extra white spaces
                        filter(text => text == '' || text.length >= 3), // min 3 char (or no filter)
                        debounceTime(500),
                        distinctUntilChanged(),
                        tap((products) => this.resetPagination()),
                        startWith('')
                      )

      this.filtered$ = this
                        .filter$
                        .pipe(
                          map(text => text.length > 0)
                        )


       this.filteredProducts$ = combineLatest([this.products$, this.filter$])
                      .pipe(
                        map(([products, filterString]) =>
                          products.filter(product =>
                            product.name.toLowerCase().includes(filterString.toLowerCase())
                          )
                        )
                      )

      this.productsNb$ = this
            .filteredProducts$
            .pipe(
              map(products => products.length),
              startWith(0)
            )
  }

  get favourites(): number {
    return this.favouriteService.getFavouritesNb();
  }

  // Pagination
  pageSize = 5;
  start = 0;
  end = this.pageSize;
  currentPage = 1;

  previousPage() {
    this.start -= this.pageSize;
    this.end -= this.pageSize;
    this.currentPage--;
    this.selectedProduct = null;
  }

  nextPage() {
    this.start += this.pageSize;
    this.end += this.pageSize;
    this.currentPage++;
    this.selectedProduct = null;
  }

  onSelect(product: Product) {
    this.selectedProduct = product;
    this.router.navigateByUrl('/products/' + product.id);
  }

  reset() {
    this.productService.resetList();
    this.router.navigateByUrl('/products'); // self navigation to force data update
  }

  resetPagination() {
    this.start = 0;
    this.end = this.pageSize;
    this.currentPage = 1;
  }
}
